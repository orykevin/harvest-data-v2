const fs = require("fs")
const XLSX = require("xlsx")
const express = require("express")
const router = express.Router()
const jsontoxml = require("jsontoxml")
const date = require('date-and-time')
const db = require('./db')
// const test = {
//     "Day": "Sunday",
//     "Date": "1/1/17",
//     "Time": "06:09PM",
//     "Number Called": "949-951-1159",
//     "Who?": "HelpGuide, Inc.",
//     "Call To": "Call Forwarded",
//     "Min": "1",
//     "Rate Code": "WIFI",
//     "Rate Pd": "NW",
//     "Feature": "CF"
//   },

const workBook = XLSX.readFile("949-702-1159.xlsx")

const dateFormat = (dates,times,add) =>{

    if(add > 0){
        const addedHours = `${dates} ${date.format(date.addMinutes(date.parse(times,"h:mm A"),add),"HH:mm:ss")}`
        const parseAddedHours = date.parse(addedHours,"YYYY-MM-DD HH:mm:ss")
        return parseAddedHours
    }else{
        const dateString = `${dates} ${date.transform(times, "h:mm A", "HH:mm:ss")}`
        const parseDate = date.parse(dateString,"YYYY-MM-DD HH:mm:ss")
        return parseDate
    }
    
}

const checkCodes = (name) =>{
    let code
    if(name){
        const index = name.indexOf(" -")
        if(index > 0){
            code = name.slice(0,index)
        }else{
            code = "none"
        }
    }else{
        code = "none"
    }
    
    return code
  }

  const checkClientId = (data,allClient) =>{
    const index = allClient.findIndex(userClient => userClient.number === data["Number"].replace(/-/g,""))
    if(index >= 0){
        return allClient[index].clients_id
    }else{
        return 1
    }
  }

  const checkUserClientId = (data,allClient) =>{
    const index = allClient.findIndex(userClient => userClient.number === data["Number"].replace(/-/g,""))
    if(index >= 0){
        return allClient[index].id
    }else{
        return 1
    }
  }

  const getAllClient = async () =>{
    const [allClients] = await db.query("SELECT * FROM client_users")
    .catch(err => console.log(err))
    return allClients
  }

  const checkNameUnknown = (name) =>{
    if(name === "?" | !name){
        return "Unknown"
    }else{
        return name
    }
  }

const setupField = async(array,allClient) => {
    let fields = await Promise.all(array.map(async (item,id)=>{
        if("Number" in item){
            return [checkUserClientId(item,allClient),
                checkClientId(item,allClient),
                checkNameUnknown(item["Who?"]),
                item["Number"].replace(/-/g,""), //Number Called
                dateFormat(item["Date"],item["Start"],0),
                dateFormat(item["Date"],item["Start"],item["Min"]),
                Number(item["Min"]),
                item["Type"]
                ]
        }
            
        // ({
        //     "clients_id": checkClientId(item,allClient),
        //     "user_clients_id": checkUserClientId(item,allClient),
        //     "name" : item["Who?"] ? item["Who?"] : "Unknown",
        //     "number": item["Number Called"],
        //     "start_time": dateFormat(item["Date"],item["Time"],0),//date.transform('13:05', 'HH:mm', 'hh:mm A')
        //     "finish_time": dateFormat(item["Date"],item["Time"],item["Min"]),
        //     "duration" : item["Min"]
        // })
    }))

    return fields
}

const getXlsx = async (year) =>{
    let worksheets = await XLSX.utils.sheet_to_json(workBook.Sheets[year],{raw:false,setDate:false})
    //let clientsheets = await XLSX.utils.sheet_to_json(workBook.Sheets["list"],{raw:false,setDate:false})
    
    let allres =  getAllClient()
    .then((res) =>{
        //console.log(worksheets)
        let setupData = setupField(worksheets,res)
        .catch((err)=>console.log(err))
        return setupData
    }).catch(err => err)
    // for( const sheetName of workBook.SheetNames){
    //     console.log(sheetName)
    //     worksheets[sheetName] = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName],{raw:false})
    // }
    //return clientsheets
    return allres
}

const sqlinsert = "INSERT INTO phonecalls (client_users_id, clients_id, name, number, start_time, finish_time, duration, io) VALUES ?"

const insertToPhoneCallse = (array,sql) =>{
    db.query(sql, [array])
    .then((res)=>{
        console.log("data inserted")
    }).catch((err)=>console.log(err))
}

const insertToDatabase = async (year)  =>{
    const allDataArray = await getXlsx(year)
    insertToPhoneCallse(allDataArray,sqlinsert)
}

//insertToPhoneCallse(arrayToJoin,sqlinsert)
//console.log(setupField(testArray))

// insertToDatabase(2023)
// .then(res => console.log("success inserting all"))
// .catch(err => console.log("error when inserting" + err))

router.get("/:year", async(req,res)=>{
    const selectedyear =  await getXlsx(req.params.year)
    if(selectedyear == 0)
        res.status(404).json("Id : " + req.params.year + " is not have data")
    else
        res.send(selectedyear)
})

//getXlsx(2017).then((res)=>console.log(res))

// console.log(worksheets["2017"])
// console.log(JSON.stringify(worksheets.data_2022))

module.exports = router