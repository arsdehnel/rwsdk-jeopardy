import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { type AnySQLiteColumn, index, int, snakeCase, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { games } from './games';
import { users } from './users';

export const gameContestants = snakeCase.table(
	'game_contestants',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		gameId: text()
			.notNull()
			.references((): AnySQLiteColumn => games.id),
		sessionId: text().notNull(),
		userId: text().references((): AnySQLiteColumn => users.id),
		name: text(),
		score: int(),
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
		index('game_contestants_game_id_idx').on(table.gameId),
		uniqueIndex('game_contestants_game_id_session_id_idx').on(table.gameId, table.sessionId),
		uniqueIndex('game_contestants_game_id_user_id_idx').on(table.gameId, table.userId),
	],
);
