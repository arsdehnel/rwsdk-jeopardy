'use server';
import { env } from 'cloudflare:workers';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication } from '@/interrupters';
import { createCategory, createClue, getCategories } from '@/repositories';
import type { ActionState, CategoryWithClues, GeneratedCategory } from '@/types';
import { errorResponse, successResponse } from './utils';

function getPrompt(existingCategoryNames: string[]): string {
	return `I have a jeopardy-style game and a user is requesting a new category. Some details for the request:
	
1. Can you provide a category title and five increasingly-difficult "answers" for which the contestants will have to provide the "question" in traditional Jeopardy style. 
2. Can you return the data in JSON with the top-level thing being a category object like this with clues as an array? 
3. Return it without the pretty-printed formatting and please make sure to return the full JSON and _only_ the JSON so I can parse it. 
4. Also please double-check the accuracy to avoid hallucinations.
5. We have existing categories named ${existingCategoryNames.join(',')} so please avoid those topics.
6. Please avoid any extra messages about the fact that you've double-checked the answers or anything.  JUST THE JSON PLEASE.

{ 
	"name": "Animal Kingdom",
	"clues": [
		{
			"text": "This is the only mammal capable of true flight.",
			"response": "What is a bat?"
		}
	]
}
`;
}

export const generateCategory = serverAction([requireAuthentication, _generateCategory]);
export const saveCategory = serverAction([requireAuthentication, _saveCategory]);

export async function _generateCategory(): Promise<ActionState<GeneratedCategory>> {
	try {
		requestInfo.ctx.logger.info(`Initializing category generation`);

		const existingCategories = await getCategories({}, 100, 0, requestInfo.ctx.logger);

		const prompt = getPrompt(existingCategories.map(c => c.name));

		const { response, usage } = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2-lora', {
			prompt,
			max_tokens: 1024,
		});

		requestInfo.ctx.logger.info(`Raw data: ${JSON.stringify({ response, usage }, null, 4)}`);

		if (!response) {
			requestInfo.ctx.logger.info(`Model call didn't include a response`);
			return errorResponse(`Model call didn't include a response`);
		}

		try {
			const parsedResponse = JSON.parse(response);
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
