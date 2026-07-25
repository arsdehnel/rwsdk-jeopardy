'use server';
import type { ActionState, Category, GeneratedCategory } from '@/types';
import { errorResponse, successResponse } from './utils';

export async function saveCategory(category: GeneratedCategory): Promise<ActionState<Category>> {
	try {
		console.log(`Received category to be saved: ${JSON.stringify(category)}`);

		const savedCategory = {
			id: crypto.randomUUID(),
			...category,
			clues: category.clues.map((c, idx) => {
				return {
					id: crypto.randomUUID(),
					value: (idx + 1) * 100,
					...c,
				};
			}),
		};
		return successResponse<Category>(savedCategory);
	} catch (err) {
		console.log(`Unexpected error: ${err}`);
		return errorResponse(err);
	}
}
