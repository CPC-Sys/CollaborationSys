import "dotenv/config";
import express from "express";

import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import corsOptions from "./config/corsOptions.js";
import cookieParser from "cookie-parser";
import credentials from "./middleware/credentials.js";
import { logger } from "./middleware/logEvents.js";
import errorHandler from "./middleware/errorHandler.js";
import db from "./db.js";
import rootController from "./routes/root.js";
import auth from "./controllers/auth.controller.js";
import user from "./controllers/user.controller.js";
import project from "./controllers/project.controller.js";
import note from "./controllers/note.controller.js";
import ssapi from "./controllers/ssapi.controller.js";
import ebay from "./controllers/ebay.controller.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.APIPORT || 3555;
app.use(logger);
app.use(credentials);
app.use(cors(corsOptions));

app.use("/", rootController);

app.use("/api/auth", auth);
app.use("/api/users", user);
app.use("/api/projects", project);
app.use("/api/notes", note);
app.use("/api/ssapi", ssapi);
app.use("/api/ebay", ebay);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

//first make sure db connection is successful
//then start the express server.
db.query("SELECT 1")
  .then(() => {
    console.log("db connection  succeeded.");
    app.listen(PORT, () => console.log(`server started at PORT: ${PORT}`));
  })
  .catch((err) => console.log("db connection failed. \n" + err));

/*db.getConnection((err, conn) => {
  if (conn) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("DB conn is up");
  } else {
    console.log(`DB Error: ${err}`);
    
  }
});*/

//app.listen(PORT, () => {
//console.log("Connected!");
//});

/*

db.query("SELECT 1")
  .then((data) => {
    console.log("DB Connection succeeded.");
    app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
  })
  .catch((err) => console.log("DB Connection failed. \n" + err));





import dotenv from "dotenv.config()";
import express from "express";
import projRoute from "./controllers/projects.controller";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());

const db = require("./db");
const PORT = process.env.PORT || 5000;
require("express-async-errors");

//this holds the routers to get users from the database
usersRoutes = require("./controllers/users.controller");

//this holds the routers to get projects from the database
projectsRoutes = require("./controllers/projects.controller");

//route to handle login
loginRoute = require("./controllers/login.controller");

//middleware
//app.use(bodyparser.json());
app.use(express.json());

//app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use("/api/users/", usersRoutes);
app.use("/api/projects/", projectsRoutes);
app.use("/api/auth/", loginRoute);

//app-global error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send("Something went wrong!");
});

db.query("SELECT 1")
  .then((data) => {
    console.log("DB Connection succeeded.");
    app.listen(PORT, () => console.log(`Server Started at port ${PORT}`));
  })
  .catch((err) => console.log("DB Connection failed. \n" + err));
*/
