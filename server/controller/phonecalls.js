const express = require("express")
const router = express.Router()
const {getAllPhonecalls,getAllPhonecallsById} = require('../services/phonecallsService')

router.get("/", async(req,res)=>{
    const allPhonecalls =  await getAllPhonecalls()
    res.send(allPhonecalls)
})

router.get("/:id", async(req,res)=>{
    const phonecall =  await getAllPhonecallsById(req.params.id)
    if(phonecall.length == 0)
        res.status(404).json("Id : " + req.params.id + " is not available")
    else
        res.send(phonecall)
})

module.exports = router
