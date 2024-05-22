const fs = require("fs")
const EmlParser = require("eml-parser")
const path = require("path")
const outerpath = path.resolve(__dirname, "../../app/public/emails")
const db = require("../db")
const cheerio = require("cheerio")
const { getClientUserslBySql } = require("./clientUsersService")
const { eq, sql } = require("drizzle-orm")
const { clientUsers } = require("../db/schema/clientUsers")
const { emails } = require("../db/schema/emails")
const { getAllClients } = require("./clientsService")

const removeFileExt = (filename) => {
    const indexdot = filename.lastIndexOf(".");
    const nameFile = filename.substring(0,indexdot).replace("#","")
    return nameFile
}

module.exports.getEmailData = async (file) => {
    const nameFile = removeFileExt(file.originalname)
    const imagestrings = await file.buffer.toString("utf8")
    let newData = await new EmlParser(imagestrings)
    .getEmailAsHtml()
    .then((html)=>{
        const $ = cheerio.load(html)
        $("style").remove()

        let modified = $.html()

        return new Promise((resolve,reject) => {
            fs.writeFile(`${outerpath}/${nameFile}.html`,modified,(err)=>{
                if(err){
                    console.log(err)
                    reject(err)
                }else{
                    resolve(`Email File uploaded : ${nameFile}`)
                }
            })
        })
    })
    .catch((err)=>{
        console.log(err)
    return err
    })
    return newData
}

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
    let [user] = await getClientUserslBySql(eq(clientUsers.number,userClient))
    .catch(err => console.log(err))
    return user
}

const getAllClient = async () =>{
    const allClients = await getAllClients()
    .catch(err => console.log(err))
    return allClients
  }

  const addUserClient = async (idclient,contact) =>{
    // let query = 'INSERT IGNORE INTO client_users (clients_id, name, number) VALUES (?, ?, ?)'
    // let [input] = await db.query(query,[idclient,contact.name,contact.address])
    const [input] = await db.insert(clientUsers)
    .values({
        clients_id: idclient,
        name: contact.name,
        number: contact.address,
    })
    .onDuplicateKeyUpdate({
        set:{
            number: sql`VALUES(number)`
        }
    })
    return input
  }

  const setValueRecord = async (values) => {
    // let sqlinsert = "INSERT IGNORE INTO emails (clients_id, client_users_id, subject, start_time, user_name, user_email, sender) VALUES ?"
    // let [input] = await db.query(sqlinsert,[values]) // sqlerror
    // .catch(err => console.log(err))
    const [input] = await db.insert(emails)
    .values(values)
    .onDuplicateKeyUpdate({
        set:{
            subject: sql`VALUES(subject)`
        }
    })
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
    let values = {clients_id,client_users_id,subject,start_time,user_name,user_email,sender}
    return values
  }



module.exports.parseEmailHeader = async (files,client) => {
    const clients = client // [{c1},{c2}]
    const allFiles = files
    const allClient = await getAllClient()
    const allFilesMap = await Promise.all(allFiles.map(async(file,ids)=>{
        const imagestring = file.buffer.toString("utf8")
        let newData = await new EmlParser(imagestring)
        .getEmailHeaders()
        .then((res)=>{
            return new Promise(async (resolve,reject) => {
                let contact = isSender(res) ? res.from[0] : res.to[0]
                let idFromName = checkIdFromCode(getCode(contact.name),allClient)
                let clientsInfo = Array.isArray(client) ? JSON.parse(clients[ids]) : JSON.parse(client)
                let id = idFromName !== 1 ? idFromName : (clientsInfo.client !== null && clientsInfo.client?.clientId !== 1) ? clientsInfo.client.clientId : 1
                let checkedclient = await checkClientUsers(contact.address)
                if(checkedclient === undefined){
                    addUserClient(id,contact)
                    .then(async (res) => {
                        return await checkClientUsers(contact.address)
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
        console.log('error')
        return null
        })
        return newData
    }))
    let recordingtoDB = await setValueRecord(allFilesMap)
    return recordingtoDB
}


module.exports.parseEmailHeaderInfo = async (files,client) => {
    const allFiles = files
    const allFilesMap = await Promise.all(allFiles.map(async(file,ids)=>{
        const imagestring = file.buffer.toString("utf8")
        let newData = await new EmlParser(imagestring)
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

