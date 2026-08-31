import { beforeEach, describe, expect, it, vi } from 'vitest';

// NOTE: These tests WILL FAIL until handle-scores.ts is fully implemented.

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateContestantScores } = vi.hoisted(() => ({
	mockUpdateContestantScores: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/repositories', () => ({
	updateContestantScores: mockUpdateContestantScores,
}));

import handleScores from '../handle-scores';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleScores.set', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls updateContestantScores with a Record<string, number> containing entries', async () => {
		const logger = createSpyLogger();
		const scores: Record<string, number> = { 'session-1': 200, 'session-2': 400 };

		await handleScores.set(gameId, scores, logger);

		expect(mockUpdateContestantScores).toHaveBeenCalledWith(gameId, scores, SYSTEM_ID, logger);
	});

	it('calls updateContestantScores with an empty scores object', async () => {
		const logger = createSpyLogger();

		await handleScores.set(gameId, {}, logger);

		expect(mockUpdateContestantScores).toHaveBeenCalledWith(gameId, {}, SYSTEM_ID, logger);
	});

	it('calls logger.error and does not call updateContestantScores for a string value', async () => {
		const logger = createSpyLogger();

		await handleScores.set(gameId, 'not-an-object', logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateContestantScores).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call updateContestantScores for an array value', async () => {
		const logger = createSpyLogger();

		await handleScores.set(gameId, [100, 200], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateContestantScores).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call updateContestantScores for null', async () => {
		const logger = createSpyLogger();

		await handleScores.set(gameId, null, logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateContestantScores).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call updateContestantScores for an object with non-number values', async () => {
		const logger = createSpyLogger();

		await handleScores.set(gameId, { 'session-1': 'not-a-number' }, logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateContestantScores).not.toHaveBeenCalled();
	});
});
