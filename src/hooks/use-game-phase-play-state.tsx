import { useEffect } from 'react';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { createReactLogger } from '@/logger-react';
import type { ClueInGame, GameContestantDBRead } from '@/types';
import * as helpers from './helpers';

const reactLogger = createReactLogger();

export type GamePhasePlayState = {
	// buzzers
	buzzInTimeLeft: number | undefined;
	buzzerQueue: string[];
	buzzIn: () => void;
	resetBuzzers: () => void;

	// responses
	responseTimeLeft: number | undefined;
	correctClueResponse: () => void;
	wrongClueResponse: () => void;

	// scores
	scores: Record<string, number>;

	// clue selection
	selectedClue: ClueInGame | null;
	abortClue: () => void;
	selectClue: (clue: ClueInGame) => void;
	usedClueIds: string[];
	expireClue: () => void;

	// derived values
	activeContestant: GameContestantDBRead | undefined;
	contestantMode: 'buzzer' | 'clue-select';
	buzzInTimerIsActive: boolean;
	buzzInTimerIsExpired: boolean;
	responseTimerIsActive: boolean;
};

export default function useGamePhasePlayState(
	sessionId: string,
	gameId: string,
	contestants: GameContestantDBRead[],
): GamePhasePlayState {
	const [selectedClue, setSelectedClue] = useSyncedState<ClueInGame | null>(null, `game:${gameId}:selectedClue`, gameId);
	const [buzzerQueue, setBuzzerQueue] = useSyncedState<string[]>([], `game:${gameId}:buzzerQueue`, gameId);
	const [usedClueIds, setUsedClueIds] = useSyncedState<string[]>([], `game:${gameId}:usedClueIds`, gameId);
	const [scores, setScores] = useSyncedState<Record<string, number>>({}, `game:${gameId}:scores`, gameId);
	const [activeContestantSessionId, setActiveContestantSessionId] = useSyncedState<string | undefined>(
		undefined,
		'activeContestantSessionId',
		gameId,
	);
	const [buzzInTimeLeft, setbuzzInTimeLeft] = useSyncedState<number | undefined>(
		undefined,
		`game:${gameId}:buzzInTimeLeft`,
		gameId,
	);
	const [responseTimeLeft, setResponseTimeLeft] = useSyncedState<number | undefined>(
		undefined,
		`game:${gameId}:responseTimeLeft`,
		gameId,
	);

	const correctClueResponse = (): void => {
		const next = helpers.correctClueResponse({
			selectedClue,
			buzzerQueue,
			usedClueIds,
			scores,
			activeContestantSessionId,
			buzzInTimeLeft,
			responseTimeLeft,
		});
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		setScores(next.scores);
		setActiveContestantSessionId(next.activeContestantSessionId);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		setResponseTimeLeft(next.responseTimeLeft);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const expireClue = (): void => {
		const next = helpers.expireClue({ selectedClue, buzzerQueue, usedClueIds, buzzInTimeLeft, responseTimeLeft });
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		setResponseTimeLeft(next.responseTimeLeft);
		reactLogger.info(`Host expired clue ${JSON.stringify(selectedClue)}`);
	};

	const wrongClueResponse = (): void => {
		if (!selectedClue) {
			return;
		}
		const next = helpers.wrongClueResponse({
			selectedClue,
			buzzerQueue,
			scores,
			activeContestantSessionId,
			buzzInTimeLeft,
			responseTimeLeft,
		});
		setBuzzerQueue(next.buzzerQueue);
		setScores(next.scores);
		setActiveContestantSessionId(next.activeContestantSessionId);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		setResponseTimeLeft(next.responseTimeLeft);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} incorrectly!`);
	};

	const resetBuzzers = (): void => {
		setBuzzerQueue([]);
		setbuzzInTimeLeft(5);
		setResponseTimeLeft(undefined);
	};

	const abortClue = (): void => {
		setSelectedClue(null);
		setBuzzerQueue([]);
		setbuzzInTimeLeft(undefined);
		setResponseTimeLeft(undefined);
	};

	const selectClue = (clue: ClueInGame): void => {
		setSelectedClue(clue);
		setbuzzInTimeLeft(5);
	};

	const buzzIn = (): void => {
		if (buzzerQueue.includes(sessionId)) {
			return;
		}
		setBuzzerQueue([...buzzerQueue, sessionId]);
		setbuzzInTimeLeft(undefined);
		setResponseTimeLeft(5);
	};

	const contestantMode = selectedClue ? 'buzzer' : 'clue-select';

	const randomlySelectedContestant = contestants[Math.floor(Math.random() * contestants.length)];
	const activeContestant = activeContestantSessionId
		? contestants.find(c => c.sessionId === activeContestantSessionId)
		: contestantMode === 'buzzer'
			? undefined
			: randomlySelectedContestant;

	useEffect(() => {
		if (!buzzInTimeLeft) return;
		const timer = setTimeout(() => {
			if (buzzInTimeLeft && buzzInTimeLeft > 0) {
				setbuzzInTimeLeft(buzzInTimeLeft - 1);
			}
		}, 1000);
		return (): void => clearTimeout(timer);
	}, [buzzInTimeLeft, setbuzzInTimeLeft]);

	useEffect(() => {
		if (!responseTimeLeft) return;
		const timer = setTimeout(() => {
			if (responseTimeLeft && responseTimeLeft > 0) {
				setResponseTimeLeft(responseTimeLeft - 1);
			}
		}, 1000);
		return (): void => clearTimeout(timer);
	}, [responseTimeLeft, setResponseTimeLeft]);

	return {
		// buzzers
		buzzInTimeLeft,
		buzzerQueue,
		buzzIn,
		resetBuzzers,

		// responses
		responseTimeLeft,
		correctClueResponse,
		wrongClueResponse,

		// scores
		scores,

		// clue selection
		selectedClue,
		abortClue,
		selectClue,
		usedClueIds,
		expireClue,

		// derived values
		activeContestant,
		contestantMode,
		buzzInTimerIsActive: typeof buzzInTimeLeft !== 'undefined',
		buzzInTimerIsExpired: typeof buzzInTimeLeft !== 'undefined' ? buzzInTimeLeft <= 0 : false,
		responseTimerIsActive: typeof responseTimeLeft !== 'undefined',
	};
}
