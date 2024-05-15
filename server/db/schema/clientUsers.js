const { int, varchar, text, datetime, decimal, mysqlTable, mysqlSchema } = require('drizzle-orm/mysql-core');

module.exports.clientUsers = mysqlTable('client_users', {
    id: int("id").primaryKey().autoincrement(),
    clients_id: int('clients_id').notNull().references(() => clients.id),
    name: varchar('name', { length: 255 }),
    number: varchar('number', { length: 255 }),
    created_at: datetime('created_at'),
    updated_at: datetime('updated_at'),
});