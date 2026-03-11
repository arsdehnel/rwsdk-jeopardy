'use client';
import MemberSelect from '@/app/components/member-select';
import type { Connection, Connections } from '@/types';

export default function SetupView({
	connections,
	registerConnection,
	unregisterConnection,
	sessionId,
	role,
	startGame,
}: {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
	role: string | undefined;
	startGame: () => void;
}) {
	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">Game Setup</h2>
				{sessionId ? (
					<>
						<p>
							We don't have logins at this point so we just assign you a randomly generated session ID. In case you need it that
							ID for you is {sessionId}
						</p>
						<h2>Game Registration</h2>
						<p>Register for this game by selecting a role below</p>
						<MemberSelect
							role={role}
							connections={connections}
							registerConnection={registerConnection}
							unregisterConnection={unregisterConnection}
							sessionId={sessionId}
						/>
					</>
				) : (
					<p>Sorry but there is a bug we haven't fixed yet, can you refresh your page and hopefully this message will go away.</p>
				)}
				{role === 'host' && (
					<>
						<button type="button" onClick={() => startGame()}>
							Start Game
						</button>
						<div>
							<pre>{JSON.stringify(connections, null, 4)}</pre>
						</div>
					</>
				)}
			</main>
		</>
	);
}
