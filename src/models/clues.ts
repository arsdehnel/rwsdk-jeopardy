import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { type AnySQLiteColumn, index, int, snakeCase, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';
import { users } from './users';

export const clues = snakeCase.table(
	'clues',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		categoryId: text()
			.notNull()
			.references((): AnySQLiteColumn => categories.id),
		text: text().notNull(),
		response: text().notNull(),
		position: int(),
		lastVerifiedAt: text(),
		createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
		createdBy: text()
			.notNull()
			.references((): AnySQLiteColumn => users.id),
		updatedAt: text(),
		updatedBy: text().references((): AnySQLiteColumn => users.id),
		deletedAt: text(),
		deletedBy: text().references((): AnySQLiteColumn => users.id),
	},
	table => [
		index('clues_category_id_idx').on(table.categoryId),
		uniqueIndex('clues_category_id_position_idx').on(table.categoryId, table.position).where(sql`"deleted_at" IS NULL`),
	],
);
