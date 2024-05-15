const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const multer = require("multer")

const app = express()
app.use(bodyparser.json())
app.use(cors())
app.use(bodyparser.urlencoded({
    extended: true
  }));

const connection = require('./db/connection/connection')
const clientUserRoutes = require('./controller/clientUser')
const clientsRoutes = require('./controller/clients')
const phonecallsRoutes = require("./controller/phonecalls")
const photosRoutes = require("./controller/photos")
const textMessagesRoutes = require("./controller/textMessages")
const emailsRoutes = require("./controller/emails")
const userListById = require('./addingUser')
const getDataRoutes = require("./controller/getDataController")
const getEmail = require ("./controller/getEmail")
const upImages = require("./controller/uploadImages")
const { getEncoder } = require("iconv-lite")


app.use("/api/clients", clientsRoutes)
app.use("/api/client-users", clientUserRoutes)
app.use("/api/phonecalls", phonecallsRoutes)
app.use("/api/photos", photosRoutes)
app.use("/api/text-message", textMessagesRoutes)
app.use("/api/emails", emailsRoutes)
app.use("/api/userlist", userListById)
app.use("/api/get-data", getDataRoutes)
app.use("/api/upload-email" , getEmail)
app.use("/api/upload-image", upImages)

app.use((err,req,res,next)=>{
    console.log(err)
    res.status(500).send("Error !!")
})

connection.connect((err) => {
    if (err) {
        console.log('There Is Error In DB Connection:' + err);
    }
    else {
        console.log('DB Connected Succefully')
        app.listen(3000,()=>{
            console.log("server is running on 3000")
        })
    }
  })

