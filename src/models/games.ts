import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { type AnySQLiteColumn, snakeCase, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';

export const gamePhaseEnum = ['SETUP', 'PLAYING', 'FINISHED'] as const;

export const games = snakeCase.table('games', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	phase: text({ enum: gamePhaseEnum }).default('SETUP').notNull(),
	createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
	createdBy: text()
		.notNull()
		.references((): AnySQLiteColumn => users.id),
	updatedAt: text(),
	updatedBy: text().references((): AnySQLiteColumn => users.id),
	deletedAt: text(),
	deletedBy: text().references((): AnySQLiteColumn => users.id),
});
