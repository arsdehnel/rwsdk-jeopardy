import type { BatchItem } from 'drizzle-orm/batch';
import { and, eq, isNull } from 'drizzle-orm/sql/expressions/conditions';
import { sql } from 'drizzle-orm/sql/sql';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { gameStageCategories } from '@/models';
import type { GameStageCategoryDBRead, GameStageCategoryRepoInput, KADLogger } from '@/types';
import { validateUuid } from './utils';

export async function createGameStageCategory(
	gameStageCategory: GameStageCategoryRepoInput,
	gameStageId: string,
	userId: string,
	logger: KADLogger,
): Promise<GameStageCategoryDBRead> {
	if (!validateUuid(gameStageId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameStageId, 'Game Stage']);
	}
	logger.info(`Creating new game stage category`);

	const createdGameStages = await db
		.insert(gameStageCategories)
		.values({
			...gameStageCategory,
			gameStageId,
			createdBy: userId,
		})
		.returning();

	if (createdGameStages.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [
			createdGameStages.length,
			1,
			'Game Stage Category',
		]);
	}

	return createdGameStages[0];
}

export async function updateGameStageCategory(
	gameStageCategoryId: string,
	gameStageCategory: GameStageCategoryRepoInput,
	userId: string,
	logger: KADLogger,
): Promise<GameStageCategoryDBRead> {
	if (!validateUuid(gameStageCategoryId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [gameStageCategoryId, 'Game Stage Category']);
	}

	logger.info(`Updating game stage category ${gameStageCategoryId}`);

	const updatedGameStages = await db
		.update(gameStageCategories)
		.set({
			...gameStageCategory,
			updatedBy: userId,
		})
		.where(eq(gameStageCategories.id, gameStageCategoryId))
		.returning();

	if (updatedGameStages.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [
			updatedGameStages.length,
			1,
			'Game Stage Category',
		]);
	}

	return updatedGameStages[0];
}

export async function getGameStageCategories(stageId: string, logger: KADLogger): Promise<GameStageCategoryDBRead[]> {
	if (!validateUuid(stageId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [stageId, 'Game Stage']);
	}

	logger.debug(`Fetching game stage categories for stage ${stageId}`);
	const categories = await db
		.select()
		.from(gameStageCategories)
		.where(and(eq(gameStageCategories.gameStageId, stageId), isNull(gameStageCategories.deletedAt)));

	return categories;
}

export async function saveGameStageCategories(
	stageId: string,
	categoryIds: string[],
	userId: string,
	logger: KADLogger,
): Promise<GameStageCategoryDBRead[]> {
	logger.debug(`Updating game stage categories for stage ${stageId}`);

	// get existing instructions for the cooking method (must happen before batch so we know what to mutate)
	const existingCategories = await db
		.select()
		.from(gameStageCategories)
		.where(and(eq(gameStageCategories.gameStageId, stageId), isNull(gameStageCategories.deletedAt)));

	logger.debug(`Found ${existingCategories.length} existing categories for stage ${stageId}`);

	// soft-delete removed categories
	const removedCategoryIds = existingCategories.map(i => i.id).filter(id => !categoryIds.includes(id));

	logger.debug(`Soft-deleting ${removedCategoryIds.length} removed categories for stage ${stageId}`);

	// Phase 1: move all existing categories being updated to temporary negative positions.
	// This clears the positive number space so Phase 2 can assign final values without hitting
	// the (stageId, position) unique constraint.
	const existingUpdates = existingCategories.filter(category => categoryIds.includes(category.id));

	// All mutations are batched into a single D1 batch call (D1 does not support BEGIN transactions).
	// Statements execute sequentially within the batch, so Phase 1 completes before Phase 2 runs,
	// preserving the two-phase position swap. The batch result array mirrors statement order,
	// so we track the counts of each phase to slice out the Phase 2 returning() rows at the end.
	const deleteCount = removedCategoryIds.length;
	const phase1Count = existingUpdates.length;

	const deleteStatements = removedCategoryIds.map(id =>
		db
			.update(gameStageCategories)
			.set({ deletedAt: sql`(datetime('now', 'localtime'))`, deletedBy: userId })
			.where(eq(gameStageCategories.id, id)),
	) as BatchItem<'sqlite'>[];

	const phase1Statements = existingUpdates.map((category, index) =>
		db
			.update(gameStageCategories)
			.set({ position: -(index + 1) })
			.where(eq(gameStageCategories.id, category.id)),
	) as BatchItem<'sqlite'>[];

	// Phase 2: apply final positions to existing categories and insert new ones.
	// All existing categories are now at negative positions, so no constraint conflicts can occur.
	const phase2UpdatesStatements = existingUpdates.map(category => {
		const position = categoryIds.indexOf(category.id);
		return db
			.update(gameStageCategories)
			.set({
				position: position >= 0 ? position : category.position,
				categoryId: category.categoryId,
				updatedAt: sql`(datetime('now', 'localtime'))`,
				updatedBy: userId,
			})
			.where(eq(gameStageCategories.id, category.id))
			.returning();
	}) as BatchItem<'sqlite'>[];

	const phase2InsertsStatements = categoryIds
		.filter(categoryId => !existingUpdates.some(category => category.categoryId === categoryId))
		.map((categoryId, index) =>
			db
				.insert(gameStageCategories)
				.values({
					gameStageId: stageId,
					categoryId,
					position: index,
					createdBy: userId,
				})
				.returning(),
		) as BatchItem<'sqlite'>[];

	const allStatements = [...deleteStatements, ...phase1Statements, ...phase2UpdatesStatements, ...phase2InsertsStatements];

	if (allStatements.length === 0) {
		return [];
	}

	if (deleteCount > 0) {
		logger.info(`Deleting ${deleteCount} categories for stage ${stageId}`);
	}
	logger.debug(`Moving ${phase1Count} existing categories to temporary positions for stage ${stageId}`);

	const batchResults = await db.batch(allStatements as [BatchItem<'sqlite'>, ...BatchItem<'sqlite'>[]]);

	if (deleteCount > 0) {
		logger.info(`Deleted ${deleteCount} categories for stage ${stageId}`);
	}

	const phase2Start = deleteCount + phase1Count;
	const savedInstructions = (batchResults.slice(phase2Start) as GameStageCategoryDBRead[][]).flat();

	logger.info(`Updated ${categoryIds.length} categories for stage ${stageId}`);
	return savedInstructions;
}
