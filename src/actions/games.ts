'use server';
import { env } from 'cloudflare:workers';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { getGameById, saveGameContestants, saveGameStageCategories, updateGame } from '@/repositories';
import { gamesSchemas } from '@/schemas';
import { saveGameStages, saveGame as saveGameStep } from '@/steps';
import type {
	ActionState,
	ContestantRegistration,
	DisplayRegistration,
	GameDBRead,
	GameFormInput,
	GameWithEverything,
} from '@/types';
import { errorResponse, successResponse } from './utils';

export const saveGame = serverAction([requireAuthentication, requirePermissions('games:create', 'games:update'), _saveGame]);
export const startGame = serverAction([requireAuthentication, requirePermissions('games:host', 'games:update'), _startGame]);
export const openRegistration = serverAction([requireAuthentication, requirePermissions('games:update'), _openRegistration]);

export async function _saveGame(game: GameFormInput): Promise<ActionState<GameWithEverything>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const parsed = gamesSchemas.form.safeParse(game);
	if (parsed.error) {
		return errorResponse<GameWithEverything>(parsed.error.flatten().fieldErrors, 400);
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

type GameRegisterState = {
	gameId: string;
	displaySessionId: string;
	contestants: ContestantRegistration[];
};

export async function _startGame(registerState: GameRegisterState): Promise<ActionState<GameDBRead>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const { gameId } = registerState;

	//   _____  _     _                    _______  ______  _____  _______      ______   _____
	//  |_____] |     | |      |           |______ |_____/ |     | |  |  |      |     \ |     |
	//  |       |_____| |_____ |_____      |       |    \_ |_____| |  |  |      |_____/ |_____|
	//
	// get latest from DO
	const syncDOStateStub = env.GAME_STATE_SYNC_DURABLE_OBJECT.getByName(gameId);
	const syncState = {
		contestants: (await syncDOStateStub.getState(`game:${gameId}:contestants`)) as ContestantRegistration[] | undefined,
		display: (await syncDOStateStub.getState(`game:${gameId}:display`)) as DisplayRegistration,
		host: await syncDOStateStub.getState(`game:${gameId}:host`),
	};

	//  _    _ _______        _____ ______  _______ _______ _______      _     _  _____  _______ _______ . _______      _______ _______ _______ _______ _______
	//   \  /  |_____| |        |   |     \ |_____|    |    |______      |_____| |     | |______    |    ' |______      |______    |    |_____|    |    |______
	//    \/   |     | |_____ __|__ |_____/ |     |    |    |______      |     | |_____| ______|    |      ______|      ______|    |    |     |    |    |______
	//
	// validate that the host's state they sent in is good
	const parsed = gamesSchemas.register.safeParse(registerState);
	requestInfo.ctx.logger.info(`Received game to be started: ${JSON.stringify(parsed.data)}`);
	if (parsed.error) {
		return errorResponse<GameDBRead>(parsed.error.flatten().fieldErrors, 400);
	}
	const parsedGame = parsed.data;

	//  _______ _______ _______ _______ _______      _______ _____ _______ _______ _______ _______ _______ _     _      _______ _     _ _______ _______ _     _
	//  |______    |    |_____|    |    |______      |  |  |   |   |______ |  |  | |_____|    |    |       |_____|      |       |_____| |______ |       |____/
	//  ______|    |    |     |    |    |______      |  |  | __|__ ______| |  |  | |     |    |    |_____  |     |      |_____  |     | |______ |_____  |    \_
	//
	// check host vs DO to make sure they match
	if (!syncState.display || parsedGame.displaySessionId !== syncState.display.sessionId) {
		return errorResponse<GameDBRead>(
			`Display device mismatch: your view does not match the current game state. Please refresh and try again.`,
		);
	}

	const syncContestantIds = new Set((syncState.contestants ?? []).map(c => c.sessionId));
	const submittedContestantIds = new Set(parsedGame.contestants.map(c => c.sessionId));
	const contestantsMismatch =
		syncContestantIds.size !== submittedContestantIds.size || [...submittedContestantIds].some(id => !syncContestantIds.has(id));

	if (contestantsMismatch) {
		return errorResponse<GameDBRead>(
			`Contestant list mismatch: your view does not match the current game state. Please refresh and try again.`,
		);
	}

	//  _______ _______ _    _ _______      ______   _____       _______  _____       ______
	//  |______ |_____|  \  /  |______      |     \ |     |         |    |     |      |     \
	//  ______| |     |   \/   |______      |_____/ |_____|         |    |_____|      |_____/
	//
	// now that we're happy with the DO state we can save to D1
	await saveGameContestants(parsedGame.gameId, parsedGame.contestants, userId, ctx.logger);
	await updateGame(
		parsedGame.gameId,
		{
			displaySessionId: syncState.display.sessionId,
			hostUserId: userId,
		},
		userId,
		ctx.logger,
	);

	//  _____ _______       _____         _______ __   __ _______ ______         _______
	//    |   |______      |_____] |      |_____|   \_/   |_____| |_____] |      |______
	//  __|__ ______|      |       |_____ |     |    |    |     | |_____] |_____ |______
	//
	// make sure the game is actually playable after all that
	const savedGame = await getGameById(parsedGame.gameId, ctx.logger);
	const validationResults = gamesSchemas.isRegisterable.safeParse(savedGame);

	if (validationResults.error) {
		return errorResponse<GameDBRead>(validationResults.error.flatten());
	}

	//  _______ _______ _______  ______ _______      _______ _     _ _______       ______ _______ _______ _______
	//  |______    |    |_____| |_____/    |            |    |_____| |______      |  ____ |_____| |  |  | |______
	//  ______|    |    |     | |    \_    |            |    |     | |______      |_____| |     | |  |  | |______
	//
	const initialActiveContestant = parsedGame.contestants[Math.floor(Math.random() * parsedGame.contestants.length)];
	await updateGame(
		parsedGame.gameId,
		{
			phase: 'PLAY',
			activeContestantSessionId: initialActiveContestant.sessionId,
		},
		userId,
		ctx.logger,
	);

	await syncDOStateStub.setState(initialActiveContestant.sessionId, `game:${gameId}:activeContestantSessionId`);
	await syncDOStateStub.setState('PLAY', `game:${gameId}:gamePhase`);

	const startedGame = await getGameById(gameId, ctx.logger);

	return successResponse<GameDBRead>(startedGame);
}

type GameSetupState = {
	gameId: string;
};

export async function _openRegistration(setupState: GameSetupState): Promise<ActionState<GameDBRead>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const { gameId } = setupState;
	const syncDOStateStub = env.GAME_STATE_SYNC_DURABLE_OBJECT.getByName(gameId);

	const gameFromD1 = await getGameById(gameId, ctx.logger);

	const validationResults = gamesSchemas.isRegisterable.safeParse(gameFromD1);

	if (validationResults.error) {
		return errorResponse<GameWithEverything>(validationResults.error.flatten());
	}

	await updateGame(
		gameId,
		{
			phase: 'REGISTER',
		},
		userId,
		ctx.logger,
	);

	await syncDOStateStub.setState('REGISTER', `game:${gameId}:gamePhase`);

	const updatedGame = await getGameById(gameId, ctx.logger);

	return successResponse<GameDBRead>(updatedGame);
}
