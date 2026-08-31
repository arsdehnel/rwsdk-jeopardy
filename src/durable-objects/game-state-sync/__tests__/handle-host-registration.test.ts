import { beforeEach, describe, expect, it, vi } from 'vitest';

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockUpdateGame } = vi.hoisted(() => ({
	mockUpdateGame: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/repositories', () => ({
	updateGame: mockUpdateGame,
}));

import handleHostRegistration from '../handle-host-registration';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleHostRegistration.set', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls updateGame with hostUserId null when value is undefined', async () => {
		const logger = createSpyLogger();

		await handleHostRegistration.set(gameId, undefined, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { hostUserId: null }, SYSTEM_ID, logger);
	});

	it('calls updateGame with hostUserId null when value is null', async () => {
		const logger = createSpyLogger();

		await handleHostRegistration.set(gameId, null, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { hostUserId: null }, SYSTEM_ID, logger);
	});

	it('calls updateGame with hostUserId and userId as actor for valid HostRegistration', async () => {
		const logger = createSpyLogger();
		const userId = crypto.randomUUID();
		const value = { sessionId: crypto.randomUUID(), userId };

		await handleHostRegistration.set(gameId, value, logger);

		expect(mockUpdateGame).toHaveBeenCalledWith(gameId, { hostUserId: userId }, userId, logger);
	});

	it('calls logger.error and does not call updateGame for non-object value', async () => {
		const logger = createSpyLogger();

		await handleHostRegistration.set(gameId, 'unexpected-string', logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateGame).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call updateGame for object missing userId', async () => {
		const logger = createSpyLogger();
		const value = { sessionId: crypto.randomUUID() };

		await handleHostRegistration.set(gameId, value, logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockUpdateGame).not.toHaveBeenCalled();
	});
});
