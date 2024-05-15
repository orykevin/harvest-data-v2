const { eq } = require("drizzle-orm")
const db = require("../db")
const { clients } = require("../db/schema/clients")

module.exports.getAllClients = async () =>{
    const record = await db.select().from(clients)
    .catch(err=>console.log(err))
    return record
}

module.exports.getClientsById = async (id) =>{
    const record = await db.select().from(clients).where(eq(clients.id,id))
    .catch(err=>console.log(err))
    return record
}

module.exports.getClientslBySql= async (sql) =>{
    const record = await db.select().from(clients).where(sql)
    .catch(err=>console.log(err))
    return record
}
