const express = require("express")
const router = express.Router()
//const service = require()
const bodyparser =  require("body-parser")
const multer = require("multer")
const date = require("date-and-time")
const path = require("path")
const services = require ("../services/uploadImages")
const imgUrl = path.resolve(__dirname, "../../../app/public/images")



router.use(bodyparser.json())

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone


const storage = multer.diskStorage({
    destination: (req, file , cb) =>{
        cb(null, imgUrl)
    },
    filename : (req, file , cb) =>{
        const info = req.body.info
        let lastInfo = null

        if(Array.isArray(info)){
        const infoArr = []
        // for(let i = 0; i < info.length ; i++){
        //         let newjson = JSON.parse(info[i])
        //         newjson.date = date.format(new Date(newjson.date), "YYYY-MM-DD")
        //         infoArr.push(newjson)
        //     }
            let newJson = JSON.parse(info[info.length-1])
            let newDate = new Date(newJson.date)
            newJson.date = date.format(new Date(newDate.toLocaleString("en-US",{timeZone: timeZone})), "YYYY-MM-DD-HH-mm-ss")
            lastInfo = newJson
        }else{
            let json = JSON.parse(info)
            let newDate = new Date(json.date)
            json.date = date.format(new Date(newDate.toLocaleString("en-US",{timeZone: timeZone})), "YYYY-MM-DD-HH-mm-ss")
            lastInfo = json
        }
        
        //console.log(lastInfo)
        //console.log(info.length)
        //console.log(Array.isArray(info))
        cb(null, `${lastInfo.date}_${file.originalname }`)
    }
})

const upload = multer({storage})

router.post("/", upload.array("files") ,async (req,res)=>{
    //const files = req.files
    const info = req.body.info
    const infoArr = []
    if(Array.isArray(info)){
        for(let i = 0; i < info.length ; i++){
            let newjson = JSON.parse(info[i])
            newjson.date = new Date(new Date(newjson.date).toLocaleString("en-US",{timeZone: timeZone}))
            infoArr.push(newjson)
        }
        }else{
            let json = JSON.parse(info)
            json.date = new Date(new Date(json.date).toLocaleString("en-US",{timeZone: timeZone}))
            infoArr.push(json)
        }

    const mappedArr = infoArr.map((inf)=>{
        if(inf.client === null){
            return{
                code: "none",
                clients_id: 1,
                filename: `${date.format(inf.date, "YYYY-MM-DD-HH-mm-ss")}_${inf.name_file}` ,
                size : inf.size_file,
                start_time :inf.date,
                type: inf.type,
            }
        }else{
            return{
                code: inf.client.code,
                clients_id: inf.client.clientId,
                filename: `${date.format(inf.date, "YYYY-MM-DD-HH-mm-ss")}_${inf.name_file}`,
                size : inf.size_file,
                start_time :inf.date,
                type: inf.type,
            }
        }
    })
    // const mapInfo = info.map((i)=>{
    //     return JSON.parse(i)
    // })
    //console.log ("length: " + info.length)
    //console.log("type: " + typeof info)
    //console.log(info)
    //console.log(infoArr)
    //console.log(mappedArr)
    const insertingDb = await services.insertToPhotos(mappedArr)
    res.json(insertingDb)
})

module.exports = router