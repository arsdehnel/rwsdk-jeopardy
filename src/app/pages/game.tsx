'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { RequestInfo } from 'rwsdk/worker';
import getCategories from '@/categories';
import useGameState from '@/hooks/use-game-state';
import type { Clue, Connection, Connections, GamePhase } from '@/types';
import getRoleFromConnections from '@/utils/get-role-from-connections';
import DisplayView from '@/views/display';
import FinishedView from '@/views/finished';
import HostView from '@/views/host';
import PlayerView from '@/views/player';
import SetupView from '@/views/setup';

export default function Game({ params, ctx }: RequestInfo) {
	const { selectedClue, setSelectedClue } = useGameState();
	const [gamePhase, setGamePhase] = useSyncedState<GamePhase>('setup', 'gamePhase');
	const [buzzedInPlayer, setBuzzedInPlayer] = useSyncedState<string | null>(null, 'buzzedInPlayer');
	const [connections, setConnections] = useSyncedState<Connections>(
		{ host: undefined, display: undefined, members: [] },
		'connections',
	);

	const gameId = params.gameId;
	if (!gameId) {
		return <p>Game ID not provided</p>;
	}

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
		// In a real app, this would update the player's score in the database
		setBuzzedInPlayer(null);
		console.log(`Player ${player} responded to clue ${JSON.stringify(clue)} correctly!`);
	};

	const role = getRoleFromConnections(connections, ctx.session?.cookieId || '');
	if (gamePhase === 'setup') {
		return (
			<SetupView
				connections={connections}
				registerConnection={registerConnection}
				unregisterConnection={unregisterConnection}
				sessionId={ctx.session?.cookieId || ''}
				role={role}
				setGamePhase={setGamePhase}
			/>
		);
	}

	if (gamePhase === 'finished') {
		return <FinishedView connections={connections} />;
	}

	if (!role) {
		return (
			<p>
				You are not registered in this game but the game has started, please contact the host and have them revert it back to
				setup stage.
			</p>
		);
	}

	const categories = getCategories();

	// game mode active
	if (role === 'display') {
		return <DisplayView connections={connections} selectedClue={selectedClue} categories={categories} />;
	}

	if (role === 'host') {
		return (
			<HostView
				connections={connections}
				selectedClue={selectedClue}
				setSelectedClue={setSelectedClue}
				buzzedInPlayer={buzzedInPlayer}
				setBuzzedInPlayer={setBuzzedInPlayer}
				correctClueResponse={correctClueResponse}
				setGamePhase={setGamePhase}
			/>
		);
	}

	return (
		<PlayerView
			selectedClue={selectedClue}
			setSelectedClue={setSelectedClue}
			categories={categories}
			buzzedInPlayer={buzzedInPlayer}
			sessionId={ctx.session?.cookieId || ''}
			setBuzzedInPlayer={setBuzzedInPlayer}
		/>
	);
}
