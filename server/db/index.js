const { drizzle } = require("drizzle-orm/mysql2");
const connection = require("./connection/connection")

const db = drizzle(connection,{mode: 'default'});

module.exports = db