import express from "express";
import dbPool from "../db.js";
import { getNote, addNote, getProjNotes } from "../routes/notes.route.js";
import { getProjId } from "../routes/projects.route.js";

const router = express.Router();

router.post("/addNote", async (req, res) => {
  const result = await addNote(req.body);

  if (result.affectedRows > 0)
    return res.status(200).json("Note added successfully");
});

router.get("/getProjNotes/:project", async (req, res) => {
  const [projId] = await getProjId(req.params.project);

  const projNotes = await getProjNotes(projId.prj_id);
  console.log("rulu projNotes: ", projNotes);

  if (projNotes === undefined) {
    return res
      .status(400)
      .json("No Notes exist for Project: " + req.params.project);
  } else {
    return res.json(projNotes);
  }
});

// const delnote = (req, res) => {
//   console.log("Inside deleteNote");
//   res.json("from Delete controller");
// };
// const getnote = (req, res) => {
//   console.log("Inside getNote");
//   res.json("from note.controllerGetNote");
// };

// const getprojects = (req, res) => {
//   //get projects from database
//   const q = "SELECT * FROM tb_projects";
//   console.log("Inside getpnotes");
//   dbPool.query(q, (err, data) => {
//     if (err) return res.json(err);
//     if (data) return res.json(data); //status(409).json("User Already Exists");
//   });
// };

// const getcount = (req, res) => {
//   const q = "SELECT COUNT(*) AS notesCount FROM tb_notes";
//   console.log("Inside no getCount");
//   dbPool.query(q, (err, data) => {
//     if (err) return res.json(err);
//     console.log(data[0].projectsCount);
//     if (!data[0].projectsCount) return res.json("No Projects Exist.");
//     if (data[0].projectsCount) return res.json(data[0].projectsCount); //status(409).json("User Already Exists");
//   });
// };

// const editnote = (req, res) => {
//   console.log("Inside updatenote");
//   res.json("from note update controller");
// };

export default router;
