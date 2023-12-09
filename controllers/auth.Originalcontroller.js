import dbPool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adduser = (req, res) => {
  //CHECK IF USER EXISTS
  console.log("Inside the adduser route");
  const q = "SELECT * FROM tb_users WHERE usr_email = ?";

  dbPool.query(q, [req.body.usr_email], (err, data) => {
    if (err) return res.json(err);
    if (data.length) return res.status(409).json("User Already Exists");

    //HASH the password and create a user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.usr_password, salt);

    const q =
      "INSERT INTO tb_users(`usr_name`, `usr_email`,`usr_password`,`usr_role`,`usr_dt_created`,`usr_createdby`) VALUES (?) ";
    const values = [
      req.body.usr_name,
      req.body.usr_email,
      hash,
      req.body.usr_role,
      req.body.usr_dt_created,
      req.body.usr_createdby,
    ];

    dbPool.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User added successfully");
    });
  });
};

const login = (req, res) => {
  const { usr_email, usr_password } = req.body;
  console.log("usr_email: ", usr_email);
  if (!usr_email || !usr_password)
    return res
      .status(400)
      .json({ message: "Email and Password are required." });
  //Check if user exists
  const q = "SELECT * FROM tb_users WHERE usr_email = ?;";
  dbPool.query(q, usr_email, (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User does not exists.");
    console.log("data rules", data[0]);
    //Check the password if user does exists
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.usr_password,
      data[0].usr_password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json("You have entered a wrong password");
    }
    //generate a random string of letters for the secret key
    const key =
      new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
    dbPool.query(key);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          usr_id: data[0].usr_id,
          usr_name: data[0].usr_name,
          usr_role: data[0].usr_role,
        },
      },
      key,
      { expiresIn: "10s" }
    );
    const refreshKey =
      new Date().getTime().toString(36) +
      Math.random().toString(36).slice(2) +
      "reaed"; //"reaed" = refreshed

    const refreshToken = jwt.sign({ usr_role: data[0].usr_role }, refreshKey, {
      expiresIn: "1d",
    });

    //destruct the password from the rest of the user info so we don't send the password in the response
    const { usr_password, usr_email, usr_dt_created, ...userData } = data[0];

    res.cookie("token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });
    const role = data[0].usr_role;
    const user = data[0].usr_name;
    res.json({ user, role, accessToken });
  });
};

const logout = (req, res) => {
  res
    .clearCookie("token", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .json("User has been logged out.");
};

module.exports = { adduser, login, logout };
