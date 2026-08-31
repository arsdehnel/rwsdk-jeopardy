import crypto from 'node:crypto';
import { sql } from 'drizzle-orm';
import { type AnySQLiteColumn, index, snakeCase, text } from 'drizzle-orm/sqlite-core';
import { gamePhaseEnum, gameStageEnum } from '../data/enums';
import { users } from './users';

export const games = snakeCase.table(
	'games',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		ownerId: text()
			.notNull()
			.references((): AnySQLiteColumn => users.id),
		phase: text({ enum: gamePhaseEnum }).default('SETUP').notNull(),
		displaySessionId: text(),
		hostUserId: text().references((): AnySQLiteColumn => users.id),
		activeContestantSessionId: text(),
		usedClueIds: text({ mode: 'json' }).$type<string[]>(),
		currentStage: text({ enum: gameStageEnum }).notNull(),
		createdAt: text().notNull().default(sql`(datetime('now', 'localtime'))`),
		createdBy: text()
			.notNull()
			.references((): AnySQLiteColumn => users.id),
		updatedAt: text(),
		updatedBy: text().references((): AnySQLiteColumn => users.id),
		deletedAt: text(),
		deletedBy: text().references((): AnySQLiteColumn => users.id),
	},
	table => [index('games_owner_id_idx').on(table.ownerId)],
);
