import { useSyncedState } from 'rwsdk/use-synced-state/client';
import { createReactLogger } from '@/logger-react';
import type { Clue, Connection, Connections, GamePhase, Role } from '@/types';
import * as helpers from './helpers';

const reactLogger = createReactLogger();

export type GameState = {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	role: Role | undefined;
	hasDisplay: boolean;
	selectedClue: Clue | null;
	gamePhase: GamePhase;
	buzzerQueue: string[];
	correctClueResponse: () => void;
	wrongClueResponse: () => void;
	startGame: () => void;
	setupGame: () => void;
	finishGame: () => void;
	resetBuzzers: () => void;
	abortClue: () => void;
	selectClue: (clue: Clue) => void;
	buzzIn: (contestantSessionId: string) => void;
	usedClueIds: string[];
	expireClue: () => void;
	scores: Record<string, number>;
};

export default function useGameState(sessionId: string = ''): GameState {
	const [connections, setConnections] = useSyncedState<Connections>(
		{ host: undefined, display: undefined, contestants: [] },
		'connections',
	);
	const [selectedClue, setSelectedClue] = useSyncedState<Clue | null>(null, 'selectedClue');
	const [gamePhase, setGamePhase] = useSyncedState<GamePhase>('setup', 'gamePhase');
	const [buzzerQueue, setBuzzerQueue] = useSyncedState<string[]>([], 'buzzerQueue');
	const [usedClueIds, setUsedClueIds] = useSyncedState<string[]>([], 'usedClueIds');
	const [scores, setScores] = useSyncedState<Record<string, number>>({}, 'scores');

	const registerConnection = (connection: Connection): void => {
		setConnections(helpers.registerConnection(connections, connection));
	};

	const unregisterConnection = (connectionId: string): void => {
		setConnections(helpers.unregisterConnection(connections, connectionId));
	};

	const correctClueResponse = (): void => {
		const next = helpers.correctClueResponse({ connections, selectedClue, gamePhase, buzzerQueue, usedClueIds, scores });
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		setScores(next.scores);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const expireClue = (): void => {
		const next = helpers.expireClue({ selectedClue, buzzerQueue, usedClueIds });
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		reactLogger.info(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const wrongClueResponse = (): void => {
		const next = helpers.wrongClueResponse({ selectedClue, buzzerQueue, scores });
		if (!selectedClue) {
			return;
		}
		setBuzzerQueue(next.buzzerQueue);
		setScores(next.scores);
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
		setGamePhase('active');
	};

	const setupGame = (): void => {
		setGamePhase('setup');
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const finishGame = (): void => {
		setGamePhase('finished');
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const resetBuzzers = (): void => {
		setBuzzerQueue([]);
	};

	const abortClue = (): void => {
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const selectClue = (clue: Clue): void => {
		setSelectedClue(clue);
	};

	const buzzIn = (contestantSessionId: string): void => {
		if (buzzerQueue.includes(contestantSessionId)) {
			return;
		}
		setBuzzerQueue([...buzzerQueue, contestantSessionId]);
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
	};
}
