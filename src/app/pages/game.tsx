'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { RequestInfo } from 'rwsdk/worker';

import getCategories from '@/categories';
import type { Clue, ClueState, Connection, Connections, GameState } from '@/types';
import getRoleFromConnections from '@/utils/get-role-from-connections';
import DisplayView from '@/views/display';
import FinishedView from '@/views/finished';
import HostView from '@/views/host';
import PlayerView from '@/views/player';
import SetupView from '@/views/setup';

export default function Game({ params, ctx }: RequestInfo) {
	const [selectedClue, setSelectedClue] = useSyncedState<Clue | null>(null, 'selectedClue');
	const [clueState, setClueState] = useSyncedState<ClueState>('initial', 'clueState');
	const [gameState, setGameState] = useSyncedState<GameState>('setup', 'gameState');
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

	const selectClue = (clue: Clue) => {
		setSelectedClue(clue);
		setClueState('clue');
	};

	const correctClueResponse = (player: string | null, clue: Clue) => {
		// In a real app, this would update the player's score in the database
		setBuzzedInPlayer(null);
		setClueState('initial');
		console.log(`Player ${player} responded to clue ${JSON.stringify(clue)} correctly!`);
	};

	const role = getRoleFromConnections(connections, ctx.session?.cookieId || '');
	if (gameState === 'setup') {
		return (
			<SetupView
				connections={connections}
				registerConnection={registerConnection}
				unregisterConnection={unregisterConnection}
				sessionId={ctx.session?.cookieId || ''}
				role={role}
				setGameState={setGameState}
			/>
		);
	}

	if (gameState === 'finished') {
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
		return <DisplayView connections={connections} selectedClue={selectedClue} clueState={clueState} categories={categories} />;
	}

	if (role === 'host') {
		return (
			<HostView
				connections={connections}
				clueState={clueState}
				setClueState={setClueState}
				selectedClue={selectedClue}
				buzzedInPlayer={buzzedInPlayer}
				setBuzzedInPlayer={setBuzzedInPlayer}
				correctClueResponse={correctClueResponse}
				setGameState={setGameState}
			/>
		);
	}

	return (
		<PlayerView
			clueState={clueState}
			selectClue={selectClue}
			categories={categories}
			buzzedInPlayer={buzzedInPlayer}
			sessionId={ctx.session?.cookieId || ''}
			setBuzzedInPlayer={setBuzzedInPlayer}
		/>
	);
}
