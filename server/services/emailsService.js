const { eq } = require("drizzle-orm")
const db = require("../db")
const { emails } = require("../db/schema/emails")
const { clients } = require("../db/schema/clients")
const { clientUsers } = require("../db/schema/clientUsers")

const emailObject = {
    id: emails.id,
    start_time: emails.start_time,
    subject: emails.subject,
    emails_user_name: emails.user_name,
    emails_user_email: emails.user_email,
    sender: emails.sender,
    user_id: emails.client_users_id,
    user_name: clientUsers.name,
    user_number: clientUsers.number,
    client_id: emails.clients_id,
    client_code: clients.code,
    client_name: clients.name,
    client_project: clients.project,
  }

const emailsResource = () => db.select(emailObject)
  .from(emails)
  .leftJoin(clients, eq(emails.clients_id, clients.id))
  .leftJoin(clientUsers, eq(emails.client_users_id, clientUsers.id))

module.exports.getAllEmails = async () =>{
    const record = await emailsResource()
    .catch(err=>console.log(err))
    return record
}

module.exports.getAllEmailsById = async (id) =>{
    const record = await  emailsResource().where(eq(emails.id,id))
    .catch(err=>console.log(err))
    return record
}

module.exports.getEmailBySql= async (sql) =>{
    const record = await emailsResource().where(sql)
    .catch(err=>console.log(err))
    return record
}