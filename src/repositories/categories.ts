import { eq, isNull } from 'drizzle-orm/sql/expressions/conditions';
import { sql } from 'drizzle-orm/sql/sql';
import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { categories, verifications } from '@/models';
import type {
	CategoryDBRead,
	CategoryInGame,
	CategoryRepoInput,
	CategoryWithVerifications,
	GameStageEnum,
	KADLogger,
	VerificationDBRead,
} from '@/types';
import { validateUuid } from './utils';

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

export async function getCategoryById(categoryId: string, logger: KADLogger): Promise<CategoryWithVerifications> {
	if (!validateUuid(categoryId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [categoryId, 'Category']);
	}

	logger.debug(`Fetching category ${categoryId}`);
	const category = await db.query.categories.findFirst({
		where: {
			id: { eq: categoryId },
			deletedAt: { isNull: true },
		},
		with: {
			verifications: true,
		},
	});

	if (!category) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [0, 1, 'Category']);
	}

	logger.debug(`Fetched category ${categoryId}`);
	return category;
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

export async function deleteCategory(categoryId: string, userId: string, logger: KADLogger): Promise<CategoryDBRead> {
	if (!validateUuid(categoryId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [categoryId, 'Category']);
	}

	logger.debug(`Deleting category ${categoryId}`);
	const deleted = await db
		.update(categories)
		.set({ deletedAt: sql`(datetime('now', 'localtime'))`, deletedBy: userId })
		.where(eq(categories.id, categoryId))
		.returning();

	if (deleted.length !== 1) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.UnexpectedRecordCount, [deleted.length, 1, 'Category']);
	}

	logger.info(`Deleted category ${categoryId}`);
	return deleted[0];
}

export async function verifyCategory(
	categoryId: string,
	userId: string,
	logger: KADLogger,
): Promise<{ category: CategoryDBRead; verification: VerificationDBRead }> {
	if (!validateUuid(categoryId)) {
		throw new KADRepositoryError(KADRepositoryErrorTypes.InvalidUUID, [categoryId, 'Category']);
	}
	logger.debug(`Verifying category ${categoryId}`);

	const [verificationRecord] = await db
		.insert(verifications)
		.values({
			categoryId,
			createdBy: userId,
		})
		.returning();

	const [updatedCategory] = await db
		.update(categories)
		.set({
			lastVerifiedAt: verificationRecord.createdAt,
			updatedAt: verificationRecord.createdAt,
			updatedBy: userId,
		})
		.where(eq(categories.id, categoryId))
		.returning();

	logger.info(`Marked category ${categoryId} as verified`);

	return {
		category: updatedCategory,
		verification: verificationRecord,
	};
}
