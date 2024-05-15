const express = require("express")
const router = express.Router()
const {getAllTextMessages,getAllTextMessagesById} = require('../services/textMessagesService')

router.get("/", async(req,res)=>{
    const allMessages =  await getAllTextMessages()
    res.send(allMessages)
})

router.get("/:id", async(req,res)=>{
    const message =  await getAllTextMessagesById(req.params.id)
    if(message.length == 0)
        res.status(404).json("Id : " + req.params.id + " is not available")
    else
        res.send(message)
})

module.exports = router
