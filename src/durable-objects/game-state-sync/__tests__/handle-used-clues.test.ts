import { beforeEach, describe, expect, it, vi } from 'vitest';

// NOTE: These tests WILL FAIL until handle-used-clues.ts is fully implemented.

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateGame, mockGetGameById } = vi.hoisted(() => ({
	mockUpdateGame: vi.fn().mockResolvedValue({}),
	mockGetGameById: vi.fn(),
}));

vi.mock('@/repositories', () => ({
	updateGame: mockUpdateGame,
	getGameById: mockGetGameById,
}));

import handleUsedClues from '../handle-used-clues';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleUsedClues.set', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls updateGame with usedClueIds when given a string array with items', async () => {
		const logger = createSpyLogger();
		const clueIds = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];

		await handleUsedClues.set(gameId, clueIds, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { usedClueIds: clueIds }, SYSTEM_ID, logger);
	});

	it('calls updateGame with an empty usedClueIds array', async () => {
		const logger = createSpyLogger();

		await handleUsedClues.set(gameId, [], logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { usedClueIds: [] }, SYSTEM_ID, logger);
	});

	it('calls logger.error and does not call updateGame for a non-array string', async () => {
		const logger = createSpyLogger();

		await handleUsedClues.set(gameId, 'not-an-array', logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateGame).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call updateGame for an array with non-string elements', async () => {
		const logger = createSpyLogger();

		await handleUsedClues.set(gameId, [1, 2, 3], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateGame).not.toHaveBeenCalled();
	});

	it('calls updateGame with usedClueIds set to null when value is null', async () => {
		const logger = createSpyLogger();

		await handleUsedClues.set(gameId, null, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { usedClueIds: null }, SYSTEM_ID, logger);
	});

	it('calls updateGame with usedClueIds set to null when value is undefined', async () => {
		const logger = createSpyLogger();

		await handleUsedClues.set(gameId, undefined, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { usedClueIds: null }, SYSTEM_ID, logger);
	});
});

describe('handleUsedClues.get', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls getGameById with the correct gameId and logger', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ usedClueIds: null });

		await handleUsedClues.get(gameId, logger);

		expect(mockGetGameById).toHaveBeenCalledWith(gameId, logger);
	});

	it('returns the usedClueIds from the game', async () => {
		const logger = createSpyLogger();
		const clueIds = [crypto.randomUUID(), crypto.randomUUID()];
		mockGetGameById.mockResolvedValue({ usedClueIds: clueIds });

		const result = await handleUsedClues.get(gameId, logger);

		expect(result).toEqual(clueIds);
	});

	it('returns an empty array when usedClueIds is null', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ usedClueIds: null });

		const result = await handleUsedClues.get(gameId, logger);

		expect(result).toEqual([]);
	});

	it('returns an empty array when usedClueIds is undefined', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ usedClueIds: undefined });

		const result = await handleUsedClues.get(gameId, logger);

		expect(result).toEqual([]);
	});
});
