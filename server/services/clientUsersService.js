const { eq, sql } = require("drizzle-orm")
const db = require("../db")
const { clientUsers } = require("../db/schema/clientUsers")

module.exports.getAllClientUsers = async () =>{
    const record = db.select().from(clientUsers)
    .catch(err=>console.log(err))
    return record
}

module.exports.getByIdClientUsers = async (id) =>{
    const record = await db.select().from(clientUsers).where(eq(clientUsers.id,id))
    .catch(err=>console.log(err))
    return record
}

module.exports.getClientUserslBySql= async (sql) =>{
    const record = await db.select().from(clientUsers).where(sql)
    .catch(err=>console.log(err))
    return record
}




