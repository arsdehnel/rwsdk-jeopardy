import { beforeEach, describe, expect, it, vi } from 'vitest';

// NOTE: These tests WILL FAIL until handle-scores.ts is fully implemented.

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateContestantScores, mockGetGameById } = vi.hoisted(() => ({
	mockUpdateContestantScores: vi.fn().mockResolvedValue(undefined),
	mockGetGameById: vi.fn(),
}));

vi.mock('@/repositories', () => ({
	updateContestantScores: mockUpdateContestantScores,
	getGameById: mockGetGameById,
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

// NOTE: the tests below that exercise contestants with non-null scores will fail until the
// TDZ bug in handle-scores.ts is fixed (scores[...] should be prev[...] in the reduce callback).
describe('handleScores.get', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls getGameById with the correct gameId and logger', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ contestants: [] });

		await handleScores.get(gameId, logger);

		expect(mockGetGameById).toHaveBeenCalledWith(gameId, logger);
	});

	it('returns an empty object when there are no contestants', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ contestants: [] });

		const result = await handleScores.get(gameId, logger);

		expect(result).toEqual({});
	});

	it('returns an empty object when all contestants have null scores', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({
			contestants: [
				{ sessionId: crypto.randomUUID(), score: null },
				{ sessionId: crypto.randomUUID(), score: null },
			],
		});

		const result = await handleScores.get(gameId, logger);

		expect(result).toEqual({});
	});

	it('returns a sessionId-to-score map for contestants with scores', async () => {
		const logger = createSpyLogger();
		const sessionId1 = crypto.randomUUID();
		const sessionId2 = crypto.randomUUID();
		mockGetGameById.mockResolvedValue({
			contestants: [
				{ sessionId: sessionId1, score: 200 },
				{ sessionId: sessionId2, score: 400 },
			],
		});

		const result = await handleScores.get(gameId, logger);

		expect(result).toEqual({ [sessionId1]: 200, [sessionId2]: 400 });
	});

	it('excludes contestants with null scores from the result', async () => {
		const logger = createSpyLogger();
		const sessionIdWithScore = crypto.randomUUID();
		const sessionIdNoScore = crypto.randomUUID();
		mockGetGameById.mockResolvedValue({
			contestants: [
				{ sessionId: sessionIdWithScore, score: 100 },
				{ sessionId: sessionIdNoScore, score: null },
			],
		});

		const result = await handleScores.get(gameId, logger);

		expect(result).toEqual({ [sessionIdWithScore]: 100 });
		expect(result[sessionIdNoScore]).toBeUndefined();
	});
});
