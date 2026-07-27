import crypto from 'node:crypto';
import { defineRelations, sql } from 'drizzle-orm';
import { type AnySQLiteColumn, index, snakeCase, text } from 'drizzle-orm/sqlite-core';
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
		createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
		createdBy: text().references((): AnySQLiteColumn => users.id),
		updatedAt: text(),
		updatedBy: text().references((): AnySQLiteColumn => users.id),
		deletedAt: text(),
		deletedBy: text().references((): AnySQLiteColumn => users.id),
	},
	table => [index('clues_category_id_idx').on(table.categoryId)],
);

export const cluesRelations = defineRelations({ clues, categories }, r => ({
	categories: {
		clues: r.many.clues({
			from: r.categories.id,
			to: r.clues.categoryId,
			where: {
				deletedAt: { isNull: true },
			},
		}),
	},
	clues: {
		category: r.one.categories({
			from: r.clues.categoryId,
			to: r.categories.id,
			optional: false,
		}),
	},
}));
