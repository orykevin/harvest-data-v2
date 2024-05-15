const { eq } = require("drizzle-orm")
const db = require("../db")
const { phonecalls } = require('../db/schema/phonecalls')
const { clients } = require('../db/schema/clients')
const { clientUsers } = require("../db/schema/clientUsers")

const phonecallObject = {
    id: phonecalls.id,
    phone_number: phonecalls.number,
    start_time: phonecalls.start_time,
    finish_time: phonecalls.finish_time,
    duration: phonecalls.duration,
    io: phonecalls.io,
    user_id: phonecalls.client_users_id,
    user_name: clientUsers.name,
    user_number: clientUsers.number,
    client_id: phonecalls.clients_id,
    client_code: clients.code,
    client_name: clients.name,
    client_project: clients.project,
  }

const phonecallsResource = () => db.select(phonecallObject)
  .from(phonecalls)
  .leftJoin(clients, eq(phonecalls.clients_id, clients.id))
  .leftJoin(clientUsers, eq(phonecalls.client_users_id, clientUsers.id))

module.exports.getAllPhonecalls = async () =>{
    const record = await phonecallsResource()
    .catch(err=>console.log(err))
    return record
}

module.exports.getAllPhonecallsById = async (id) =>{
    const record = await phonecallsResource().where(eq(phonecalls.id,id))
    .catch(err=>console.log(err))
    return record
}

module.exports.getPhonecallsBySql= async (sql) =>{
    const record = await phonecallsResource().where(sql)
    .catch(err=>console.log(err))
    return record
}