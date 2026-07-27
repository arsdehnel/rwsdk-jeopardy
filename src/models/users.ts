import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { type AnySQLiteColumn, snakeCase, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { userRoles } from '@/data/roles';

export const users = snakeCase.table(
	'users',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		username: text().notNull().unique(),
		role: text({ enum: userRoles }).default('BASIC').notNull(),
		createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
		createdBy: text().references((): AnySQLiteColumn => users.id),
		updatedAt: text(),
		updatedBy: text().references((): AnySQLiteColumn => users.id),
		deletedAt: text(),
		deletedBy: text().references((): AnySQLiteColumn => users.id),
	},
	table => [uniqueIndex('users_username_idx').on(table.username)],
);
