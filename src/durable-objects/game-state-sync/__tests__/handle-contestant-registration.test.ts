import { beforeEach, describe, expect, it, vi } from 'vitest';

const SYSTEM_ID = 'cf2ef843-8572-45d4-8cb4-4b4b8b621ceb';

const { mockSaveGameContestants } = vi.hoisted(() => ({
	mockSaveGameContestants: vi.fn().mockResolvedValue([]),
}));

vi.mock('@/repositories', () => ({
	saveGameContestants: mockSaveGameContestants,
}));

import handleContestantRegistration from '../handle-contestant-registration';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleContestantRegistration.set', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls saveGameContestants with valid contestants array', async () => {
		const logger = createSpyLogger();
		const contestants = [
			{ sessionId: crypto.randomUUID(), name: 'Alice' },
			{ sessionId: crypto.randomUUID(), name: 'Bob' },
		];

		await handleContestantRegistration.set(gameId, contestants, logger);

		expect(mockSaveGameContestants).toHaveBeenCalledWith(gameId, contestants, SYSTEM_ID, logger);
	});

	it('calls saveGameContestants with empty array', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, [], logger);

		expect(mockSaveGameContestants).toHaveBeenCalledWith(gameId, [], SYSTEM_ID, logger);
	});

	it('calls logger.error and does not call saveGameContestants for non-array value', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, 'not-an-array', logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call saveGameContestants for array with invalid items', async () => {
		const logger = createSpyLogger();
		const invalidContestants = [{ name: 'Missing sessionId' }];

		await handleContestantRegistration.set(gameId, invalidContestants, logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call saveGameContestants for array containing null', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, [null], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});

	it('calls logger.error and does not call saveGameContestants for array containing a non-object primitive', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, [42], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});

	it('calls logger.error when item has a valid sessionId but no name', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, [{ sessionId: crypto.randomUUID() }], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});

	it('calls logger.error when item has sessionId and name but an invalid id type', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, [{ sessionId: crypto.randomUUID(), name: 'Alice', id: 123 }], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});

	it('calls logger.error when item has sessionId and name but an invalid userId type', async () => {
		const logger = createSpyLogger();

		await handleContestantRegistration.set(gameId, [{ sessionId: crypto.randomUUID(), name: 'Alice', userId: 123 }], logger);

		expect(logger.error).toHaveBeenCalled();
		expect(mockSaveGameContestants).not.toHaveBeenCalled();
	});
});
