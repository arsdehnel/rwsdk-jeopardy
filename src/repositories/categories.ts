import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { categories } from '@/models';
import type { CategoryDBRead, CategoryRepoInput, KADLogger } from '@/types';

export async function getCategories(logger: KADLogger): Promise<CategoryDBRead[]> {
	logger.info(`Fetching all categories`);
	return await db.select().from(categories);
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
