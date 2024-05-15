const express = require("express")
const router = express.Router()
const{ getAllClientUsers ,getByIdClientUsers} = require("../services/clientUsersService")

router.get("/", async(req,res)=>{
    const allUser =  await getAllClientUsers()
    res.send(allUser)
})

router.get("/:id", async(req,res)=>{
    const user =  await getByIdClientUsers(req.params.id)
    if(user.length == 0)
        res.status(404).json("Id : " + req.params.id + " is not available")
    else
        res.send(user)
})

module.exports = router
