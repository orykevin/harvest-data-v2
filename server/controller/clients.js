const express = require("express")
const router = express.Router()
const {getAllClients,getClientsById} = require('../services/clientsService')

router.get("/", async(req,res)=>{
    const allUser =  await getAllClients()
    res.send(allUser)
})

router.get("/:id", async(req,res)=>{
    const user =  await getClientsById(req.params.id)
    if(user.length == 0)
        res.status(404).json("Id : " + req.params.id + " is not available")
    else
        res.send(user)
})

module.exports = router
