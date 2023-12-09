import express from "express";
// const router = express.Router();
import dbPool from "../db.js";

export const checkProjName = async (proj) => {
  const q = "SELECT * FROM tb_projects WHERE prj_num = ?";
  const projExists = await dbPool.query(q, [proj]);
  return projExists[0];
};

export const getAllProjects = async () => {
  // Query to execute
  const query =
    "SELECT p.id, p.prj_num, p.prj_ref_num, p.prj_title, p.prj_status, p.prj_priority, p.prj_description, p.prj_notes, u.usr_name as assigned_user, p.prj_dt_created, p.prj_dt_assigned, p.prj_dt_due, p.prj_dt_completed, p.prj_createdby FROM tb_projects p LEFT JOIN tb_users u ON p.prj_usr_id = u.id";

  const projectsData = await dbPool.query(query);
  return projectsData[0];
};

//getTLProjects begin ****************
export const getTLProjects = async (userId) => {
  const query =
    "SELECT p.id, p.prj_num, p.prj_ref_num, p.prj_title, p.prj_status, p.prj_priority, p.prj_description, p.prj_notes, u1.usr_name as assigned_user, u2.usr_name as created_by_user, p.prj_dt_created, p.prj_dt_assigned, p.prj_dt_due, p.prj_dt_completed FROM tb_projects p LEFT JOIN tb_users u1 ON p.prj_usr_id = u1.id LEFT JOIN tb_users u2 ON p.prj_createdby = u2.id WHERE u1.id = ? OR u2.id = ?;";

  const TLProjects = await dbPool.query(query, [userId, userId]);
  //console.log("projects.route.js TLProjects: ", TLProjects);
  return TLProjects[0];
};

export const getAllProjectsCount = async () => {
  q = "SELECT COUNT(*) AS projectsCount FROM tb_projects";
  const count = await dbPool.query(q);
  return count[0];
};

//obj contains the values for the project to be added
export const addProject = async (obj) => {
  console.log("projects.route.js This is obj: ", obj);
  const affectedRows = await dbPool.query("INSERT INTO tb_projects SET ?", obj);
  return affectedRows[0].insertId;
};

//obj contains the values for the project to be added
export const getProjId = async (projNum) => {
  const projId = await dbPool.query(
    "SELECT id FROM tb_projects WHERE prj_num = ?",
    [projNum]
  );
  return projId[0];
};

//obj contains the values for the project to be added
export const editProject = async (obj, projId) => {
  console.log("Here's projId: ", projId);
  const updateQ = "UPDATE tb_projects SET ? WHERE id = ?";
  const affectedRows = await dbPool.query(updateQ, [obj, projId]);
  return affectedRows[0].affectedRows;
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
