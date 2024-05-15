const { int, varchar, text, datetime, decimal, mysqlTable, mysqlSchema, tinyint } = require('drizzle-orm/mysql-core');

module.exports.phonecalls = mysqlTable('phonecalls', {
    id: int("id").primaryKey().autoincrement(),
    clients_id: int('clients_id').notNull().references(() => clients.id),
    client_users_id: int('client_users_id').notNull().references(() => clientUsers.id),
    name: varchar('name', { length: 255 }),
    number: varchar('number', { length: 255 }),
    start_time: datetime('start_time'),
    finish_time: datetime('finish_time'),
    duration: int('duration'),
    io: varchar('io', { length: 255 }),
});