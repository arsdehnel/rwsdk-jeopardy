import crypto from 'node:crypto';
import { index, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';
import { clues } from './clues';
import { users } from './users';

export const verifications = sqliteTable(
	'verifications',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		categoryId: text().references(() => categories.id, { onDelete: 'cascade' }),
		clueId: text().references(() => clues.id, { onDelete: 'cascade' }),
		createdAt: text()
			.notNull()
			.$defaultFn(() => new Date().toISOString()),
		createdBy: text()
			.notNull()
			.references(() => users.id),
		updatedAt: text(),
		updatedBy: text().references(() => users.id),
		deletedAt: text(),
		deletedBy: text().references(() => users.id),
	},
	table => [index('verifications_category_id_idx').on(table.categoryId), index('verifications_clue_id_idx').on(table.clueId)],
);
