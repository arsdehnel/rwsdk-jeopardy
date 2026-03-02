'use client';

import type { Connection, Connections } from '@/types';
import getRoleFromConnections from '@/utils/get-role-from-connections';

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
	const role = getRoleFromConnections(connections, sessionId);

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
				Use this device as display
			</button>
			<div>
				<pre>{JSON.stringify(connections, null, 4)}</pre>
			</div>
		</div>
	);
}
