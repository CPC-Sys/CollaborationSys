import express from "express";
import auth from "../controllers/auth.controller";

const router = express.Router();

router.post("/adduser", auth.adduser);
router.post("/login", auth.login);
router.post("/logout", auth.logout);

module.exports = router;
