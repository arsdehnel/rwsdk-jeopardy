import { beforeEach, describe, expect, it, vi } from 'vitest';

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateGame, mockGetGameById } = vi.hoisted(() => ({
	mockUpdateGame: vi.fn().mockResolvedValue({}),
	mockGetGameById: vi.fn(),
}));

vi.mock('@/repositories', () => ({
	updateGame: mockUpdateGame,
	getGameById: mockGetGameById,
}));

import handleDisplayRegistration from '../handle-display-registration';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleDisplayRegistration.set', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls updateGame with displaySessionId null when value is undefined', async () => {
		const logger = createSpyLogger();

		await handleDisplayRegistration.set(gameId, undefined, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { displaySessionId: null }, SYSTEM_ID, logger);
	});

	it('calls updateGame with displaySessionId null when value is null', async () => {
		const logger = createSpyLogger();

		await handleDisplayRegistration.set(gameId, null, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { displaySessionId: null }, SYSTEM_ID, logger);
	});

	it('calls updateGame with displaySessionId and userId as actor for valid DisplayRegistration with userId', async () => {
		const logger = createSpyLogger();
		const sessionId = crypto.randomUUID();
		const userId = crypto.randomUUID();
		const value = { sessionId, userId };

		await handleDisplayRegistration.set(gameId, value, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { displaySessionId: sessionId }, userId, logger);
	});

	it('calls updateGame with displaySessionId and SYSTEM_ID as actor for valid DisplayRegistration without userId', async () => {
		const logger = createSpyLogger();
		const sessionId = crypto.randomUUID();
		const value = { sessionId };

		await handleDisplayRegistration.set(gameId, value, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { displaySessionId: sessionId }, SYSTEM_ID, logger);
	});

	it('calls logger.error and does not call updateGame for invalid shape', async () => {
		const logger = createSpyLogger();

		await handleDisplayRegistration.set(gameId, 42, logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateGame).not.toHaveBeenCalled();
	});
});

describe('handleDisplayRegistration.get', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls getGameById with the correct gameId and logger', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ displaySessionId: null });

		await handleDisplayRegistration.get(gameId, logger);

		expect(mockGetGameById).toHaveBeenCalledWith(gameId, logger);
	});

	it('returns the displaySessionId from the game', async () => {
		const logger = createSpyLogger();
		const sessionId = crypto.randomUUID();
		mockGetGameById.mockResolvedValue({ displaySessionId: sessionId });

		const result = await handleDisplayRegistration.get(gameId, logger);

		expect(result).toBe(sessionId);
	});

	it('returns null when displaySessionId is null', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ displaySessionId: null });

		const result = await handleDisplayRegistration.get(gameId, logger);

		expect(result).toBeNull();
	});
});
