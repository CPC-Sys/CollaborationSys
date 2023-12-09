const express = require("express");
const app = express();
const cors = require("cors")
const bodyparser = require("body-parser");
const db = require("./db")
const port = 5000;
require("express-async-errors")
//this holds the routers to get to the database
usersRoutes = require ("./controllers/users.controller")

//middleware
app.use(bodyparser.json());
app.use(express.urlencoded({extended: true}))
app.use('/api/users', usersRoutes)
//app-global error handling
app.use((err, req, res, next) =>{
    console.log(err)
    res.status(err.status || 500).send("Something went wrong!")
})

db.query("SELECT 1")
.then(data => {
    console.log("DB Connection succeeded.")
    app.listen (port, ()=>console.log(`Server Started at port ${port}`))
})
.catch(err => console.log("DB Connection failed. \n" + err))
