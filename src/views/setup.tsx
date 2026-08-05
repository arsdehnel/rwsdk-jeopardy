'use client';
import { QRCodeSVG } from 'qrcode.react';
import MemberSelect from '@/components/member-select';
import type { Connection, Connections, Permission } from '@/types';

export default function SetupView({
	connections,
	registerConnection,
	unregisterConnection,
	sessionId,
	role,
	startGame,
	gameUrl,
	hasDisplay,
	userPermissions,
}: {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
	role: string | undefined;
	startGame: () => void;
	gameUrl: string;
	hasDisplay: boolean;
	userPermissions: Permission[];
}): React.ReactNode {
	if (!sessionId) {
		return (
			<p>Sorry but there is a bug we haven't fixed yet, can you refresh your page and hopefully this message will go away.</p>
		);
	}

	return (
		<div className="registration-container">
			<div className="user-registration">
				<MemberSelect
					role={role}
					connections={connections}
					registerConnection={registerConnection}
					unregisterConnection={unregisterConnection}
					sessionId={sessionId}
					hasDisplay={hasDisplay}
					userPermissions={userPermissions}
				/>
				{role === 'host' && (
					<>
						<hr />
						<div>
							As the host you get some debugging information while we're in alpha.
							<pre>{JSON.stringify(connections, null, 4)}</pre>
						</div>
						<button type="button" onClick={(): void => startGame()}>
							Start Game
						</button>
					</>
				)}
				{role === 'display' && (
					<>
						<div className="qr-code">
							<QRCodeSVG value={gameUrl} size={300} />
						</div>
						<div className="contestant-list">
							<h3>Contestants</h3>
							<ul>
								{connections.contestants.map(contestant => (
									<li key={contestant.id}>{contestant.name}</li>
								))}
							</ul>
						</div>
					</>
				)}
				{role === 'contestant' && <div className="contestant-list"></div>}
			</div>
		</div>
	);
}
