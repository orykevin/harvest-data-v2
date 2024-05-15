const { int, varchar, text, datetime, decimal, mysqlTable, mysqlSchema, tinyint } = require('drizzle-orm/mysql-core');

module.exports.textMessages = mysqlTable('text_messages', {
    id: int("id").primaryKey().autoincrement(),
    clients_user_id: int('client_users_id').notNull().references(() => clientUsers.id),
    message: varchar('message', { length: 255 }),
    message_date: datetime('message_date'),
    type: varchar('type', { length: 255 }),
    kind: varchar('kind', { length: 255 }),
    filename: varchar('filename', { length: 255 }),
    created_at: datetime('created_at'),
    updated_at: datetime('updated_at'),
});