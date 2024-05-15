const express = require("express")
const router = express.Router()
const {getByDay, getByClient} = require('../services/getDataServices')

router.get("/by-day" , async (req,res) => {
    // console.log(req.query.date)
    const allData = await getByDay(req.query.date,req.query.clientId,req.query.types)
    if(allData?.length == 0)
    res.status(404).json(req.query.date)
    else
    res.send(allData)
})

router.get("/by-client" , async (req,res) => {
    const allData = await getByClient(req.query)
    if(allData?.length == 0)
    res.status(404).json(req.query.date)
    else
    res.send(allData)
})



module.exports = router