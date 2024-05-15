const { int, varchar, text, datetime, decimal, mysqlTable, mysqlSchema, tinyint } = require('drizzle-orm/mysql-core');

module.exports.emails = mysqlTable('emails', {
    id: int("id").primaryKey().autoincrement(),
    clients_id: int('clients_id').notNull().references(() => clients.id),
    client_users_id: int('client_users_id').notNull().references(() => clientUsers.id),
    subject: varchar('subject', { length: 255 }),
    start_time: datetime('start_time'),
    user_name: varchar('user_name', { length: 255 }),
    user_email: varchar('user_email', { length: 255 }),
    sender: tinyint('sender')
});