import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { Clue, Connection, Connections, GamePhase, Role } from '@/types';
import * as helpers from './helpers';

export default function useGameState(sessionId: string = '') {
	const [connections, setConnections] = useSyncedState<Connections>(
		{ host: undefined, display: undefined, contestants: [] },
		'connections',
	);
	const [selectedClue, setSelectedClue] = useSyncedState<Clue | null>(null, 'selectedClue');
	const [gamePhase, setGamePhase] = useSyncedState<GamePhase>('setup', 'gamePhase');
	const [buzzerQueue, setBuzzerQueue] = useSyncedState<string[]>([], 'buzzerQueue');
	const [usedClueIds, setUsedClueIds] = useSyncedState<string[]>([], 'usedClueIds');
	const [scores, setScores] = useSyncedState<Record<string, number>>({}, 'scores');

	const registerConnection = (connection: Connection) => {
		setConnections(helpers.registerConnection(connections, connection));
	};

	const unregisterConnection = (connectionId: string) => {
		setConnections(helpers.unregisterConnection(connections, connectionId));
	};

	const correctClueResponse = () => {
		const next = helpers.correctClueResponse({ connections, selectedClue, gamePhase, buzzerQueue, usedClueIds, scores });
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		setScores(next.scores);
		console.log(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const expireClue = () => {
		const next = helpers.expireClue({ selectedClue, buzzerQueue, usedClueIds });
		setSelectedClue(next.selectedClue);
		setBuzzerQueue(next.buzzerQueue);
		setUsedClueIds(next.usedClueIds);
		console.log(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const wrongClueResponse = () => {
		const next = helpers.wrongClueResponse({ selectedClue, buzzerQueue, scores });
		if (!selectedClue) {
			return;
		}
		setBuzzerQueue(next.buzzerQueue);
		setScores(next.scores);
		console.log(`Contestant ${buzzerQueue[0]} responded to clue ${JSON.stringify(selectedClue)} incorrectly!`);
	};

	let role: Role | undefined;
	if (connections.host?.id === sessionId) {
		role = 'host';
	} else if (connections.display?.id === sessionId) {
		role = 'display';
	} else if (connections.contestants.some(contestant => contestant.id === sessionId)) {
		role = 'contestant';
	}

	const startGame = () => {
		setGamePhase('active');
	};

	const setupGame = () => {
		setGamePhase('setup');
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const finishGame = () => {
		setGamePhase('finished');
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const resetBuzzers = () => {
		setBuzzerQueue([]);
	};

	const abortClue = () => {
		setSelectedClue(null);
		setBuzzerQueue([]);
	};

	const selectClue = (clue: Clue) => {
		setSelectedClue(clue);
	};

	const buzzIn = (contestantSessionId: string) => {
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
