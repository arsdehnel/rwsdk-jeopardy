'use server';
import { env } from 'cloudflare:workers';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { getGameById, saveGameContestants, saveGameStageCategories, updateGame } from '@/repositories';
import { gamesSchemas } from '@/schemas';
import { saveGameStages, saveGame as saveGameStep } from '@/steps';
import type { ActionState, Contestant, GameDBRead, GameFormInput, GameWithEverything } from '@/types';
import { errorResponse, successResponse } from './utils';

export const saveGame = serverAction([requireAuthentication, requirePermissions('games:create', 'games:update'), _saveGame]);
export const startGame = serverAction([requireAuthentication, requirePermissions('games:host', 'games:update'), _startGame]);

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

		const savedGame = await saveGameStep({ ownerId: userId, currentStage: 'SINGLE', ...parsedGame }, userId, ctx.logger);
		const savedStages = await saveGameStages(savedGame.id, parsedGame.stages, userId, ctx.logger);
		for (const stage of savedStages) {
			const parsedStage = parsedGame.stages.find(s => s.stage === stage.stage);
			if (!parsedStage) {
				throw new Error(`Stage ${stage.stage} not found in parsed game stages`);
			}
			await saveGameStageCategories(stage.id, parsedStage.categories, userId, ctx.logger);
		}
		const savedGameWithEverything = await getGameById(savedGame.id, ctx.logger);

		return successResponse<GameWithEverything>(savedGameWithEverything);
	} catch (err) {
		requestInfo.ctx.logger.error('Unexpected error', { err: err instanceof Error ? err : new Error(String(err)) });
		return errorResponse(err);
	}
}

type GameRegistrationState = {
	gameId: string;
	displaySessionId: string;
	contestants: Contestant[];
};

export async function _startGame(registrationState: GameRegistrationState): Promise<ActionState<GameDBRead>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const syncDOStateStub = env.GAME_STATE_SYNC_DURABLE_OBJECT.getByName(registrationState.gameId);
	const syncState = {
		contestants: await syncDOStateStub.getState('contestants'),
		display: await syncDOStateStub.getState('display'),
		host: await syncDOStateStub.getState('host'),
	};

	// syncState[Symbol.dispose]();

	const parsed = gamesSchemas.registration.safeParse(registrationState);
	requestInfo.ctx.logger.info(`Received game to be started: ${JSON.stringify(parsed.data)}`);
	if (parsed.error) {
		return errorResponse<GameDBRead>(parsed.error.flatten().fieldErrors, 400);
	}
	if (!parsed.data) {
		return errorResponse<GameDBRead>(`Game registration not be validated properly`);
	}
	const parsedGame = parsed.data;

	await saveGameContestants(parsedGame.gameId, parsedGame.contestants, userId, ctx.logger);

	await updateGame(
		parsedGame.gameId,
		{ phase: 'PLAYING', displaySessionId: syncState.display, hostUserId: userId },
		userId,
		ctx.logger,
	);

	await syncDOStateStub.setState('PLAYING', 'gamePhase');

	const updatedGame = await getGameById(registrationState.gameId, ctx.logger);

	return successResponse<GameDBRead>(updatedGame);
}
