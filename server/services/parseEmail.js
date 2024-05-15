const fs = require("fs")
const emailParser = require("eml-parser")
const path = require("path")
const outerpath = path.resolve(__dirname, "../../../app/public/emails")
const db = require("../db")
const cheerio = require("cheerio")

const removeFileExt = (filename) => {
    const indexdot = filename.lastIndexOf(".");
    const nameFile = filename.substring(0,indexdot).replace("#","")
    return nameFile
}

module.exports.getEmailData = async (file) => {
    const indexdot = file.originalname.lastIndexOf(".");
    const nameFile = removeFileExt(file.originalname)
    const imagestring = file.buffer.toString("utf8")
    let newData = await new emailParser(imagestring)
    .getEmailAsHtml()
    .then((res)=>{
    return res})
    .then((html)=>{
        //console.log(html)
        const $ = cheerio.load(html)
        $("style").remove()

        let modified = $.html()

        return new Promise((resolve,reject) => {
            fs.writeFile(`${outerpath}/${nameFile}.html`,modified,(err)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(`Email File uploaded : ${nameFile}`)
                }
            })
        })
    })
    .catch((err)=>{
    return err
    })
    return newData
}

// { result header
//     "subject": "Your thoughts on this montior",
//     "from": [
//         {
//             "address": "patr@exhibitree.com",
//             "name": "Pat Rees"
//         }
//     ],
//     "to": [
//         {
//             "address": "pete@helpguide.com",
//             "name": "Pete Inc."
//         }
//     ],
//     "cc": null,
//     "date": "2017-05-09T21:37:09.000Z",
//     "messageId": "<62220057-3B9A-43B5-97E3-4B9243C3AA56@exhibitree.com>"
// }

// { result of clients
//     id: 2,
//     code: '361',
//     name: 'Three-Sixty One, Inc.',
//     project: 'Three-Sixty One',
//     created_at: 2023-08-18T02:40:34.000Z,
//     updated_at: 2023-08-18T02:40:34.000Z
//   }

// { result of userclient
//     "id": 21,
//     "clients_id": 156,
//     "name": "VND - Tamara Van Nuck",
//     "number": "iamtamvan56@icloud.com",
//     "created_at": null,
//     "updated_at": null
// }

//   "name_file":"Computers available tonight_.eml",
//   "size_file":1018,
//   "type":"message/rfc822",
//   "date":1693924015324,
//   "client":null,

const isSender = (sender) =>{
    if(sender.from[0].address === "pete@helpguide.com"){
        return false
    }else{
        return true
    }
}

const getCode = (name) =>{
    let index = name.indexOf(" - ")
    if(index > 0){
        return name.slice(0,index)
    }
}

const checkIdFromCode = (code,allClient) =>{
    const index = allClient.findIndex(client => client.code === code)
    if(index > 0){
        return allClient[index].id
    }else{
        return 1
    }
}

const checkClientUsers = async (userClient) => {
    let query = "SELECT * FROM client_users WHERE number = ?"
    let [[user]] = await db.query(query,userClient)
    .catch(err => console.log(err))
    return user
}

const getAllClient = async () =>{
    const [allClients] = await db.query("SELECT * FROM clients")
    .catch(err => console.log(err))
    return allClients
  }

  const addUserClient = async (idclient,contact) =>{
    let query = 'INSERT IGNORE INTO client_users (clients_id, name, number) VALUES (?, ?, ?)'
    let [input] = await db.query(query,[idclient,contact.name,contact.address])
    return input
  }

  const setValueRecord = async (values) => {
    let sqlinsert = "INSERT IGNORE INTO emails (clients_id, client_users_id, subject, start_time, user_name, user_email, sender) VALUES ?"
    let [input] = await db.query(sqlinsert,[values]) // sqlerror
    .catch(err => console.log(err))
    return input
  }

  const addEmailRecord = (header,userclient,contacts,filename) => {
    let clients_id = userclient.clients_id
    let client_users_id = userclient.id
    let subject = removeFileExt(filename)
    let start_time = new Date(new Date(header.date).toLocaleString("en-US",{timeZone: 'America/Los_Angeles'}))
    let user_name = contacts.name !== "" ? contacts.name : userclient.name
    let user_email = contacts.address
    let sender = isSender(header) ? 1 : 0
    //console.log(start_time)
    let values = [clients_id,client_users_id,subject,start_time,user_name,user_email,sender]
    return values
  }



module.exports.parseEmailHeader = async (files,client) => {
    //console.log(client)
    const clients = client // [{c1},{c2}]
    const allFiles = files
    const allClient = await getAllClient()
    const allFilesMap = await Promise.all(allFiles.map(async(file,ids)=>{
        const imagestring = file.buffer.toString("utf8")
        let newData = await new emailParser(imagestring)
        .getEmailHeaders()
        .then((res)=>{
            return new Promise(async (resolve,reject) => {
                let contact = isSender(res) ? res.from[0] : res.to[0]
                let idFromName = checkIdFromCode(getCode(contact.name),allClient)
                let clientsInfo = Array.isArray(client) ? JSON.parse(clients[ids]) : JSON.parse(client)
                //console.log(clientsInfo)
                let id = idFromName !== 1 ? idFromName : (clientsInfo.client !== null && clientsInfo.client?.clientId !== 1) ? clientsInfo.client.clientId : 1
                //console.log(clientsInfo)
                //console.log(contact)
                //console.log(id)
                let checkedclient = await checkClientUsers([contact.address])
                //console.log(checkedclient)
                if(checkedclient === undefined){
                    addUserClient(id,contact)
                    .then(async (res) => {
                        return await checkClientUsers([contact.address])
                    })
                    .then(async(recheck) => {
                        resolve(addEmailRecord(res,recheck,contact,clientsInfo.name_file)) 
                    })
                }else{
                    resolve(addEmailRecord(res,checkedclient,contact,clientsInfo.name_file)) 
                }
            })
        }).catch((err)=>{
        console.log(err)
        return null
        })
        return newData
    }))
    let recordingtoDB = await setValueRecord(allFilesMap)
    return recordingtoDB
}


module.exports.parseEmailHeaderInfo = async (files,client) => {
    //console.log(client)
    const allFiles = files
    const allFilesMap = await Promise.all(allFiles.map(async(file,ids)=>{
        const imagestring = file.buffer.toString("utf8")
        let newData = await new emailParser(imagestring)
        .getEmailHeaders()
        .then((res)=>{
            return new Promise(async (resolve,reject) => {
                resolve(res)
            })
        }).catch((err)=>{
        console.log(err)
        })
        return newData
    }))
    return allFilesMap
}

