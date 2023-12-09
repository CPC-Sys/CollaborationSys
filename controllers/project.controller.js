import express from "express";
import dbPool from "../db.js";
import {
  checkProjName,
  getAllProjects,
  getTLProjects,
  getAllProjectsCount,
  addProject,
  getProjId,
  editProject,
} from "../routes/projects.route.js";
//import users from "../routes/users.route.js";
import { addNote } from "../routes/notes.route.js"; //require("../routes/projects.route.js");

const router = express.Router();

//addProject Begins
router.post("/addProject", async (req, res) => {
  //CHECK IF PROJECT# EXISTS
  const exists = await checkProjName(req.body.prj_num);

  if (exists.length > 0)
    return res.status(409).json("Project Number already Used");

  //get userId from the users table
  //const userId = await users.getUserId(req.body.usr_name);

  //if prj_notes has a value we will insert the note into the tb_notes table
  //will change the notes value from req.body to a number 1 for the numeric value
  //of the prj_notes in tb_projects

  if (req.body.prj_notes) {
    const projValues = [
      {
        prj_num: req.body.prj_num,
        prj_ref_num: req.body.prj_ref_num,
        prj_title: req.body.prj_title,
        prj_status: req.body.prj_status,
        prj_priority: req.body.prj_priority,
        prj_description: req.body.prj_description,
        prj_notes: 1,
        prj_usr_id: req.body.prj_usr_id,
        prj_dt_created: req.body.prj_dt_created,
        prj_dt_assigned: req.body.prj_dt_assigned,
        prj_dt_due: req.body.prj_dt_due,
        prj_dt_completed: req.body.prj_dt_completed,
        prj_createdby: req.body.prj_createdby,
      },
    ];

    const projInsertID = await addProject(projValues);
    if (projInsertID > 0) {
      const noteValues = [
        {
          nte_prj_id: projInsertID,
          nte_note: req.body.prj_notes,
          nte_usr_id: req.body.prj_createdby,
          nte_date: req.body.prj_dt_created,
        },
      ];
      const wasNoteAdded = await addNote(noteValues);
      if (wasNoteAdded) {
        return res.status(200).json("Project added successfully");
      } else {
        return res
          .status(500)
          .json("Something went wrong. Project was not fully added");
      }
    }
  } else {
    const projInsertID = await addProject(req.body);
    if (projInsertID) {
      return res.status(200).json("Project added successfully");
    } else {
      return res.status(500).json("Something happened. Project was not added");
    }
    console.log("No Note Here");
  }
});
//addProject ends

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

//editProject Begins
router.put("/editProject/:id", async (req, res) => {
  //if prj_notes has a value we will insert the note into the tb_notes table
  //will change the notes value from req.body to a number 1 for the numeric value
  //of the prj_notes in tb_projects

  if (req.body.prj_notes) {
    const note = req.body.prj_notes;
    req.body.prj_notes = 1;
    const affectedRows = await editProject(req.body, req.params.id);

    if (affectedRows > 0) {
      const values = {
        nte_prj_id: req.params.id,
        nte_note: note,
        nte_usr_name: req.body.prj_createdby,
        nte_dt_created: req.body.prj_dt_created,
      };
      const wasNoteAdded = await addNote(values);
      if (wasNoteAdded) {
        return res.status(200).json("Project added successfully");
      } else {
        return res
          .status(200)
          .json("Something went wrong. Project was not fully added");
      }
    }
  }
});
//editProject ends

//getProjects Begins
router.get("/getProjects", async (req, res) => {
  //get projects from database

  const allProjects = await getAllProjects();

  if (allProjects) return res.json(allProjects);
});

//getTLProjects Begins **********************
//This route pulls all the projects created by and assigned to a Teamlead
router.get("/getTLProjects/:userID", async (req, res) => {
  //get Teamlead's projects from database

  const userId = req.params.userID;

  console.log("project.controller.js userId: ", userId);
  const TLProjects = await getTLProjects(userId);

  if (TLProjects) return res.json(TLProjects);
});

//getAllProjectsCount Begins **********************
router.get("/getAllProjectsCount", async (req, res) => {
  const allProjects = await getAllProjectsCount();

  if (allProjects[0].projectsCount > 0)
    return res.json(allProjects[0].projectsCount);
});

export default router;

// const delproject = (req, res) => {
//   console.log("Inside deleteProject");
//   res.json("from Delete controller");
// };
// const getproject = (req, res) => {
//   console.log("Inside getProject");
//   res.json("from proj.controllerGetProject");
// };

// module.exports = {
//   addproject,
//   delproject,
//   getproject,
//   getprojects,
//   getcount,
//   editproject,
// };
