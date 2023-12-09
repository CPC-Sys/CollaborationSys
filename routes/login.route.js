import db from "../db";

//obj will contain the values for the user to be added or updated
//if id has the default value of zero will Add user if not, we will Update user
module.exports.getLogin = async (obj) => {
  const [loginData] = await db.query(
    "SELECT usr_email, usr_password FROM tb_users WHERE usr_email = ? AND usr_password = ?",
    [obj.usr_email, obj.usr_password]
  );
  return loginData.affectedRows;
};
