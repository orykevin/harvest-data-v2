const { int, varchar, text, datetime, decimal, mysqlTable, mysqlSchema } = require('drizzle-orm/mysql-core');

module.exports.clients = mysqlTable('clients', {
    id: int("id").primaryKey().autoincrement(),
    code: varchar('code', { length: 255 }),
    name: varchar('name', { length: 255 }),
    project: varchar('project', { length: 255 }),
    created_at: datetime('created_at'),
    updated_at: datetime('updated_at'),
});