import crypto from 'node:crypto';
import { defineRelations, sql } from 'drizzle-orm';
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

export const gameStagesRelations = defineRelations({ games, gameStages }, r => ({
	games: {
		stages: r.many.gameStages({
			from: r.games.id,
			to: r.gameStages.gameId,
			where: {
				deletedAt: { isNull: true },
			},
		}),
	},
	gameStages: {
		game: r.one.games({
			from: r.gameStages.gameId,
			to: r.games.id,
			optional: false,
		}),
	},
}));
