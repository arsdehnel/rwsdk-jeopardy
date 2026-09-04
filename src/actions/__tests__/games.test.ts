import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetState, mockSetState, mockEnv } = vi.hoisted(() => {
	const mockGetState = vi.fn();
	const mockSetState = vi.fn();
	const mockDoStub = { getState: mockGetState, setState: mockSetState };
	const mockEnv = {
		GAME_STATE_SYNC_DURABLE_OBJECT: {
			getByName: vi.fn().mockReturnValue(mockDoStub),
		},
	};
	return { mockGetState, mockSetState, mockEnv };
});

vi.mock('cloudflare:workers', () => ({ env: mockEnv }));

vi.mock('@/repositories', () => ({
	getGameById: vi.fn(),
	saveGameContestants: vi.fn(),
	updateGame: vi.fn(),
	saveGameStageCategories: vi.fn(),
}));

vi.mock('@/steps', () => ({
	saveGameStages: vi.fn(),
	saveGame: vi.fn(),
}));

vi.mock('rwsdk/worker', () => ({
	get requestInfo() {
		return mockRequestInfo;
	},
	serverAction: vi.fn((fns: unknown[]) => fns[fns.length - 1]),
}));

import { createNoopLogger } from '@/logger';

const mockRequestInfo = {
	ctx: {
		user: { id: 'host-user-id' },
		logger: createNoopLogger(),
		session: null,
		permissions: [],
	},
};

import { getGameById, saveGameContestants, saveGameStageCategories, updateGame } from '@/repositories';
import { saveGameStages, saveGame as saveGameStep } from '@/steps';
import { _openRegistration, _saveGame, _startGame } from '../games';

const GAME_ID = crypto.randomUUID();
const DISPLAY_SESSION_ID = crypto.randomUUID();
const SESSION_A = crypto.randomUUID();
const SESSION_B = crypto.randomUUID();
const SESSION_C = crypto.randomUUID();

const contestants = [
	{ sessionId: SESSION_A, name: 'Alice' },
	{ sessionId: SESSION_B, name: 'Bob' },
	{ sessionId: SESSION_C, name: 'Carol' },
];

const validRegisterState = {
	gameId: GAME_ID,
	displaySessionId: DISPLAY_SESSION_ID,
	contestants,
};

const mockUpdatedGame = {
	id: GAME_ID,
	phase: 'PLAY' as const,
	stages: [{ stage: 'SINGLE' as const, categories: Array.from({ length: 6 }, () => ({})) }],
};

const CATEGORY_ID = crypto.randomUUID();
const STAGE_ID = crypto.randomUUID();
const validFormInput = {
	stages: [
		{
			stage: 'SINGLE' as const,
			categories: [CATEGORY_ID],
		},
	],
};
const mockSavedGame = { id: GAME_ID };
const mockSavedStage = { id: STAGE_ID, stage: 'SINGLE' as const };

describe('_saveGame', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(saveGameStep).mockResolvedValue(mockSavedGame as never);
		vi.mocked(saveGameStages).mockResolvedValue([mockSavedStage] as never);
		vi.mocked(saveGameStageCategories).mockResolvedValue(undefined as never);
		vi.mocked(getGameById).mockResolvedValue(mockUpdatedGame as never);
	});

	describe('schema validation', () => {
		it('returns a validation error when stages is empty', async () => {
			const result = await _saveGame({ stages: [] });

			expect(result.success).toBe(false);
			expect(saveGameStep).not.toHaveBeenCalled();
		});
	});

	describe('success', () => {
		it('returns the saved game on success', async () => {
			const result = await _saveGame(validFormInput);

			expect(result.success).toBe(true);
			expect(result.data).toBe(mockUpdatedGame);
		});

		it('calls saveGameStep with ownerId and currentStage', async () => {
			await _saveGame(validFormInput);

			expect(saveGameStep).toHaveBeenCalledWith(
				expect.objectContaining({ currentStage: 'SINGLE', ownerId: 'host-user-id' }),
				'host-user-id',
				expect.anything(),
			);
		});

		it('calls saveGameStageCategories for each saved stage', async () => {
			await _saveGame(validFormInput);

			expect(saveGameStageCategories).toHaveBeenCalledWith(STAGE_ID, [CATEGORY_ID], 'host-user-id', expect.anything());
		});
	});

	describe('error handling', () => {
		it('returns an error response when saveGameStep throws an Error', async () => {
			vi.mocked(saveGameStep).mockRejectedValue(new Error('DB error'));

			const result = await _saveGame(validFormInput);

			expect(result.success).toBe(false);
		});

		it('returns an error when saveGameStages returns a stage not in the form input', async () => {
			vi.mocked(saveGameStages).mockResolvedValue([{ id: STAGE_ID, stage: 'DOUBLE' }] as never);

			const result = await _saveGame(validFormInput);

			expect(result.success).toBe(false);
		});

		it('returns an error response when saveGameStep throws a non-Error', async () => {
			vi.mocked(saveGameStep).mockRejectedValue('string error');

			const result = await _saveGame(validFormInput);

			expect(result.success).toBe(false);
		});

		it('includes nested Error causes in the error message', async () => {
			const cause = new Error('root cause');
			const error = new Error('outer error');
			error.cause = cause;
			vi.mocked(saveGameStep).mockRejectedValue(error);

			const result = await _saveGame(validFormInput);

			expect(result.success).toBe(false);
		});

		it('includes a non-Error cause in the error message', async () => {
			const error = new Error('outer error');
			error.cause = 'string cause';
			vi.mocked(saveGameStep).mockRejectedValue(error);

			const result = await _saveGame(validFormInput);

			expect(result.success).toBe(false);
		});
	});
});

describe('_startGame', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockGetState.mockImplementation((key: string) => {
			if (key.endsWith(':contestants')) return contestants;
			if (key.endsWith(':display')) return { sessionId: DISPLAY_SESSION_ID };
			return undefined;
		});
		vi.mocked(saveGameContestants).mockResolvedValue(undefined as never);
		vi.mocked(updateGame).mockResolvedValue(mockUpdatedGame as never);
		vi.mocked(getGameById).mockResolvedValue(mockUpdatedGame as never);
	});

	describe('activeContestantSessionId', () => {
		it('sets activeContestantSessionId in the DO when starting the game', async () => {
			await _startGame(validRegisterState);

			const activeContestantCall = (mockSetState.mock.calls as [unknown, string][]).find(([, key]) =>
				key.endsWith(':activeContestantSessionId'),
			);
			expect(activeContestantCall).toBeDefined();
		});

		it('sets activeContestantSessionId to one of the registered contestants', async () => {
			await _startGame(validRegisterState);

			const activeContestantCall = (mockSetState.mock.calls as [unknown, string][]).find(([, key]) =>
				key.endsWith(':activeContestantSessionId'),
			);
			const [sessionId] = activeContestantCall as [string, string];
			expect([SESSION_A, SESSION_B, SESSION_C]).toContain(sessionId);
		});

		it('includes activeContestantSessionId in the D1 updateGame call', async () => {
			await _startGame(validRegisterState);

			const [, payload] = vi.mocked(updateGame).mock.calls[1];
			expect([SESSION_A, SESSION_B, SESSION_C]).toContain(payload.activeContestantSessionId);
		});

		it('writes the same session ID to D1 and the DO', async () => {
			await _startGame(validRegisterState);

			const activeContestantCall = (mockSetState.mock.calls as [unknown, string][]).find(([, key]) =>
				key.endsWith(':activeContestantSessionId'),
			);
			const [doSessionId] = activeContestantCall as [string, string];
			const [, payload] = vi.mocked(updateGame).mock.calls[1];
			expect(doSessionId).toBe(payload.activeContestantSessionId);
		});

		it('sets activeContestantSessionId before gamePhase in the DO', async () => {
			await _startGame(validRegisterState);

			const activeContestantIdx = (mockSetState.mock.calls as [unknown, string][]).findIndex(([, key]) =>
				key.endsWith(':activeContestantSessionId'),
			);
			const gamePhaseIdx = (mockSetState.mock.calls as [unknown, string][]).findIndex(([, key]) => key.endsWith(':gamePhase'));
			expect(activeContestantIdx).toBeGreaterThanOrEqual(0);
			expect(activeContestantIdx).toBeLessThan(gamePhaseIdx);
		});
	});

	describe('gamePhase', () => {
		it('still sets gamePhase to PLAY in the DO', async () => {
			await _startGame(validRegisterState);

			const gamePhaseCall = (mockSetState.mock.calls as [unknown, string][]).find(([, key]) => key.endsWith(':gamePhase'));
			expect(gamePhaseCall?.[0]).toBe('PLAY');
		});

		it('still sets phase: PLAY in D1', async () => {
			await _startGame(validRegisterState);

			const [, payload] = vi.mocked(updateGame).mock.calls[1];
			expect(payload.phase).toBe('PLAY');
		});
	});

	describe('schema validation', () => {
		it('returns a validation error when gameId is not a valid UUID', async () => {
			const result = await _startGame({ ...validRegisterState, gameId: 'not-a-uuid' });

			expect(result.success).toBe(false);
			expect(mockSetState).not.toHaveBeenCalled();
		});

		it('returns a validation error when fewer than 2 contestants are provided', async () => {
			const result = await _startGame({ ...validRegisterState, contestants: [{ sessionId: SESSION_A, name: 'Alice' }] });

			expect(result.success).toBe(false);
			expect(mockSetState).not.toHaveBeenCalled();
		});
	});

	describe('state mismatch guards', () => {
		it('returns an error when the display session does not match the DO', async () => {
			const result = await _startGame({ ...validRegisterState, displaySessionId: crypto.randomUUID() });

			expect(result.success).toBe(false);
			expect(result.errors?._form?.[0]).toContain('Display device mismatch');
			expect(mockSetState).not.toHaveBeenCalled();
		});

		it('returns an error when the DO has no display registration', async () => {
			mockGetState.mockImplementation((key: string) => {
				if (key.endsWith(':contestants')) return contestants;
				return undefined;
			});

			const result = await _startGame(validRegisterState);

			expect(result.success).toBe(false);
			expect(result.errors?._form?.[0]).toContain('Display device mismatch');
			expect(mockSetState).not.toHaveBeenCalled();
		});

		it('returns an error when the contestant list does not match the DO', async () => {
			const result = await _startGame({
				...validRegisterState,
				contestants: [
					{ sessionId: crypto.randomUUID(), name: 'Stranger' },
					{ sessionId: crypto.randomUUID(), name: 'Nobody' },
				],
			});

			expect(result.success).toBe(false);
			expect(result.errors?._form?.[0]).toContain('Contestant list mismatch');
			expect(mockSetState).not.toHaveBeenCalled();
		});

		it('returns an error when contestant count matches but members differ', async () => {
			const result = await _startGame({
				...validRegisterState,
				contestants: [
					{ sessionId: crypto.randomUUID(), name: 'Stranger' },
					{ sessionId: crypto.randomUUID(), name: 'Nobody' },
					{ sessionId: crypto.randomUUID(), name: 'Ghost' },
				],
			});

			expect(result.success).toBe(false);
			expect(result.errors?._form?.[0]).toContain('Contestant list mismatch');
			expect(mockSetState).not.toHaveBeenCalled();
		});

		it('returns an error when the DO has no registered contestants', async () => {
			mockGetState.mockImplementation((key: string) => {
				if (key.endsWith(':display')) return { sessionId: DISPLAY_SESSION_ID };
				return undefined;
			});

			const result = await _startGame(validRegisterState);

			expect(result.success).toBe(false);
			expect(result.errors?._form?.[0]).toContain('Contestant list mismatch');
			expect(mockSetState).not.toHaveBeenCalled();
		});
	});

	describe('isRegisterable validation', () => {
		it('returns an error when the game fetched from D1 does not pass isRegisterable', async () => {
			vi.mocked(getGameById).mockResolvedValueOnce({
				id: GAME_ID,
				stages: [{ stage: 'SINGLE' as const, categories: [{}] }],
			} as never);

			const result = await _startGame(validRegisterState);

			expect(result.success).toBe(false);
			expect(mockSetState).not.toHaveBeenCalled();
		});
	});

	describe('success response', () => {
		it('returns the updated game on success', async () => {
			const result = await _startGame(validRegisterState);

			expect(result.success).toBe(true);
			expect(result.data).toBe(mockUpdatedGame);
		});
	});
});

describe('_openRegistration', () => {
	const validSetupState = { gameId: GAME_ID };

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(getGameById).mockResolvedValue(mockUpdatedGame as never);
		vi.mocked(updateGame).mockResolvedValue(mockUpdatedGame as never);
	});

	describe('isRegisterable validation', () => {
		it('returns an error when the game does not pass isRegisterable', async () => {
			vi.mocked(getGameById).mockResolvedValueOnce({
				id: GAME_ID,
				stages: [{ stage: 'SINGLE' as const, categories: [{}] }],
			} as never);

			const result = await _openRegistration(validSetupState);

			expect(result.success).toBe(false);
		});

		it('does not call updateGame when isRegisterable fails', async () => {
			vi.mocked(getGameById).mockResolvedValueOnce({
				id: GAME_ID,
				stages: [{ stage: 'SINGLE' as const, categories: [{}] }],
			} as never);

			await _openRegistration(validSetupState);

			expect(updateGame).not.toHaveBeenCalled();
		});

		it('does not set DO state when isRegisterable fails', async () => {
			vi.mocked(getGameById).mockResolvedValueOnce({
				id: GAME_ID,
				stages: [{ stage: 'SINGLE' as const, categories: [{}] }],
			} as never);

			await _openRegistration(validSetupState);

			expect(mockSetState).not.toHaveBeenCalled();
		});
	});

	describe('success', () => {
		it('sets phase: REGISTER in D1', async () => {
			await _openRegistration(validSetupState);

			const [, payload] = vi.mocked(updateGame).mock.calls[0];
			expect(payload.phase).toBe('REGISTER');
		});

		it('sets gamePhase to REGISTER in the DO', async () => {
			await _openRegistration(validSetupState);

			const gamePhaseCall = (mockSetState.mock.calls as [unknown, string][]).find(([, key]) => key.endsWith(':gamePhase'));
			expect(gamePhaseCall?.[0]).toBe('REGISTER');
		});

		it('returns the updated game on success', async () => {
			const result = await _openRegistration(validSetupState);

			expect(result.success).toBe(true);
			expect(result.data).toBe(mockUpdatedGame);
		});
	});
});
