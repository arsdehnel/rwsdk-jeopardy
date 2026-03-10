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
	const [usedClueIds, setUsedClueIds] = useSyncedState<number[]>([], 'usedClueIds');

	const registerConnection = (connection: Connection) => {
		setConnections(helpers.registerConnection(connections, connection));
	};

	const unregisterConnection = (connectionId: string) => {
		setConnections(helpers.unregisterConnection(connections, connectionId));
	};

	const correctClueResponse = (playerId: string) => {
		if (!selectedClue) {
			return;
		}
		setBuzzerQueue([]);
		setSelectedClue(null);
		setUsedClueIds(Array.from(new Set([...usedClueIds, selectedClue.id])));
		console.log(`Player ${playerId} responded to clue ${JSON.stringify(selectedClue)} correctly!`);
	};

	const wrongClueResponse = () => {
		setBuzzerQueue(prev => prev.slice(1));
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

	const expireClue = () => {
		if (!selectedClue) {
			return;
		}
		setSelectedClue(null);
		setBuzzerQueue([]);
		setUsedClueIds(Array.from(new Set([...usedClueIds, selectedClue.id])));
	};

	const buzzIn = (playerSessionId: string) => {
		if (buzzerQueue.includes(playerSessionId)) {
			return;
		}
		setBuzzerQueue([...buzzerQueue, playerSessionId]);
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
	};
}
