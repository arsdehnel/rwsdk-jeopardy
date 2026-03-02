'use client';
import MemberSelect from '@/app/components/member-select';
import type { Connection, Connections, GameState } from '@/types';

export default function SetupView({
	connections,
	registerConnection,
	unregisterConnection,
	sessionId,
	role,
	setGameState,
}: {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
	role: string | undefined;
	setGameState: (gameState: GameState) => void;
}) {
	return (
		<>
			<h1>Game Setup</h1>
			<p>Waiting for players to join...</p>
			{sessionId && <p>Your session ID: {sessionId}</p>}
			{sessionId && (
				<MemberSelect
					connections={connections}
					registerConnection={registerConnection}
					unregisterConnection={unregisterConnection}
					sessionId={sessionId}
				/>
			)}
			{role === 'host' && (
				<button type="button" onClick={() => setGameState('active')}>
					Start Game
				</button>
			)}
		</>
	);
}
