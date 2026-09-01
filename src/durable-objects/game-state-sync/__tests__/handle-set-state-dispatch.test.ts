import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
	mockLogger,
	mockHandleActiveContestant,
	mockHandleContestantRegistrations,
	mockHandleDisplayRegistration,
	mockHandleHostRegistration,
	mockHandleScores,
	mockHandleUsedClues,
} = vi.hoisted(() => ({
	mockLogger: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), child: vi.fn() },
	mockHandleActiveContestant: { set: vi.fn().mockResolvedValue(undefined) },
	mockHandleContestantRegistrations: { set: vi.fn().mockResolvedValue(undefined) },
	mockHandleDisplayRegistration: { set: vi.fn().mockResolvedValue(undefined) },
	mockHandleHostRegistration: { set: vi.fn().mockResolvedValue(undefined) },
	mockHandleScores: { set: vi.fn().mockResolvedValue(undefined) },
	mockHandleUsedClues: { set: vi.fn().mockResolvedValue(undefined) },
}));

vi.mock('@/logger', () => ({ createLogger: vi.fn(() => mockLogger) }));
vi.mock('../handle-active-contestant', () => ({ default: mockHandleActiveContestant }));
vi.mock('../handle-contestant-registrations', () => ({ default: mockHandleContestantRegistrations }));
vi.mock('../handle-display-registration', () => ({ default: mockHandleDisplayRegistration }));
vi.mock('../handle-host-registration', () => ({ default: mockHandleHostRegistration }));
vi.mock('../handle-scores', () => ({ default: mockHandleScores }));
vi.mock('../handle-used-clues', () => ({ default: mockHandleUsedClues }));

import { handleSetState } from '../handle-set-state-dispatch';

const GAME_ID = 'game-abc-123';
const key = (field: string) => `game:${GAME_ID}:${field}`;

const ALL_SET_HANDLERS = () => [
	mockHandleActiveContestant,
	mockHandleContestantRegistrations,
	mockHandleDisplayRegistration,
	mockHandleHostRegistration,
	mockHandleScores,
	mockHandleUsedClues,
];

describe('handleSetState', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('early returns', () => {
		it('does not call any handler when gameId is absent from the key', async () => {
			await handleSetState('game::scores', { 'session-1': 200 });
			for (const handler of ALL_SET_HANDLERS()) {
				expect(handler.set).not.toHaveBeenCalled();
			}
		});
	});

	describe('routing', () => {
		it.each([
			['activeContestantSessionId', mockHandleActiveContestant, 'session-uuid'],
			['contestants', mockHandleContestantRegistrations, [{ sessionId: 'a', name: 'Alice' }]],
			['display', mockHandleDisplayRegistration, { sessionId: 'display-session' }],
			['host', mockHandleHostRegistration, { sessionId: 'host-session', userId: 'host-user' }],
			['scores', mockHandleScores, { 'session-1': 200 }],
			['usedClueIds', mockHandleUsedClues, ['clue-uuid-1']],
		])('routes %s to the correct handler with the value and logger', async (field, handler, value) => {
			await handleSetState(key(field), value);
			expect(handler.set).toHaveBeenCalledWith(GAME_ID, value, mockLogger);
		});

		it('does not call any handler for an unknown key', async () => {
			await handleSetState(key('unknownField'), 'some-value');
			for (const handler of ALL_SET_HANDLERS()) {
				expect(handler.set).not.toHaveBeenCalled();
			}
		});
	});

	describe('error handling', () => {
		it('logs an error and does not throw when a handler rejects', async () => {
			mockHandleScores.set.mockRejectedValue(new Error('DB failure'));

			await expect(handleSetState(key('scores'), { 'session-1': 200 })).resolves.not.toThrow();

			expect(mockLogger.error).toHaveBeenCalled();
		});
	});
});
