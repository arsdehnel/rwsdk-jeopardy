import crypto from 'node:crypto';
import { defineRelations, sql } from 'drizzle-orm';
import { type AnySQLiteColumn, index, int, snakeCase, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { categories } from './categories';
import { gameStages } from './game-stages';
import { users } from './users';

export const gameStageCategories = snakeCase.table(
	'game_stage_categories',
	{
		id: text()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		gameStageId: text()
			.notNull()
			.references((): AnySQLiteColumn => gameStages.id),
		categoryId: text()
			.notNull()
			.references((): AnySQLiteColumn => categories.id),
		position: int().notNull(),
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
		index('game_stage_categories_game_stage_id_idx').on(table.gameStageId),
		uniqueIndex('game_stage_categories_game_stage_id_category_id_idx')
			.on(table.gameStageId, table.categoryId)
			.where(sql`"deleted_at" IS NULL`),
		uniqueIndex('game_stage_categories_game_stage_id_position_idx')
			.on(table.gameStageId, table.position)
			.where(sql`"deleted_at" IS NULL`),
	],
);

export const gameStageCategoriesRelations = defineRelations({ gameStages, gameStageCategories }, r => ({
	gameStages: {
		categories: r.many.gameStageCategories({
			from: r.gameStages.id,
			to: r.gameStageCategories.gameStageId,
			where: {
				deletedAt: { isNull: true },
			},
		}),
	},
	gameStageCategories: {
		stage: r.one.gameStages({
			from: r.gameStageCategories.gameStageId,
			to: r.gameStages.id,
			optional: false,
		}),
	},
}));
