'use server';
import { env } from 'cloudflare:workers';
import { requestInfo } from 'rwsdk/worker';
import type { ActionState, Category, GeneratedCategory } from '@/types';
import { errorResponse, successResponse } from './utils';

const prompt = `I have a jeopardy-style game and a user is requesting a new category.  Can you provide a category title and five increasingly-difficult "answers" for which the contestants will have to provide the "question" in traditional Jeopardy style. Can you return the data in JSON with the top-level thing being a category object like this with clues as an array? Return it without the pretty-printed formatting and please make sure to return the full JSON so I can parse it. Also please double-check the accuracy to avoid hallucinations.

{ 
	"title": "Animal Kingdom",
	"clues": [
		{
			"clue": "This is the only mammal capable of true flight.",
			"response": "What is a bat?"
		}
	]
}
`;

export async function generateCategory(): Promise<ActionState<GeneratedCategory>> {
	try {
		requestInfo.ctx.logger.info(`Initializing category generation`);

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
		requestInfo.ctx.logger.error(`Unexpected error: ${err}`);
		return errorResponse(err);
	}
}

export async function saveCategory(category: GeneratedCategory): Promise<ActionState<Category>> {
	try {
		requestInfo.ctx.logger.info(`Received category to be saved: ${JSON.stringify(category)}`);

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
		requestInfo.ctx.logger.error(`Unexpected error: ${err}`);
		return errorResponse(err);
	}
}
