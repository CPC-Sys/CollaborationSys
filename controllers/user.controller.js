import express from "express";
import dbPool from "../db.js";
//import users from "../routes/users.route.js";
import {
  getUsers,
  getTLUsers,
  getUser,
  getUsersCount,
  getNames,
  getNamesIds,
  getUserId,
  checkUser,
  addUser,
} from "../routes/users.route.js";
import bcrypt from "bcrypt";

const router = express.Router();

//****************** ADDUSER ***************************
router.post("/addUser", async (req, res) => {
  console.log("about to get values");
  //CHECK IF USER EXISTS
  if (!req.body.usr_email) {
    return res.json("Need Email");
  }
  const exists = await checkUser(req.body.usr_email);
  if (exists.length > 0) return res.status(409).json("User Already Exists");

  //HASH the password and create a user
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(req.body.usr_password, salt);

  //temporary avatar-image url
  let usr_avatar = "";
  let usr_refresh_token = "";

  //values to send to the addUser route in users.route.js. Values include the hashed password
  const values = [
    {
      usr_name: req.body.usr_name,
      usr_email: req.body.usr_email,
      usr_password: hash,
      usr_role: req.body.usr_role,
      usr_dt_created: req.body.usr_dt_created,
      usr_status: req.body.usr_status,
      usr_createdby: req.body.usr_createdby,
      usr_img: usr_avatar,
      usr_refresh_token: usr_refresh_token,
    },
  ];
  //call addUser from users.route.js to insert the new user
  const getUserId = await addUser(values);

  if (getUserId > 0) {
    res.json("User created Successfully");
  }
});

//****************** END ADDUSER ***************************

//**************** GETUSERS *****************
router.get("/getUsers", async (req, res) => {
  const allUsers = await getUsers();
  res.json(allUsers);

  //console.log("I did find the user: ", users);
});

//**************** END GETUSERS *****************

//******************** GETTLUSERS *****************
router.get("/getTLUsers/:userID", async (req, res) => {
  //get Teamlead's users from database

  const userId = req.params.userID;

  const TLUsers = await getTLUsers(userId);

  if (TLUsers) return res.json(TLUsers);
});
//******************** END GETTLUSERS *****************

//********************** GETUSER **********************
router.get("/getUser/:userID", async (req, res) => {
  //get Teamlead's users from database

  const userId = req.params.userID;

  const user = await getUser(userId);

  if (user) return res.json(user);
});

//********************** END GETUSER *****************

//********************** GETUSERSCOUNT **********************

router.get("/getUsersCount", async (req, res) => {
  const allUsers = await getUsersCount();

  if (allUsers[0].usersCount > 0) return res.json(allUsers[0].usersCount);
});
//********************** GETUSERSCOUNT **********************

//********************** GETNAMES **********************
router.get("/getNames", async (req, res) => {
  //get projects from database
  //console.log("Inside getUsers");
  const names = await getNames();
  res.json(names);
});
//********************** END GETNAMES **********************

//********************** GETNAMESIDS **********************
router.get("/getNamesIds", async (req, res) => {
  const namesIds = await getNamesIds();
  res.json(namesIds);
});
//********************** END GETNAMESIDS **********************

export default router;

// router.get("/getnames", async (req, res) => {
//   //get projects from database
//   //console.log("Inside getUsers");
//   const names = await users.getnames();
//   res.json(names);
// });

// const deluser = (req, res) => {
//   console.log("Inside deluser");
//   res.json("from Delete User controller");
// };

// const getuser = (req, res) => {
//   console.log("Inside getuser");
//   res.json("from get User controller");
// };

// const edituser = (req, res) => {
//   console.log("Inside edituser");
//   res.json("from edit User controller");
// };

// export const addUser = (req, res) => {
//   res.json("from user.controller");
// };

/*
const express = require("express");

app = express();

const router = express.Router();

const service = require("../services/users.service");

//http://localhost:5000/api/users/

router.get("/", async (req, res) => {
  //coming from users.service.js
  //get all users
  const users = await service.getAllUsers();
  if (users == undefined) {
    res.status(404).json("No records exist in Database");
  } else {
    res.send(users);
  }
});

//coming from users.service.js
//get one user by its ID
router.get("/:id", async (req, res) => {
  const user = await service.getUserById(req.params.id);
  if (user == undefined) {
    res
      .status(404)
      .json("No record with given ID: " + req.params.id + " found.");
  } else {
    res.send(user);
  }
});

//coming from users.service.js
//delete a user
router.delete("/:id", async (req, res) => {
  const rowsAffected = await service.deleteUser(req.params.id);

  if (rowsAffected == 0) {
    res
      .status(404)
      .json("No record with given ID: " + req.params.id + " found.");
  } else {
    res.send("User was deleted successfully");
  }
});

//coming from users.service.js
//add a user
router.post("/", async (req, res) => {
  await service.addOrEditUser(req.body);
  const status = res.statusCode;
  if (status == 409) {
    res.send.statusCode;
  }
  res.status(201).send("Record created Successfully");
});

//coming from users.service.js
//update a user
router.put("/:id", async (req, res) => {
  const affectedRows = await service.addOrEditUser(req.body, req.params.id);
  if (affectedRows == 0) {
    res
      .status(404)
      .json("No record with given ID: " + req.params.id + " found.");
  } else {
    res.send("Updated successfully");
  }
});

module.exports = router;

*/
