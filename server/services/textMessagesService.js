const { eq } = require("drizzle-orm")
const db = require("../db")
const { textMessages } = require('../db/schema/text_messages')
const { clients } = require("../db/schema/clients")
const { clientUsers } = require("../db/schema/clientUsers")

const textMessageObject = {
    id: textMessages.id,
    message: textMessages.message,
    start_time: textMessages.message_date,
    type: textMessages.type,
    kind: textMessages.kind,
    filename: textMessages.filename,
    user_id: textMessages.clients_user_id,
    user_name: clientUsers.name,
    user_number: clientUsers.number,
    client_id: textMessages.clients_user_id,
    client_code: clients.code,
    client_name: clients.name,
    client_project: clients.project,
  }

const textMessagesResource = () => db.select(textMessageObject)
  .from(textMessages)
  .leftJoin(clientUsers, eq(textMessages.clients_user_id, clientUsers.id))
  .leftJoin(clients, eq(clientUsers.clients_id, clients.id))
  

module.exports.getAllTextMessages = async () =>{
    const record = await textMessagesResource()
    .catch(err=>console.log(err))
    return record
}

module.exports.getAllTextMessagesById = async (id) =>{
    const record = await textMessagesResource().where(eq(textMessages.id,id))
    .catch(err=>console.log(err))
    return record
}

module.exports.getTextMessagesBySql= async (sql) =>{
    const record = await textMessagesResource().where(sql)
    .catch(err=>console.log(err))
    return record
}