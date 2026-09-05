'use server';
import { env } from 'cloudflare:workers';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { createClue, getCategoryById, getClueById, getCluesByCategoryId, updateClue } from '@/repositories';
import { cluesSchemas } from '@/schemas';
import type { ActionState, ClueDBRead, ClueFormInput, ReplacedClue } from '@/types';
import { errorResponse, extractJson, successResponse } from './utils';

type Message = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

function getMessages(clueText: string, expectedResponse: string): Message[] {
	return [
		{
			role: 'system',
			content:
				'You are a JSON API. You only ever respond with raw JSON — no markdown, no explanation, no code fences. Never include any text before or after the JSON object.',
		},
		{
			role: 'user',
			content: `Find 1–3 URLs that are relevant to verifying this Jeopardy clue and expected response. A human will review them.

Clue: ${clueText}
Expected response: ${expectedResponse}

Return only this JSON structure:
{"referenceUrls":["url1","url2"]}`,
		},
	];
}

export const replaceClue = serverAction([requireAuthentication, requirePermissions('clues:admin'), _replaceClue]);
export const researchClue = serverAction([requireAuthentication, requirePermissions('clues:research'), _researchClue]);
export const saveClue = serverAction([requireAuthentication, requirePermissions('clues:admin'), _saveClue]);

/**
 * @private - exported for testing only, do not use directly
 */
export async function _saveClue(formData: ClueFormInput): Promise<ActionState<ClueDBRead>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	requestInfo.ctx.logger.debug('Clue form data received', { id: formData.id });

	try {
		const parsed = cluesSchemas.form.safeParse(formData);
		if (!parsed.success) {
			return errorResponse<ClueDBRead>(parsed.error.flatten().fieldErrors, 400);
		}
		if (parsed.data.id) {
			const updatedClue = await updateClue(parsed.data.id, parsed.data, userId, requestInfo.ctx.logger);
			return successResponse<ClueDBRead>(updatedClue);
		}
		const createdClue = await createClue(parsed.data, userId, requestInfo.ctx.logger);
		return successResponse<ClueDBRead>(createdClue);
	} catch (error) {
		requestInfo.ctx.logger.error('Failed to save clue', { error });
		return errorResponse<ClueDBRead>(error, 500, 'Failed to save clue');
	}
}

/**
 * @private - exported for testing only, do not use directly
 */
export async function _replaceClue(clueId: string): Promise<ActionState<ReplacedClue>> {
	const { ctx } = requestInfo;

	const target = await getClueById(clueId, ctx.logger);
	const [category, siblings] = await Promise.all([
		getCategoryById(target.categoryId, ctx.logger),
		getCluesByCategoryId(target.categoryId, ctx.logger),
	]);

	const clueList = siblings
		.map(c =>
			c.id === clueId
				? `- [REPLACE THIS] Clue: "${c.text}" / Response: "${c.response}"`
				: `- Clue: "${c.text}" / Response: "${c.response}"`,
		)
		.join('\n');

	const messages: Message[] = [
		{
			role: 'system',
			content:
				'You are a JSON API. You only ever respond with raw JSON — no markdown, no explanation, no code fences. Never include any text before or after the JSON object.',
		},
		{
			role: 'user',
			content: `You are writing clues for a Jeopardy category. The category is "${category.name}".

Here are all the existing clues in this category:
${clueList}

The clue marked [REPLACE THIS] needs to be replaced because it is too similar to one or more of the other clues (e.g. same answer, same topic angle, or near-duplicate phrasing).

Write a new clue for this category that:
- Has a different answer than every other clue listed above
- Approaches a different aspect or subtopic of "${category.name}"
- Matches the style and difficulty of a typical Jeopardy clue
- Is written in the form of a statement (not a question), as Jeopardy clues are

Return only this JSON structure:
{"text":"<clue text>","response":"<expected response>"}`,
		},
	];

	const { response, usage } = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2-lora', {
		messages,
		max_tokens: 256,
	});

	ctx.logger.info(`Raw replaceClue response: ${JSON.stringify({ response, usage }, null, 4)}`);

	if (!response) {
		return errorResponse<ReplacedClue>(`Model call didn't include a response`);
	}

	try {
		const parsed = typeof response === 'string' ? JSON.parse(extractJson(response)) : response;
		const text: string = parsed?.text ?? '';
		const reply: string = parsed?.response ?? '';
		if (!text || !reply) {
			return errorResponse<ReplacedClue>(`Model response missing text or response fields: ${JSON.stringify(parsed)}`);
		}
		return successResponse<ReplacedClue>({ text, response: reply });
	} catch (err) {
		ctx.logger.error(`Failure to parse replaceClue model response: ${err}`);
		return errorResponse<ReplacedClue>(err);
	}
}

/**
 * @private - exported for testing only, do not use directly
 */
export async function _researchClue(clueId: string): Promise<ActionState<string[]>> {
	const { ctx } = requestInfo;

	const clue = await getClueById(clueId, ctx.logger);

	const messages = getMessages(clue.text, clue.response);
	const { response, usage } = await env.AI.run('@cf/mistral/mistral-7b-instruct-v0.2-lora', {
		messages,
		max_tokens: 512,
	});

	requestInfo.ctx.logger.info(`Raw data: ${JSON.stringify({ response, usage }, null, 4)}`);

	if (!response) {
		return errorResponse<string[]>(`Model call didn't include a response`);
	}

	try {
		const parsed = typeof response === 'string' ? JSON.parse(extractJson(response)) : response;
		const urls: string[] = (parsed?.referenceUrls ?? []).map((url: string) => url.replace(/^<|>$/g, ''));
		requestInfo.ctx.logger.info(`Returning ${urls.length} reference URLs`);
		return successResponse<string[]>(urls);
	} catch (err) {
		requestInfo.ctx.logger.error(`Failure to parse model response: ${err}`);
		return errorResponse<string[]>(err);
	}
}
