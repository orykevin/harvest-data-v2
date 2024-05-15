const { eq } = require("drizzle-orm")
const db = require("../db")
const { photos } = require("../db/schema/photos")
const { clients } = require("../db/schema/clients")

const photoObject = {
    id: photos.id,
    type: photos.type,
    filename: photos.filename,
    start_time: photos.start_time,
    size: photos.size,
    client_id: photos.clients_id,
    client_code: clients.code,
    client_name: clients.name,
    client_project: clients.project,
  }

const photosResource = () => db.select(photoObject)
  .from(photos)
  .leftJoin(clients, eq(photos.clients_id, clients.id))

module.exports.getAllPhotos = async () =>{
    const record = await photosResource()
    .catch(err=>console.log(err))
    return record
}

module.exports.getPhotosById = async (id) =>{
    const record = await photosResource().where(eq(photos.id,id))
    .catch(err=>console.log(err))
    return record
}

module.exports.getPhotoslBySql= async (sql) =>{
    const record = await photosResource().where(sql)
    .catch(err=>console.log(err))
    return record
}
