const db = require("./db")
const XLSX = require("xlsx")
const express = require("express")
const router = express.Router()

const  userArray = [
    {
      "Phone Number": "+44 7710 136039",
      "Caller Name": "Kynai - Sean Murphy mobile",
      "Check": "Kynai"
    },
    {
      "Phone Number": "000-000-0000",
      "Caller Name": "???",
      "Check": ""
    },
    {
      "Phone Number": "174-235-0083",
      "Client Code": "ATT",
      "Caller Name": "ATT - Jose Morales",
      "Check": "ATT"
    },
    {
      "Phone Number": "201-305-4332",
      "Caller Name": "?",
      "Check": ""
    },{
        "Phone Number": "949-300-6644",
        "Client Code": "DAW",
        "Caller Name": "Dawson & Associates - Steve Dawson",
        "Check": "Dawson & Associates"
      },
      {
        "Phone Number": "949-300-7077",
        "Caller Name": "NT - Sanjay's Cell",
        "Check": "NT"
      },{
        "Phone Number": "203-350-0609",
        "Caller Name": "RM - Joshua Lipschutz",
        "Check": "RM"
      },
]

const workBook = XLSX.readFile("949-702-1159.xlsx")


const getPhoneNumberAll = async () =>{
    let clientsheets = await XLSX.utils.sheet_to_json(workBook.Sheets["list"],{raw:false,setDate:false})
    return clientsheets
}

const getAllClient = async () =>{
    const [allClient] = await db.query("SELECT * FROM clients")
    .catch(err => console.log(err))
    return allClient
}

const getAllClientbyID = async (id) =>{
    const [allClient] = await db.query("SELECT * FROM client_users WHERE clients_id = ?",[id])
    .catch(err => console.log(err))
    return allClient
}

const addingCode = (arrays,data) =>{
    let code 
    if(data["Client Code"]){
        code = data["Client Code"]
    }else if(data["Check"] !== "" && !data["Client Code"]){
        code = data["Check"]
    }else{
        code = "none"
    }

    const index = arrays.findIndex(array => array.code === code)
    if(index > 0){
        return arrays[index].id
    }else if(index === 0){
        return 1
    }else{
        return 1 //if want to insert new client
    }
}

const nameCheck = (name) =>{
    if(name === "?"){
        return "Unknown"
    }else{
        return name
    }
}

const checkToInsert = (data,arr) =>{
    if (1 == 2) {
        console.log('No Codes in name!!');
    }
    else {
        // Pre-insert checks
        db.query('SELECT * FROM client_users WHERE number = ?', [data["PhoneNumber"].replace(/-/g,"")] )
        .then(([results])=>{
            //console.log(results)
            if (results.length > 0) {
                console.log('phone number already exists.');
              } else {
                //Insert data
                db.query('INSERT INTO client_users (clients_id, name, number) VALUES (?, ?, ?)', [addingCode(arr,data), data["Caller Name"] ? nameCheck(data["Caller Name"]) : "Unknown", data["PhoneNumber"].replace(/-/g,"")])
                .then((res)=>{console.log("New Data Inserted!!" + data["PhoneNumber"])})
                .catch((err)=>console.log("Error Occured" + err));
                // console.log({
                //     clients_id : addingCode(arr,data),
                //     name: data["Caller Name"],
                //     number: data["Phone Number"].replace(/-/g,"")
                // })
              }
        }).catch(err => console.log("error occured" + err));
      }
}

const checkMissingClient = (data) =>{
    if(data.name.includes(" - ")){
        return true
    }else{
        return false
    }
}

// getAllClient().then((res)=>{
//     const allClients = res
//     getPhoneNumberAll().then((datas)=>{
//         for(const data of datas){
//             checkToInsert(data,allClients)
//           }
//     }).catch(err=>console.log(err))
    
// })

// getAllClientbyID(1).then((res)=>{
//     console.log(res)
//     const listMissing = res.map((client) =>{
//         return checkMissingClient(client)
//     })
//     console.log(listMissing)
// }).catch(err => console.log(err))

router.get("/:id", async(req,res)=>{
        getAllClientbyID(req.params.id).then((data)=>{
            const missingClient = data.filter((client)=>{
                return checkMissingClient(client)
            })
            res.send(missingClient)
        }).catch(err => res.send(err))
})

router.get("/", async(req,res)=>{
    getAllClient()
    .then((data) => {
        getPhoneNumberAll()
        .then(async (clients) => {
            let jsondata = await Promise.all(clients.map(async (client) =>{
                return {
                    clients_id : addingCode(data,client),
                    name: client["Caller Name"] ? nameCheck(client["Caller Name"]) : "Unknown",
                    number: client["PhoneNumber"].replace(/-/g,"")
                }
            }))
            res.send(jsondata)
        })
        .catch(console.log("error occured"))
    })
    .catch(err => res.send(err))
})



module.exports = router