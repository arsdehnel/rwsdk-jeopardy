import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { blob, index, integer, snakeCase, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const credentials = snakeCase.table(
	'credentials',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text()
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		credentialId: text().notNull().unique(),
		publicKey: blob({ mode: 'buffer' }).$type<Uint8Array>().notNull(),
		counter: integer().notNull().default(0),
		name: text(),
		lastUsedAt: text(),
		createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
		createdBy: text()
			.notNull()
			.references(() => users.id),
		updatedAt: text(),
		updatedBy: text().references(() => users.id),
		deletedAt: text(),
		deletedBy: text().references(() => users.id),
	},
	table => [
		index('credentials_user_id_idx').on(table.userId),
		index('credentials_user_credential_idx').on(table.userId, table.credentialId),
	],
);
