const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const service = require("../services/parseEmail")
const multer = require("multer")


router.use(bodyparser.json())

const storage = multer.memoryStorage();
const upload = multer({storage})

router.post("/" , upload.array("files"), async(req,res) =>{
    const mapeml = await Promise.all(req.files.map(async(file)=>{
        const parsedEml = await service.getEmailData(file)
        return parsedEml
    }))
    
   const parsedHeader = await service.parseEmailHeader(req.files,req.body.info)
   res.send(parsedHeader)
})

module.exports = router