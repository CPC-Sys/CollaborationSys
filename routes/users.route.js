import express from "express";
import dbPool from "../db.js";

export const getUsers = async () => {
  const query =
    "SELECT u1.id, u1.usr_name, u1.usr_email, u1.usr_password, u1.usr_role, u1.usr_dt_created, u1.usr_status, u2.usr_name AS createdby FROM tb_users u1 LEFT JOIN tb_users u2 ON u1.usr_createdby = u2.id";

  const result = await dbPool.query(query);
  return result[0];
};

//getTLUsers begin ****************
export const getTLUsers = async (userId) => {
  const query = "SELECT * FROM tb_users WHERE usr_createdby = ?;";
  const TLUsers = await dbPool.query(query, [userId]);
  return TLUsers[0];
};

//getUser begin ****************
export const getUser = async (userId) => {
  const query =
    "SELECT id, usr_name, usr_email, usr_role, usr_dt_created FROM tb_users WHERE id = ?;";
  const user = await dbPool.query(query, [userId]);
  console.log("users.route.js user: ", user[0]);
  return user[0];
};

export const getUsersCount = async () => {
  q = "SELECT COUNT(*) AS usersCount FROM tb_users";
  const count = await dbPool.query(q);
  return count[0];
};

export const getNames = async () => {
  //"SELECT usr_id,usr_name FROM tb_users" = to get multiple columns
  const result = await dbPool.query("SELECT usr_name FROM tb_users");

  return result[0];
};

export const getNamesIds = async () => {
  const result = await dbPool.query("SELECT id, usr_name FROM tb_users");
  return result[0];
};

/* this function gets the user ID to insert it in the Projects table and in the Notes table */
export const getUserId = async (user) => {
  const q = "SELECT id FROM tb_users WHERE usr_name = ?";
  const userId = await dbPool.query(q, [user]);
  return userId[0][0].id;
};

/*if "id" is undefined, it will be set to zero, meaning is being called from adduser
  if "id" is not undefined, it will contain the value of the usr_id needed to update the user
  it means is being called from edituser 
*/
// module.exports.addOrEditUser = async (obj, id = 0) => {
//   console.log("Inside adduser in users.route");
//   console.log("user object: ", obj);
//   const q = "CALL user_add_or_edit(?,?,?,?,?,?,?,?,?,?)";

//   const [affectedRows] = await dbPool.query(q, [
//     id,
//     obj.usr_name,
//     obj.usr_email,
//     obj.usr_password,
//     obj.usr_role,
//     obj.usr_dt_created,
//     obj.usr_avatar,
//     obj.usr_createdby,
//     obj.usr_status,
//     obj.usr_refresh_token,
//   ]);
//   return affectedRows[0];
// };

export const checkUser = async (email) => {
  q = "SELECT * FROM tb_users WHERE usr_email = ?";
  const userExists = await dbPool.query(q, [email]);
  return userExists[0];
};

//obj contains the values for the project to be added
export const addUser = async (obj) => {
  const affectedRows = await dbPool.query("INSERT INTO tb_users SET ?", obj);
  return affectedRows[0].insertId;
};

//router.post("/adduser", .user.adduser);
// router.get("/api/getusers", user.getusers);
// router.get("/api/getuser/:id", user.getuser);
// router.delete("/api/deluser/:id", user.deluser);
// router.put("/api/edituser/:id", user.edituser);

//module.exports = router;
