import dbPool from "../db.js";
import jwt from "jsonwebtoken";

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.pen) return res.sendStatus(401);
  const refreshToken = cookies.pen;
  res.clearCookie("pen", { httpOnly: true, sameSite: "None", secure: true });

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.RT_KEY, async (err, decoded) => {
    if (err) {
      console.log("expired refresh token");
      return res.sendStatus(403); // Forbidden
    }

    // Retrieve the user from the tb_users table using the username
    const query = "SELECT * FROM tb_users WHERE id = ?";
    const [foundUser] = await dbPool.query(query, [decoded.id]);

    // Detected refresh token reuse!
    if (foundUser.length === 0) {
      console.log("attempted refresh token reuse!");
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          usr_name: decoded.usr_name,
          usr_role: foundUser.usr_role,
        },
      },
      process.env.AT_KEY,
      { expiresIn: "10s" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: foundUser.id,
        usr_name: decoded.usr_name,
        usr_role: foundUser.usr_role,
      },
      process.env.RT_KEY,
      {
        expiresIn: "1d",
      }
    );

    // Update the user's usr_refresh_token field in the tb_users table
    const updateQuery =
      "UPDATE tb_users SET usr_refresh_token = ? WHERE id = ?";
    await dbPool.query(updateQuery, [newRefreshToken, foundUser.id]);

    // Creates Secure Cookie with refresh token
    res.cookie("pen", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    const userId = foundUser.id;
    const user = foundUser.usr_name;
    const role = foundUser.usr_role.toLowerCase();
    res.json({ userId, usr_name, role, accessToken });

    // Additional step to update usr_refresh_token in the tb_users table
    const updateRefreshTokenQuery =
      "UPDATE tb_users SET usr_refresh_token = ? WHERE id = ?";
    await dbPool.query(updateRefreshTokenQuery, [
      newRefreshToken,
      foundUser.id,
    ]);
  });
};

module.exports = { handleRefreshToken };

// const handleRefreshToken = async (req, res) => {
//   const cookies = req.cookies;
//   if (!cookies?.pen) return res.sendStatus(401);
//   const refreshToken = cookies.pen;

//   const q = "SELECT * FROM tb_users WHERE usr_refresh_token = ?";

//   const [foundUser] = await dbPool.query(q, [refreshToken]);

//   console.log("This is foundUser", foundUser);
//   if (!foundUser) return res.sendStatus(403).json("Access Not Allowed"); //Forbidden

//   // evaluate jwt
//   jwt.verify(refreshToken, process.env.RT_KEY, async (err, decoded) => {
//     if (err || foundUser.usr_email !== decoded.usr_email) return res.sendStatus(403);

//     //console.log("Attempted refresh token reuse!");
//     const q = "SELECT * FROM tb_users WHERE usr_email = ?";
//     const [hackedUser] = dbPool.query(q, [decoded.usr_email]);
//     hackedUser.usr_refresh_token = "";

//     const qr = "UPDATE tb_users SET usr_refresh_token = ? WHERE usr_id = ?";
//     const [result] = await dbPool.query(qr, [refreshToken, foundUser.usr_id]);
//     //console.log("update result below:");
//     //console.log(result);

//     const role = foundUser.usr_role;
//     const accessToken = jwt.sign(
//       {
//         UserInfo: {
//           usr_email: decoded.usr_email,
//           usr_role: usr_role,
//         },
//       },
//       process.env.AT_KEY,
//       { expiresIn: "10s" }
//     );

//     const newRefreshToken = jwt.sign(
//       {
//         id: foundUser.usr_id,
//         email: decoded.usr_email,
//         user: foundUser.usr_name,
//       },
//       process.env.RT_KEY,
//       { expiresIn: "1d" }
//     );

//     // Saving refreshToken with current user

//     const qry = "UPDATE tb_users SET usr_refresh_token = ? WHERE usr_id = ?";
//     const refResult = await dbPool.query(qry, [
//       newRefreshToken,
//       foundUser.usr_id,
//     ]);
//     console.log("update refResult below:");
//     console.log(refResult);

//     // Creates Secure Cookie with refresh token
//     res.cookie("pen", newRefreshToken, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "None",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.json({ role, accessToken });
//   });
// };

// module.exports = { handleRefreshToken };
