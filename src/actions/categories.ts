'use server';
import { env } from 'cloudflare:workers';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { createCategory, createClue, getCategories } from '@/repositories';
import type { ActionState, CategoryWithClues, GeneratedCategory } from '@/types';
import { errorResponse, extractJson, successResponse } from './utils';

type Message = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

function getMessages(existingCategoryNames: string[]): Message[] {
	return [
		{
			role: 'system',
			content:
				'You are a JSON API. You only ever respond with raw JSON — no markdown, no explanation, no code fences. Never include any text before or after the JSON object.',
		},
		{
			role: 'user',
			content: `Generate a new Jeopardy category with 5 clues of increasing difficulty. Avoid these existing category topics: ${existingCategoryNames.join(', ')}.

Return only this JSON structure:
{"name":"Category Name","clues":[{"text":"Clue text","response":"What is the answer?"}]}

All 5 clues must be included. Verify accuracy before responding. Return only the JSON object, no other text.`,
		},
	];
}

export const generateCategory = serverAction([
	requireAuthentication,
	requirePermissions('categories:generate'),
	_generateCategory,
]);
export const saveCategory = serverAction([requireAuthentication, requirePermissions('categories:update'), _saveCategory]);

export async function _generateCategory(): Promise<ActionState<GeneratedCategory>> {
	try {
		requestInfo.ctx.logger.info(`Initializing category generation`);

		const existingCategories = await getCategories(requestInfo.ctx.logger);

		const messages = getMessages(existingCategories.map(c => c.name));

		const { response, usage } = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2-lora', {
			messages,
			max_tokens: 1024,
		});

		requestInfo.ctx.logger.info(`Raw data: ${JSON.stringify({ response, usage }, null, 4)}`);

		if (!response) {
			requestInfo.ctx.logger.info(`Model call didn't include a response`);
			return errorResponse(`Model call didn't include a response`);
		}

		try {
			const parsedResponse = typeof response === 'string' ? JSON.parse(extractJson(response)) : response;
			requestInfo.ctx.logger.info(`Parsed and responding with result`);
			return successResponse(parsedResponse);
		} catch (err) {
			requestInfo.ctx.logger.error(`Failure to parse: ${err}`);
			return errorResponse(err);
		}
	} catch (err) {
		requestInfo.ctx.logger.error(`Unexpected error: ${err}${err instanceof Error && err.cause ? ` | cause: ${err.cause}` : ''}`);
		return errorResponse(err);
	}
}

export async function _saveCategory(category: GeneratedCategory): Promise<ActionState<CategoryWithClues>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	try {
		requestInfo.ctx.logger.info(`Received category to be saved: ${JSON.stringify(category)}`);

		const savedCategory = await createCategory(category, userId, ctx.logger);

		const savedClues = await Promise.all(
			category.clues.map(async clue => await createClue({ categoryId: savedCategory.id, ...clue }, userId, ctx.logger)),
		);

		const fullCategory: CategoryWithClues = {
			...savedCategory,
			clues: savedClues,
		};

		return successResponse<CategoryWithClues>(fullCategory);
	} catch (err) {
		requestInfo.ctx.logger.error(`Unexpected error: ${err}${err instanceof Error && err.cause ? ` | cause: ${err.cause}` : ''}`);
		return errorResponse(err);
	}
}
