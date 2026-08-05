import { isNull } from 'drizzle-orm/sql/expressions/conditions';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { categories } from '@/models';
import type { CategoryDBRead, CategoryInGame, CategoryRepoInput, GameStageEnum, KADLogger } from '@/types';

export async function getCategoriesForGameStage(
	gameStageCategoryIds: string[],
	gameStage: GameStageEnum,
	logger: KADLogger,
): Promise<CategoryInGame[]> {
	logger.info(`Fetching categories for game stage ${gameStageCategoryIds.join(', ')}`);
	const categories = await db.query.categories.findMany({
		where: {
			deletedAt: { isNull: true },
			id: { in: gameStageCategoryIds },
		},
		with: {
			clues: {
				where: {
					deletedAt: { isNull: true },
				},
			},
		},
	});

	let clueMultiplier: number = 0;
	switch (gameStage) {
		case 'SINGLE':
			clueMultiplier = 100;
			break;
		case 'DOUBLE':
			clueMultiplier = 200;
			break;
		case 'TRIPLE':
			clueMultiplier = 300;
			break;
		default:
			throw new KADRepositoryError(KADRepositoryErrorTypes.SingleInstanceError, [`Invalid game stage: ${gameStage}`]);
	}

	logger.debug(`Fetched ${categories.length} categories for game stage ${gameStageCategoryIds.join(', ')}`);

	return categories.map(category => ({
		id: category.id,
		name: category.name,
		clues: category.clues.map((clue, idx) => ({
			id: clue.id,
			text: clue.text,
			response: clue.response,
			value: (idx + 1) * clueMultiplier,
		})),
	}));
}

export async function getCategories(logger: KADLogger): Promise<CategoryDBRead[]> {
	logger.info(`Fetching categories`);
	return await db.select().from(categories).where(isNull(categories.deletedAt));
}

export async function createCategory(category: CategoryRepoInput, userId: string, logger: KADLogger): Promise<CategoryDBRead> {
	logger.info(`Creating category ${category.name}`);

	const createdCategories = await db
		.insert(categories)
		.values({
			...category,
			createdBy: userId,
		})
		.returning();

	if (createdCategories.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [createdCategories.length, 1, 'Category']);
	}

	return createdCategories[0];
}
