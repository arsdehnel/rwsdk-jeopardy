import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { Clue, Connection, Connections, GamePhase } from '@/types';

export default function useGameState(sessionId?: string) {
	const [connections, setConnections] = useSyncedState<Connections>(
		{ host: undefined, display: undefined, members: [] },
		'connections',
	);
	const [selectedClue, setSelectedClue] = useSyncedState<Clue | null>(null, 'selectedClue');
	const [gamePhase, setGamePhase] = useSyncedState<GamePhase>('setup', 'gamePhase');
	const [buzzedInSessionId, setBuzzedInSessionId] = useSyncedState<string | null>(null, 'buzzedInSessionId');

	const registerConnection = (connection: Connection) => {
		if (connection.role === 'host') {
			setConnections({ ...connections, host: connection });
		} else if (connection.role === 'display') {
			setConnections({ ...connections, display: connection });
		} else {
			setConnections({ ...connections, members: [...connections.members, connection] });
		}
	};

	const unregisterConnection = (connectionId: string) => {
		if (connections.host?.id === connectionId) {
			setConnections({ ...connections, host: undefined });
		} else if (connections.display?.id === connectionId) {
			setConnections({ ...connections, display: undefined });
		} else {
			setConnections({ ...connections, members: connections.members.filter(member => member.id !== connectionId) });
		}
	};

	const correctClueResponse = (player: string | null, clue: Clue) => {
		setBuzzedInSessionId(null);
		console.log(`Player ${player} responded to clue ${JSON.stringify(clue)} correctly!`);
	};

	let role: 'host' | 'player' | 'display' | undefined;
	if (connections.host?.id === sessionId) {
		role = 'host';
	} else if (connections.display?.id === sessionId) {
		role = 'display';
	} else if (connections.members.some(member => member.id === sessionId)) {
		role = 'player';
	}

	const startGame = () => {
		setGamePhase('active');
	};

	const setupGame = () => {
		setGamePhase('setup');
		setSelectedClue(null);
		setBuzzedInSessionId(null);
	};

	const finishGame = () => {
		setGamePhase('finished');
		setSelectedClue(null);
		setBuzzedInSessionId(null);
	};

	const resetBuzzers = () => {
		setBuzzedInSessionId(null);
	};

	const abortClue = () => {
		setSelectedClue(null);
		setBuzzedInSessionId(null);
	};

	const selectClue = (clue: Clue) => {
		setSelectedClue(clue);
	};

	const buzzIn = (playerSessionId: string) => {
		setBuzzedInSessionId(playerSessionId);
	};

	return {
		connections,
		registerConnection,
		unregisterConnection,
		role,
		selectedClue,
		gamePhase,
		buzzedInSessionId,
		correctClueResponse,
		startGame,
		setupGame,
		finishGame,
		resetBuzzers,
		abortClue,
		selectClue,
		buzzIn,
	};
}
