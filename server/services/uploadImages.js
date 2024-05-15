const { sql } = require("drizzle-orm")
const db = require("../db")
const { photos } = require("../db/schema/photos")

module.exports.insertToPhotos = async (array) =>{
    // const [record] =  await db.query(sqlinsert, [array])
    const [record] = await db.insert(photos)
    .values(array)
    .onDuplicateKeyUpdate({
        set:{
            filename: sql`VALUES(filename)`,
        }
    })
    return record
}


// .then((res)=>{
//     console.log(res)
//     console.log("data inserted")
// }).catch((err)=>console.log(err))