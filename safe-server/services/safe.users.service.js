const db=require("../db")

//get all users from database
//usersData is in brackets to destructure the array sent from the
//database to only get the first part of array which is only the data.
//these module.exports are being exported to users.controller.js
module.exports.getAllUsers = async () =>{
    const [usersData] = await db.query("SELECT * FROM tb_users")
    return usersData;
}

module.exports.getUserById = async (id) =>{
    const [usersData] = await db.query("SELECT * FROM tb_users WHERE usr_id = ?",[id])
    return usersData;
}

module.exports.deleteUser = async (id) =>{
    const [usersData] = await db.query("DELETE FROM tb_users WHERE usr_id = ?",[id])
    return usersData.affectedRows;
}

//obj will contain the values for the user to be added or updated
    //if id has the default value of zero will Add user if not, we will Update user
module.exports.addOrEditUser = async (obj, id=0) =>{
    
    const [[[{affectedRows}]]] = await db.query("CALL user_add_or_edit(?,?,?,?,?,?)",
    [id, obj.usr_username, obj.usr_password, obj.usr_email, obj.usr_status,
    obj.usr_dt_created])
    return affectedRows;
}