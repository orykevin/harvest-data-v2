const db = require("../db")
const service = require("../services/get-services")

module.exports.getByDay = async (date) => {
    const querymsg = `
    SELECT * 
    FROM text_messages
    WHERE message_date >= DATE(?) AND message_date < DATE_ADD(?, INTERVAL 1 DAY)
  `;
  const queryphn = `
    SELECT * 
    FROM phonecalls
    WHERE start_time >= DATE(?) AND start_time < DATE_ADD(?, INTERVAL 1 DAY)
  `;
    
    const allClient = await service.getAllClient()
    .catch(err => console.log(err))

    const allUserClient = await service.getAllUserClient()
    .catch(err => console.log(err))

    const [phonecalls] =  await db.query(queryphn,[date,date])
    .catch(err => console.log(err))

    const [msgText] =  await db.query(querymsg,[date,date])
    .catch(err => console.log(err))

    const newObjectPhone = async (arr) =>{
        let mappedPhone = Promise.all(arr.map(async (phn)=>{
            let obj = await {
                ...phn,
                code: allClient[phn.clients_id - 1].code
            }
            return obj
        }))
        return mappedPhone
    }
    const newObjectText = async (arr) =>{
        let mappedText = Promise.all(arr.map(async (txt)=>{
            let {message_date,created_at,updated_at,...newObj } = txt
            let obj = await {
                ...newObj,
                name: allUserClient[txt.client_users_id - 1].name,
                start_time: txt.message_date,
                number: allUserClient[txt.client_users_id - 1].number,
                clients_id: allUserClient[txt.client_users_id - 1].clients_id,
                code: allClient[allUserClient[txt.client_users_id - 1].clients_id - 1].code
            }
            return obj
        }))
        return mappedText
    }

    const getTheProps = (prop) =>{
        if("start_time" in prop){
            return prop.start_time
        }else{
            return prop.message_date
        }
    }

    const checkCompare = (a,b) =>{
        const startTimeA = new Date(a.start_time);
        const startTimeB = new Date(b.start_time);
      
        // Ignore seconds when comparing dates
        startTimeA.setSeconds(0);
        startTimeB.setSeconds(0);
      
        if (startTimeA < startTimeB) return -1;
        if (startTimeA > startTimeB) return 1;
      
        // If start times are the same, prioritize objects with finish_time
        if (a.finish_time && !b.finish_time) return 1;
        if (!a.finish_time && b.finish_time) return -1;
      
        // If both have finish_time or both don't have finish_time, sort based on finish_time
        if (a.finish_time < b.finish_time) return -1;
        if (a.finish_time > b.finish_time) return 1;
      
        return 0;
    }

    let newPhone = await newObjectPhone(phonecalls)
    let newText = await newObjectText(msgText)

    let allData = [...newPhone,...newText].sort(checkCompare)
    
    

    return allData
}
