import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { createReactLogger } from '@/logger-react';
import type { ClueInGame, Connection, Connections, GamePhaseEnum, Role } from '@/types';
import * as helpers from './helpers';

const reactLogger = createReactLogger();

export type GameState = {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	role: Role | undefined;
	hasDisplay: boolean;
	selectedClue: ClueInGame | null;
	gamePhase: GamePhaseEnum;
	buzzerQueue: string[];
	correctClueResponse: () => void;
	wrongClueResponse: () => void;
	startGame: () => void;
	setupGame: () => void;
	finishGame: () => void;
	resetBuzzers: () => void;
	abortClue: () => void;
	selectClue: (clue: ClueInGame) => void;
	buzzIn: (contestantSessionId: string) => void;
	usedClueIds: string[];
	expireClue: () => void;
	scores: Record<string, number>;
	activeContestant: string | undefined;
	buzzInTimeLeft: number | undefined;
	decreaseBuzzerTimeLeft: () => void;
};

export default function useGameState(sessionId: string, gameId: string): GameState {
	const [connections, setConnections] = useSyncedState<Connections>(
		{ host: undefined, display: undefined, contestants: [] },
		'connections',
		gameId,
	);
	const [selectedClue, setSelectedClue] = useSyncedState<ClueInGame | null>(null, 'selectedClue', gameId);
	const [gamePhase, setGamePhase] = useSyncedState<GamePhaseEnum>('SETUP', 'gamePhase', gameId);
	const [buzzerQueue, setBuzzerQueue] = useSyncedState<string[]>([], 'buzzerQueue', gameId);
	const [usedClueIds, setUsedClueIds] = useSyncedState<string[]>([], 'usedClueIds', gameId);
	const [scores, setScores] = useSyncedState<Record<string, number>>({}, 'scores', gameId);
	const [activeContestant, setActiveContestant] = useSyncedState<string | undefined>(undefined, 'activeContestant', gameId);
	const [buzzInTimeLeft, setbuzzInTimeLeft] = useSyncedState<number | undefined>(undefined, 'buzzInTimeLeft', gameId);

	const registerConnection = (connection: Connection): void => {
		setConnections(helpers.registerConnection(connections, connection));
	};

	const unregisterConnection = (connectionId: string): void => {
		setConnections(helpers.unregisterConnection(connections, connectionId));
	};

	const correctClueResponse = (): void => {
		const next = helpers.correctClueResponse({
			connections,
			selectedClue,
			gamePhase,
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
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const wrongClueResponse = (): void => {
		const next = helpers.wrongClueResponse({ selectedClue, buzzerQueue, scores, activeContestant, buzzInTimeLeft });
		if (!selectedClue) {
			return;
		}
		setBuzzerQueue(next.buzzerQueue);
		setScores(next.scores);
		setActiveContestant(next.activeContestant);
		setbuzzInTimeLeft(next.buzzInTimeLeft);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} incorrectly!`);
	};

	let role: Role | undefined;
	if (connections.host?.id === sessionId) {
		role = 'host';
	} else if (connections.display?.id === sessionId) {
		role = 'display';
	} else if (connections.contestants.some(contestant => contestant.id === sessionId)) {
		role = 'contestant';
	}

	const hasDisplay: boolean = !!connections.display;

	const startGame = (): void => {
		setGamePhase('PLAYING');
		const randomContestantId =
			connections.contestants.length > 0
				? connections.contestants[Math.floor(Math.random() * connections.contestants.length)].id
				: undefined;
		setActiveContestant(randomContestantId);
	};

	const setupGame = (): void => {
		setGamePhase('SETUP');
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const finishGame = (): void => {
		setGamePhase('FINISHED');
		setSelectedClue(null);
		setBuzzerQueue([]);
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

	const buzzIn = (contestantSessionId: string): void => {
		if (buzzerQueue.includes(contestantSessionId)) {
			return;
		}
		setBuzzerQueue([...buzzerQueue, contestantSessionId]);
		setbuzzInTimeLeft(undefined);
	};

	const decreaseBuzzerTimeLeft = (): void => {
		if (buzzInTimeLeft && buzzInTimeLeft > 0) {
			setbuzzInTimeLeft(buzzInTimeLeft - 1);
		}
	};

	return {
		connections,
		registerConnection,
		unregisterConnection,
		role,
		hasDisplay,
		selectedClue,
		gamePhase,
		buzzerQueue,
		correctClueResponse,
		wrongClueResponse,
		startGame,
		setupGame,
		finishGame,
		resetBuzzers,
		abortClue,
		selectClue,
		buzzIn,
		usedClueIds,
		expireClue,
		scores,
		activeContestant,
		buzzInTimeLeft,
		decreaseBuzzerTimeLeft,
	};
}
