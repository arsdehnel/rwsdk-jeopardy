'use client';
import { QRCodeSVG } from 'qrcode.react';
import MemberSelect from '@/components/member-select';
import type { Connection, Connections } from '@/types';

export default function SetupView({
	connections,
	registerConnection,
	unregisterConnection,
	sessionId,
	role,
	startGame,
	gameUrl,
}: {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
	role: string | undefined;
	startGame: () => void;
	gameUrl: string;
}) {
	if (!sessionId) {
		return (
			<>
				<h1 className="welcome-title">RWSDK Jeopardy</h1>
				<main>
					<h2 className="page-title">Game Setup</h2>
					<p>Sorry but there is a bug we haven't fixed yet, can you refresh your page and hopefully this message will go away.</p>
				</main>
			</>
		);
	}

	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">Game Setup</h2>
				<p>
					We don't have logins at this point so we just assign you a randomly generated session ID. In case you need it that ID
					for you is <code>{sessionId}</code>.
				</p>
				<div style={{ display: 'flex' }}>
					<div style={{ margin: '5rem', textAlign: 'center', flex: '0 0 300px' }}>
						<h2>Game Registration</h2>
						<MemberSelect
							role={role}
							connections={connections}
							registerConnection={registerConnection}
							unregisterConnection={unregisterConnection}
							sessionId={sessionId}
						/>
						{role === 'host' && (
							<>
								<hr />
								<div>
									As the host you get some debugging information while we're in alpha.
									<pre>{JSON.stringify(connections, null, 4)}</pre>
								</div>
								<button type="button" onClick={() => startGame()}>
									Start Game
								</button>
							</>
						)}
					</div>
					<div style={{ margin: '5rem', textAlign: 'center', flex: '1 0 100px' }}>
						<QRCodeSVG value={gameUrl} size={300} />
					</div>
				</div>
			</main>
		</>
	);
}
