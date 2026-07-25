'use server';
import { env } from 'cloudflare:workers';
import type { ActionState, GeneratedCategory } from '@/types';
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
		console.log(`Initializing category generation`);

		const { response, usage } = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2-lora', {
			prompt,
			max_tokens: 1024,
		});

		console.log(`Raw data: ${JSON.stringify({ response, usage }, null, 4)}`);

		if (!response) {
			console.log(`Model call didn't include a response`);
			return errorResponse(`Model call didn't include a response`);
		}

		try {
			const parsedResponse = JSON.parse(response);
			console.log(`Parsed and responding with result`);
			return successResponse(parsedResponse);
		} catch (err) {
			console.log(`Failure to parse: ${err}`);
			return errorResponse(err);
		}
	} catch (err) {
		console.log(`Unexpected error: ${err}`);
		return errorResponse(err);
	}
}
