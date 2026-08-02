import { KADRepositoryError, KADRepositoryErrorTypes } from '@/classes';
import db from '@/db';
import { categories } from '@/models';
import type { CategoryDBRead, CategoryFilters, CategoryRepoInput, KADLogger } from '@/types';

// function buildCategoryWhere(filters: CategoryFilters): SQL<unknown> | undefined {
// 	return and(filters.id ? inArray(categories.id, filters.id) : undefined, isNull(categories.deletedAt));
// }

// const remaining = await db.query.recipeIngredients.findMany({
// 	where: (i, { and, eq, isNull }) => and(eq(i.recipeSectionId, testSectionId), isNull(i.deletedAt)),
// });

export async function getCategories(
	filters: CategoryFilters,
	limit: number,
	offset: number,
	logger: KADLogger,
): Promise<CategoryDBRead[]> {
	logger.info(`Fetching categories`);
	// return await db.select().from(categories).where(buildCategoryWhere(filters)).limit(limit).offset(offset);
	return await db.query.categories.findMany({
		where: {
			deletedAt: { isNull: true },
		},
		limit,
		offset,
	});
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
