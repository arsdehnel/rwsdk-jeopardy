import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockGetGameById } = vi.hoisted(() => ({
	mockGetGameById: vi.fn(),
}));

vi.mock('@/repositories', () => ({
	getGameById: mockGetGameById,
}));

import handleGamePhase from '../handle-game-phase';

function createSpyLogger() {
	return { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() };
}

describe('handleGamePhase.get', () => {
	const gameId = crypto.randomUUID();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('calls getGameById with the correct gameId and logger', async () => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ phase: 'SETUP' });

		await handleGamePhase.get(gameId, logger);

		expect(mockGetGameById).toHaveBeenCalledWith(gameId, logger);
	});

	it.each(['SETUP', 'REGISTER', 'PLAY', 'FINISH'])('returns the %s phase from the game', async phase => {
		const logger = createSpyLogger();
		mockGetGameById.mockResolvedValue({ phase });

		const result = await handleGamePhase.get(gameId, logger);

		expect(result).toBe(phase);
	});
});
