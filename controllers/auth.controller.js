import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { login, refresh } from "../routes/auth.route.js";
import dbPool from "../db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const cookies = req.cookies;

  const { email, password } = req.body;
  //test for empty data

  if (email === "" || password === "") {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  //send request to database to pull user's data
  const [loginData] = await login(req.body);

  //test if the user was found or not
  if (loginData === undefined)
    return res.status(404).json("User does not exists.");

  console.log(
    "sent password and db password: ",
    password,
    loginData.usr_password
  );
  //Check the password if user does exists
  const isPasswordCorrect = await bcrypt.compare(
    password,
    loginData.usr_password
  );

  //if password in DB does not match what user send
  if (!isPasswordCorrect) {
    return res.status(402).json("You have entered a wrong password");
  }

  //set secret key for creating the Access Token
  const key = process.env.AT_KEY;
  //Create the access token by encoding usr_it, usr_name and usr_role
  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: loginData.id,
        usr_name: loginData.usr_name,
        usr_role: loginData.usr_role,
      },
    },
    key,
    { expiresIn: "10s" }
  );

  //create refresh token
  const refreshToken = jwt.sign(
    {
      id: loginData.id,
      usr_name: loginData.usr_name,
      usr_role: loginData.usr_role,
    },
    process.env.RT_KEY,
    {
      expiresIn: "1d",
    }
  );

  if (cookies.pen) {
    const refreshToken = cookies.pen;
    const [foundToken] = await dbPool.query(
      "SELECT usr_refresh_token FROM tb_users WHERE id = ?",
      [loginData.id]
    );

    // Detected refresh token reuse!
    if (!foundToken) {
      console.log("attempted refresh token reuse at login!");
      // clear out ALL previous refresh tokens
      refreshToken = null;
      const q = "UPDATE tb_users SET usr_refresh_token = ? WHERE id = ?";
      const [result] = await dbPool.query(q, [refreshToken, loginData.id]);
      res.clearCookie("pen", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }
  }

  // Creates Secure Cookie with refresh token
  res.cookie("pen", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 24 * 60 * 60 * 1000,
  });
  //destruct the password from the rest of the user info so we don't send the password in the response
  //const { usr_password, usr_email, usr_dt_created, ...userData } = loginData;

  // res.cookie("pen", refreshToken, {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: "None",
  //   maxAge: 24 * 60 * 60 * 1000,
  // });

  const userId = loginData.id;
  const user = loginData.usr_name;
  const role = loginData.usr_role.toLowerCase();

  res.json({ userId, user, role, accessToken, email });
});

/* ************END OF LOGIN************** */

// Function to generate an access token
// function generateAccessToken(userData) {
//   const { usr_id, usr_name, usr_role } = userData;
//   const accessTokenExpiration = "10s";
//   const accessTokenPayload = {
//     UserInfo: { usr_id, usr_name, usr_role },
//   };

//   const accessToken = jwt.sign(accessTokenPayload, process.env.AT_KEY, {
//     expiresIn: accessTokenExpiration,
//   });
//   return accessToken;
// }

// // Function to generate a refresh token
// function generateRefreshToken(usr_id) {
//   const refreshTokenExpiration = "1d";
//   const refreshTokenPayload = { usr_id };

//   const refreshToken = jwt.sign(refreshTokenPayload, process.env.RT_KEY, {
//     expiresIn: refreshTokenExpiration,
//   });
//   return refreshToken;
// }

/* ************REFRESH TOKEN BEGIN************** */

router.get("/refresh", async (req, res) => {
  const cookies = req.cookies;
  console.log(" refresh here. cookies", cookies);
  if (!cookies?.pen) return res.sendStatus(401);
  const refreshToken = cookies.pen;
  console.log("refresh here. refreshToken", refreshToken);
  res.clearCookie("pen", { httpOnly: true, sameSite: "None", secure: true });

  // Verify the refresh token
  jwt.verify(refreshToken, process.env.RT_KEY, async (err, decoded) => {
    if (err) {
      console.log("expired refresh token");
      return res.sendStatus(403); // Forbidden
    }
    //console.log("refresh here. decoded", decoded);
    // Retrieve the user from the tb_users table using the username
    const query = "SELECT * FROM tb_users WHERE id = ?";
    const [foundUser] = await dbPool.query(query, [decoded.id]);
    console.log("refresh here. foundUser: ", foundUser);
    // Detected refresh token reuse!
    if (foundUser.length === 0) {
      console.log("attempted refresh token reuse!");
      return res.sendStatus(403); // Forbidden
    }

    // const foundUser = rows[0];
    // const newRefreshTokenArray = foundUser.usr_refresh_token.split(',').filter((rt) => rt !== refreshToken);

    // Refresh token was still valid

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser[0].id,
          usr_email: decoded.usr_name,
          usr_role: foundUser[0].usr_role,
        },
      },
      process.env.AT_KEY,
      { expiresIn: "10s" }
    );

    const newRefreshToken = jwt.sign(
      {
        id: foundUser[0].id,
        usr_email: decoded.usr_name,
        usr_role: foundUser[0].usr_role,
      },
      process.env.RT_KEY,
      {
        expiresIn: "1d",
      }
    );

    // Update the user's usr_refresh_token field in the tb_users table
    const updateQuery =
      "UPDATE tb_users SET usr_refresh_token = ? WHERE id = ?";
    await dbPool.query(updateQuery, [newRefreshToken, foundUser[0].id]);

    // Creates Secure Cookie with refresh token
    res.cookie("pen", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Additional step to update usr_refresh_token in the tb_users table
    const updateQ = "UPDATE tb_users SET usr_refresh_token = ? WHERE id = ?";
    await dbPool.query(updateQ, [newRefreshToken, foundUser[0].id]);

    const role = foundUser[0].usr_role.toLowerCase();
    const user = foundUser[0].usr_name;
    const userId = foundUser[0].id;
    console.log("role, user at the bottom of refresh: ", role, user);
    res.json({ userId, user, role, newRefreshToken });
  });
});

//module.exports = { handleRefreshToken };

//   const cookies = req.cookies;
//   console.log("cookies.pen in REFRESH", cookies.pen);
//   if (!cookies?.pen) return res.sendStatus(401);
//   const token = cookies.pen;
//   console.log("I am really in REFRESH. token: ", token);
//   const [foundUser] = await auth.refresh(token);

//   console.log("This is foundUser", foundUser);
//   if (foundUser === undefined) return res.sendStatus(403); //Forbidden
//   // evaluate jwt
//   jwt.verify(currentToken, process.env.RT_KEY, async (err, decoded) => {
//     if (err) return res.sendStatus(403);
//     console.log("Attempted refresh token reuse!");
//     // const q = "SELECT * FROM tb_users WHERE usr_email = ?";
//     // const [hackedUser] = dbPool.query(q, [decoded.usr_email]);
//     // hackedUser.usr_refresh_token = "";

//     // const qr = "UPDATE tb_users SET usr_refresh_token = ? WHERE usr_id = ?";
//     // const result = await dbPool.query(qr, [refreshToken, foundUser.usr_id]);
//     // console.log("update result below:");
//     // console.log(result);

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
// });

/* **********REFRESH ENDS******************* */

/* **********LOGOUT BEGINS******************* */

router.get("/logout", async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.pen) return res.sendStatus(204); //No content
  const token = cookies.pen;
  console.log("logout here. token: ", token);
  // Is refreshToken in db?
  const [foundUser] = await refresh(token);
  console.log("auth.controller.js logout route. foundUser: ", foundUser);
  if (!foundUser) {
    res.clearCookie("pen", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  const delToken = null;
  const q = "UPDATE tb_users SET usr_refresh_token = ? WHERE id = ?";
  const refResult = await dbPool.query(q, [delToken, foundUser.id]);

  console.log(refResult);

  res.clearCookie("pen", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
});

/* ***********END OF LOGOUT********** */

export default router;
