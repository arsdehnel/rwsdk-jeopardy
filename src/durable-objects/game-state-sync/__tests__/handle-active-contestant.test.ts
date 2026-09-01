import { beforeEach, describe, expect, it, vi } from 'vitest';

// NOTE: These tests WILL FAIL until handle-active-contestant.ts is fully implemented.

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateGame, mockGetGameById } = vi.hoisted(() => ({
	mockUpdateGame: vi.fn().mockResolvedValue({}),
	mockGetGameById: vi.fn(),
}));

vi.mock('@/repositories', () => ({
	updateGame: mockUpdateGame,
	getGameById: mockGetGameById,
}));

import handleActiveContestant from '../handle-active-contestant';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleActiveContestant.set', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls updateGame with activeContestantSessionId set to the session ID string', async () => {
		const logger = createSpyLogger();

		await handleActiveContestant.set(gameId, '05a2a193-343e-498a-b725-7b832296424a', logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(
			gameId,
			{ activeContestantSessionId: '05a2a193-343e-498a-b725-7b832296424a' },
			SYSTEM_ID,
			logger,
		);
	});

	it('Logs an error if the incoming session ID is a string but not a valid UUID', async () => {
		const logger = createSpyLogger();

		await handleActiveContestant.set(gameId, 'session-abc', logger);

		expect(logger.error).toHaveBeenCalled();
	});

	it('calls updateGame with activeContestantSessionId set to null when value is null', async () => {
		const logger = createSpyLogger();

		await handleActiveContestant.set(gameId, null, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { activeContestantSessionId: null }, SYSTEM_ID, logger);
	});

	it('calls updateGame with activeContestantSessionId set to null when value is undefined', async () => {
		const logger = createSpyLogger();

		await handleActiveContestant.set(gameId, undefined, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { activeContestantSessionId: null }, SYSTEM_ID, logger);
	});

	it('logs an error and does not call updateGame when value is a non-string non-falsy value', async () => {
		const logger = createSpyLogger();

		await handleActiveContestant.set(gameId, { not: 'a-string' }, logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateGame).not.toHaveBeenCalled();
	});
});

describe('handleActiveContestant.get', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls getGameById with the correct gameId and logger', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ activeContestantSessionId: null });

		await handleActiveContestant.get(gameId, logger);

		expect(mockGetGameById).toHaveBeenCalledWith(gameId, logger);
	});

	it('returns the activeContestantSessionId from the game', async () => {
		const logger = createSpyLogger();
		const sessionId = '05a2a193-343e-498a-b725-7b832296424a';
		mockGetGameById.mockResolvedValue({ activeContestantSessionId: sessionId });

		const result = await handleActiveContestant.get(gameId, logger);

		expect(result).toBe(sessionId);
	});

	it('returns null when activeContestantSessionId is null', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ activeContestantSessionId: null });

		const result = await handleActiveContestant.get(gameId, logger);

		expect(result).toBeNull();
	});
});
