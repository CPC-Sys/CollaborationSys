import express from "express";
// const router = express.Router();
import dbPool from "../db.js";

export const getNote = async (proj) => {
  const q = "SELECT * FROM tb_notes WHERE usr_name = ?";
  const noteExists = await dbPool.query(q, [proj]);
  return noteExists[0];
};

//obj contains the values for the project to be added
export const addNote = async (obj) => {
  const affectedRows = await dbPool.query("INSERT INTO tb_notes SET ?", obj);
  return affectedRows[0];
};

//obj contains the values for the project to be added
export const getProjNotes = async (proj) => {
  const sqlQuery = `
  SELECT
      n.*,
      u.usr_name,
      p.prj_num
  FROM
      tb_notes n
  JOIN
      tb_users u ON n.nte_usr_id = u.usr_id
  JOIN
      tb_projects p ON n.nte_prj_id = p.prj_id
  WHERE
      n.nte_prj_id = ?;
`;
  //"SELECT * FROM tb_notes WHERE nte_prj_id = ?"

  const projNotes = await dbPool.query(sqlQuery, [proj]);
  return projNotes[0];
};

// router.get("/getcount", projects.getcount);
// router.get("/getprojects", projects.getprojects);
// router.get("/getproject/:id", projects.getproject);
// router.post("/addproject", projects.addproject);
// router.delete("/delproject/:id", projects.delproject);
// router.put("/editproject/:id", projects.editproject);

//get all users from database
//projectsData is in brackets to destructure the array sent from the
//database to only get the first part of array which is only the data.
//these module.exports are being exported to projects.controller.js

/*
module.exports.getAllProjects = async () => {
  const [projectsData] = await db.query("SELECT * FROM tb_projects");
  return projectsData;
};

module.exports.getProjectById = async (id) => {
  const [projectsData] = await db.query(
    "SELECT * FROM tb_projects WHERE prj_id = ?",
    [id]
  );
  return projectsData;
};

module.exports.deleteProject = async (id) => {
  const [projectsData] = await db.query(
    "DELETE FROM tb_projects WHERE prj_id = ?",
    [id]
  );
  return projectsData.affectedRows;
};

 */
