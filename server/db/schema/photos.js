const { int, varchar, text, datetime, decimal, mysqlTable, mysqlSchema, tinyint } = require('drizzle-orm/mysql-core');

module.exports.photos = mysqlTable('photos', {
    id: int("id").primaryKey().autoincrement(),
    clients_id: int('clients_id').notNull().references(() => clients.id),
    code: varchar('code', { length: 255 }),
    filename: varchar('filename', { length: 255 }),
    size: int('size'),
    start_time: datetime('start_time'),
    type: varchar('type', { length: 255 }),
});