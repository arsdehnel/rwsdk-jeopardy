'use client';

import type { Connection, Connections } from '@/app/pages/game';

export default function MemberSelect({
	connections,
	registerConnection,
	unregisterConnection,
	sessionId,
}: {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
}) {
	let role: 'host' | 'player' | 'display' | undefined;
	if (connections.host?.id === sessionId) {
		role = 'host';
	} else if (connections.scoreboard?.id === sessionId) {
		role = 'display';
	} else if (connections.members.some(member => member.id === sessionId)) {
		role = 'player';
	}

	if (role) {
		return (
			<div className="member-select">
				<p>You are registered as a {role}.</p>
				<button
					type="button"
					onClick={() => {
						unregisterConnection(sessionId);
					}}
				>
					Unregister
				</button>
				<div>
					<pre>{JSON.stringify(connections, null, 4)}</pre>
				</div>
			</div>
		);
	}

	return (
		<div className="member-select">
			<button
				type="button"
				onClick={() => {
					registerConnection({ id: sessionId, name: `Player ${connections.members.length + 1}`, role: 'player' });
				}}
			>
				Add me as player
			</button>
			<button
				type="button"
				onClick={() => {
					registerConnection({ id: sessionId, name: `Host ${connections.members.length + 1}`, role: 'host' });
				}}
			>
				Register this device as host
			</button>
			<button
				type="button"
				onClick={() => {
					registerConnection({ id: sessionId, name: `Display ${connections.members.length + 1}`, role: 'display' });
				}}
			>
				Show gameboard on this device
			</button>
			<div>
				<pre>{JSON.stringify(connections, null, 4)}</pre>
			</div>
		</div>
	);
}
