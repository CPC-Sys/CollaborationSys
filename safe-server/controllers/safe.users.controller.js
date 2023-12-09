const express = require('express'),
router = express.Router()

const service = require('../services/users.service')
//http://localhost:5000/api/users/

router.get('/', async(req,res)=>{
 
    //coming from users.service.js
    //get all users
    const users = await service.getAllUsers();
    if(users == undefined){
        res.status(404).json("No records exist in Database")
    }else{
        res.send(users)
    }
})

//coming from users.service.js
    //get one user by its ID
router.get('/:id', async (req, res) => {
 
    const user = await service.getUserById(req.params.id);
    if(user == undefined){
        res.status(404).json("No record with given ID: " + req.params.id + " found.")
    }else{
        res.send(user)
    }
})

//coming from users.service.js
    //delete a user
    router.delete('/:id', async (req, res) => {

        const rowsAffected = await service.deleteUser(req.params.id);
        
        if(rowsAffected == 0){
        res.status(404).json("No record with given ID: " + req.params.id + " found.");
        }
        else{            
        res.send("User was deleted successfully")
        }
        
    })

    //coming from users.service.js
    //add a user
    router.post('/', async (req, res) => {

        await service.addOrEditUser(req.body);
        res.status(201).send("Record created Successfully");
        
    })

    //coming from users.service.js
    //update a user
    router.put('/:id', async (req, res) => {

        const affectedRows = await service.addOrEditUser(req.body, req.params.id);
        if(affectedRows == 0){
            res.status(404).json("No record with given ID: " + req.params.id + " found.");
            }
            else{            
            res.send("Updated successfully")
            }
        
    })




module.exports = router;