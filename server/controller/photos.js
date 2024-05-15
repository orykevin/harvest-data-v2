const express = require("express")
const router = express.Router()
const {getAllPhotos,getPhotosById} = require('../services/photosService')

router.get("/", async(req,res)=>{
    const allPhotos =  await getAllPhotos()
    res.send(allPhotos)
})

router.get("/:id", async(req,res)=>{
    const photo =  await getPhotosById(req.params.id)
    if(photo.length == 0)
        res.status(404).json("Id : " + req.params.id + " is not available")
    else
        res.send(photo)
})

module.exports = router
