const express = require("express")
const router = express.Router()
const {getAllEmails,getAllEmailsById} = require('../services/emailsService')

router.get("/", async(req,res)=>{
    const allEmails =  await getAllEmails()
    res.send(allEmails)
})

router.get("/:id", async(req,res)=>{
    const email =  await getAllEmailsById(req.params.id)
    if(email?.length == 0)
        res.status(404).json("Id : " + req.params.id + " is not available")
    else
        res.send(email)
})

module.exports = router
