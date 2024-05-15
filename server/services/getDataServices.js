const { sql, eq, and, inArray } = require("drizzle-orm")
const { getEmailBySql } = require("./emailsService")
const { emails } = require("../db/schema/emails")
const { getPhotoslBySql } = require("./photosService")
const { photos } = require("../db/schema/photos")
const { getPhonecallsBySql } = require("./phonecallsService")
const { phonecalls } = require("../db/schema/phonecalls")
const { getTextMessagesBySql } = require("./textMessagesService")
const { textMessages } = require("../db/schema/text_messages")
const { clients } = require("../db/schema/clients")

const messageArray = (filters) => {
    let messageType =[]
    filters.forEach((f)=>{
        switch(f){
            case 'imes' : messageType.push('iMessage'); break;
            case 'wa' : messageType.push('WhatsApp'); break;
            case 'sms' : messageType.push('SMS')  ; break;
        }
    })
    return messageType
}

const dateComparison = (date1,date2) => {
    const d1 = new Date(date1)
    const d2 = new Date(date2)
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate();
}

module.exports.getByDay = async (date,clientId,filters) =>{
    const perDaySql = (col) => sql`${col} >= date(${date}) and ${col} < date_add(${date},interval 1 day)`
    const textMessageSelect = (col) => and(sql`${col} >= date(${date}) and ${col} < date_add(${date},interval 1 day)`,(filters && filters?.length > 0) && inArray(textMessages.type,messageArray(filters)))

    const emailsRecord = filters?.includes('email') ? await getEmailBySql(perDaySql(emails.start_time)) : []
    const photosRecord = filters?.includes('photos') ? await getPhotoslBySql(perDaySql(photos.start_time)) : []
    const phonecallsRecord = filters?.includes('call') ? await getPhonecallsBySql(perDaySql(phonecalls.start_time)) : []
    const textMessagesRecord = await getTextMessagesBySql(textMessageSelect(textMessages.message_date))
    const sortByTime = emailsRecord.concat(photosRecord,phonecallsRecord,textMessagesRecord)
    .sort((a, b) => a.start_time - b.start_time)
    .filter(rec => clientId ? rec.client_id == clientId : true)

    return sortByTime
}



module.exports.getByClient = async (query) =>{
    const {clientId,types : filters, from, to} = query
   
    const perIdSql = (col,time) => from ? and(eq(col,clientId),sql`${time} >= date(${from}) and ${time} < date_add(${to},interval 1 day)`) : eq(col,clientId)
    const textMessageSql = (filters) => and(eq(clients.id,clientId),(filters && messageArray(filters).length > 0) && inArray(textMessages.type,messageArray(filters)),from && sql`${textMessages.message_date} >= date(${from}) and ${textMessages.message_date} < date_add(${to},interval 1 day)`)

    const emailsRecord = filters?.includes('email') ? await getEmailBySql(perIdSql(emails.clients_id, emails.start_time)) : []
    const photosRecord = filters?.includes('photos') ? await getPhotoslBySql(perIdSql(photos.clients_id, photos.start_time)) : []
    const phonecallsRecord = filters?.includes('call') ? await getPhonecallsBySql(perIdSql(phonecalls.clients_id ,phonecalls.start_time)) : []
    const iMessagesRecord = await getTextMessagesBySql(textMessageSql(filters))

    const sortByTime = emailsRecord.concat(iMessagesRecord,photosRecord,phonecallsRecord)
    .sort((a, b) => a.start_time - b.start_time)
    
    let mapPerDate = []

    sortByTime.forEach((data,i) => {
        if(i === 0) {
            mapPerDate = [{type : 'seperator',date: data?.start_time}, data]
            
        }if(!dateComparison(data.start_time,sortByTime[i+1]?.start_time) && i !== sortByTime.length-1){
            mapPerDate = [...mapPerDate,data,{type : 'seperator',date: sortByTime[i+1]?.start_time}]
        }
        else{
            mapPerDate = [...mapPerDate,data]
        }
    })


    return mapPerDate
}