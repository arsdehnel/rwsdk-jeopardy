'use server';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { createGame, createGameStage, createGameStageCategory, getGameById } from '@/repositories';
import { gamesSchemas } from '@/schemas';
import type { ActionState, GameFormInput, GameWithEverything } from '@/types';
import { errorResponse, successResponse } from './utils';

export const saveGame = serverAction([requireAuthentication, requirePermissions('games:create', 'games:update'), _saveGame]);

export async function _saveGame(game: GameFormInput): Promise<ActionState<GameWithEverything>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const parsed = gamesSchemas.form.safeParse(game);
	if (parsed.error) {
		return errorResponse<GameWithEverything>(parsed.error.flatten().fieldErrors, 400);
	}
	if (!parsed.data) {
		return errorResponse<GameWithEverything>(`Game could not be validated properly`);
	}
	const parsedGame = parsed.data;

	try {
		requestInfo.ctx.logger.info(`Received game to be saved: ${JSON.stringify(game)}`);

		const savedGame = await createGame(parsedGame, userId, ctx.logger);
		const singleJeopardyStage = await createGameStage({ stage: parsedGame.stage ?? 'SINGLE' }, savedGame.id, userId, ctx.logger);
		await Promise.all(
			parsedGame.categories.map(async (categoryId: string, idx: number) => {
				return await createGameStageCategory({ categoryId, position: idx }, singleJeopardyStage.id, userId, ctx.logger);
			}),
		);
		const savedGameWithEverything = await getGameById(savedGame.id, ctx.logger);

		return successResponse<GameWithEverything>(savedGameWithEverything);
	} catch (err) {
		requestInfo.ctx.logger.error(`Unexpected error: ${err}`);
		return errorResponse(err);
	}
}
