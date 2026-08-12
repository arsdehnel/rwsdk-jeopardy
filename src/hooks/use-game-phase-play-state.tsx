import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { createReactLogger } from '@/logger-react';
import type { ClueInGame } from '@/types';
import * as helpers from './helpers';

const reactLogger = createReactLogger();

export type GamePhasePlayState = {
	// buzzers
	buzzInTimeLeft: number | undefined;
	buzzerQueue: string[];
	buzzIn: () => void;
	resetBuzzers: () => void;
	decreaseBuzzerTimeLeft: () => void;

	// responses
	correctClueResponse: () => void;
	wrongClueResponse: () => void;

	// scores
	scores: Record<string, number>;

	// clue selection
	activeContestant: string | undefined;
	selectedClue: ClueInGame | null;
	abortClue: () => void;
	selectClue: (clue: ClueInGame) => void;
	usedClueIds: string[];
	expireClue: () => void;
};

export default function useGamePhasePlayState(sessionId: string, gameId: string): GamePhasePlayState {
	const [selectedClue, setSelectedClue] = useSyncedState<ClueInGame | null>(null, 'selectedClue', gameId);
	const [buzzerQueue, setBuzzerQueue] = useSyncedState<string[]>([], 'buzzerQueue', gameId);
	const [usedClueIds, setUsedClueIds] = useSyncedState<string[]>([], 'usedClueIds', gameId);
	const [scores, setScores] = useSyncedState<Record<string, number>>({}, 'scores', gameId);
	const [activeContestant, setActiveContestant] = useSyncedState<string | undefined>(undefined, 'activeContestant', gameId);
	const [buzzInTimeLeft, setbuzzInTimeLeft] = useSyncedState<number | undefined>(undefined, 'buzzInTimeLeft', gameId);

	const correctClueResponse = (): void => {
		const next = helpers.correctClueResponse({
			selectedClue,
			buzzerQueue,
			usedClueIds,
			scores,
			activeContestant,
			buzzInTimeLeft,
		});
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		setScores(next.scores);
		setActiveContestant(next.activeContestant);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const expireClue = (): void => {
		const next = helpers.expireClue({ selectedClue, buzzerQueue, usedClueIds, buzzInTimeLeft });
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		reactLogger.info(`Host expired clue ${JSON.stringify(selectedClue)}`);
	};

	const wrongClueResponse = (): void => {
		if (!selectedClue) {
			return;
		}
		const next = helpers.wrongClueResponse({ selectedClue, buzzerQueue, scores, activeContestant, buzzInTimeLeft });
		setBuzzerQueue(next.buzzerQueue);
		setScores(next.scores);
		setActiveContestant(next.activeContestant);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} incorrectly!`);
	};

	const resetBuzzers = (): void => {
		setBuzzerQueue([]);
		setbuzzInTimeLeft(5);
	};

	const abortClue = (): void => {
		setSelectedClue(null);
		setBuzzerQueue([]);
		setbuzzInTimeLeft(undefined);
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
	};

	const decreaseBuzzerTimeLeft = (): void => {
		if (buzzInTimeLeft && buzzInTimeLeft > 0) {
			setbuzzInTimeLeft(buzzInTimeLeft - 1);
		}
	};

	return {
		// buzzers
		buzzInTimeLeft,
		buzzerQueue,
		buzzIn,
		resetBuzzers,
		decreaseBuzzerTimeLeft,

		// responses
		correctClueResponse,
		wrongClueResponse,

		// scores
		scores,

		// clue selection
		activeContestant,
		selectedClue,
		abortClue,
		selectClue,
		usedClueIds,
		expireClue,
	};
}
