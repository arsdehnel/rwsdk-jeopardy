import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	mockLogger,
	mockHandleActiveContestant,
	mockHandleContestantRegistrations,
	mockHandleDisplayRegistration,
	mockHandleGamePhase,
	mockHandleHostRegistration,
	mockHandleScores,
	mockHandleUsedClues,
} = vi.hoisted(() => ({
	mockLogger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() },
	mockHandleActiveContestant: { get: vi.fn() },
	mockHandleContestantRegistrations: { get: vi.fn() },
	mockHandleDisplayRegistration: { get: vi.fn() },
	mockHandleGamePhase: { get: vi.fn() },
	mockHandleHostRegistration: { get: vi.fn() },
	mockHandleScores: { get: vi.fn() },
	mockHandleUsedClues: { get: vi.fn() },
}));

vi.mock('@/logger', () => ({ createLogger: vi.fn(() => mockLogger) }));
vi.mock('../handle-active-contestant', () => ({ default: mockHandleActiveContestant }));
vi.mock('../handle-contestant-registrations', () => ({ default: mockHandleContestantRegistrations }));
vi.mock('../handle-display-registration', () => ({ default: mockHandleDisplayRegistration }));
vi.mock('../handle-game-phase', () => ({ default: mockHandleGamePhase }));
vi.mock('../handle-host-registration', () => ({ default: mockHandleHostRegistration }));
vi.mock('../handle-scores', () => ({ default: mockHandleScores }));
vi.mock('../handle-used-clues', () => ({ default: mockHandleUsedClues }));

import { handleGetState } from '../handle-get-state-dispatch';

const GAME_ID = 'game-abc-123';
const key = (field: string) => `game:${GAME_ID}:${field}`;
const stub = () => ({ setState: vi.fn().mockResolvedValue(undefined) });

describe('handleGetState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('early returns', () => {
		it('skips handler and setState when value is already in the DO (non-null)', async () => {
			const s = stub();
			await handleGetState(key('gamePhase'), 'SETUP', s);
			expect(mockHandleGamePhase.get).not.toHaveBeenCalled();
			expect(s.setState).not.toHaveBeenCalled();
		});

		it('skips handler and setState when value is null (explicitly cleared state)', async () => {
			const s = stub();
			await handleGetState(key('activeContestantSessionId'), null, s);
			expect(mockHandleActiveContestant.get).not.toHaveBeenCalled();
			expect(s.setState).not.toHaveBeenCalled();
		});

		it('skips handler and setState when gameId is absent from the key', async () => {
			const s = stub();
			await handleGetState('game::gamePhase', undefined, s);
			expect(mockHandleGamePhase.get).not.toHaveBeenCalled();
			expect(s.setState).not.toHaveBeenCalled();
		});
	});

	describe('routing', () => {
		it.each([
			['activeContestantSessionId', mockHandleActiveContestant, 'session-uuid'],
			['contestants', mockHandleContestantRegistrations, [{ sessionId: 'a', name: 'Alice' }]],
			['display', mockHandleDisplayRegistration, 'display-session-id'],
			['gamePhase', mockHandleGamePhase, 'PLAY'],
			['host', mockHandleHostRegistration, 'host-user-id'],
			['scores', mockHandleScores, { 'session-1': 200 }],
			['usedClueIds', mockHandleUsedClues, ['clue-uuid-1']],
		])('routes %s to the correct handler and calls stub.setState with the result', async (field, handler, returnValue) => {
			const s = stub();
			handler.get.mockResolvedValue(returnValue);

			await handleGetState(key(field), undefined, s);

			expect(handler.get).toHaveBeenCalledWith(GAME_ID, mockLogger);
			expect(s.setState).toHaveBeenCalledWith(returnValue, key(field));
		});

		it('calls stub.setState when handler returns null (null is a valid explicit state)', async () => {
			const s = stub();
			mockHandleActiveContestant.get.mockResolvedValue(null);

			await handleGetState(key('activeContestantSessionId'), undefined, s);

			expect(s.setState).toHaveBeenCalledWith(null, key('activeContestantSessionId'));
		});

		it('does not call stub.setState when handler returns undefined', async () => {
			const s = stub();
			mockHandleGamePhase.get.mockResolvedValue(undefined);

			await handleGetState(key('gamePhase'), undefined, s);

			expect(s.setState).not.toHaveBeenCalled();
		});

		it('does not call any handler or setState for an unknown key', async () => {
			const s = stub();
			await handleGetState(key('unknownField'), undefined, s);
			expect(s.setState).not.toHaveBeenCalled();
		});
	});

	describe('error handling', () => {
		it('logs an error and does not throw when a handler rejects', async () => {
			const s = stub();
			mockHandleGamePhase.get.mockRejectedValue(new Error('DB failure'));

			await expect(handleGetState(key('gamePhase'), undefined, s)).resolves.not.toThrow();

			expect(mockLogger.error).toHaveBeenCalled();
			expect(s.setState).not.toHaveBeenCalled();
		});
	});
});
