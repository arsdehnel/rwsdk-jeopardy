import { beforeEach, describe, expect, it, vi } from 'vitest';

// NOTE: These tests WILL FAIL until handle-active-contestant.ts is fully implemented.

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateGame } = vi.hoisted(() => ({
	mockUpdateGame: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/repositories', () => ({
	updateGame: mockUpdateGame,
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
});
