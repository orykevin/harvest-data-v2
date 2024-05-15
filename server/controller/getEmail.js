const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const service = require("../services/parseEmail")
const serviceEmail = require("../services/parseEmailV2")
const multer = require("multer")


router.use(bodyparser.json())

const storage = multer.memoryStorage();
const upload = multer({storage})

router.post("/" , upload.array("files"), async(req,res) =>{
    res.send('test')
    //console.log(req.files)
    //console.log(req.body.info)
    // const allEmail = await serviceEmail.simpleParser(req.files)
    // res.send(allEmail[0].textAsHtml)
    //const testHeader = await service.parseEmailHeaderInfo(req.files,req.body.info)
    // const testBody = await service.getEmailData(req.files[0])
    // res.send(testBody)
    //const allUpload = await Promise.all(req.files.map(async(file)=>{
    //    return service.getEmailData(file)
    //}))

    const mapeml = await Promise.all(req.files.map(async(file)=>{
        const parsedEml = await service.getEmailData(file)
        return await parsedEml
    }))

   const parsedHeader = await service.parseEmailHeader(req.files,req.body.info)
   res.send('test')
})

module.exports = router