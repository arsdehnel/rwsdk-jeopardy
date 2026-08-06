import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { type AnySQLiteColumn, index, snakeCase, text } from 'drizzle-orm/sqlite-core';
import { gameStageEnum } from './enums';
import { games } from './games';
import { users } from './users';

export const gameStages = snakeCase.table(
	'game_stages',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		gameId: text()
			.notNull()
			.references((): AnySQLiteColumn => games.id),
		stage: text({ enum: gameStageEnum }).default('SINGLE').notNull(),
		createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
		createdBy: text()
			.notNull()
			.references((): AnySQLiteColumn => users.id),
		updatedAt: text(),
		updatedBy: text().references((): AnySQLiteColumn => users.id),
		deletedAt: text(),
		deletedBy: text().references((): AnySQLiteColumn => users.id),
	},
	table => [index('game_stages_game_id_idx').on(table.gameId)],
);
