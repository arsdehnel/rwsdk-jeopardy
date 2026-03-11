'use client';

import type { Connection, Connections } from '@/types';

export default function MemberSelect({
	connections,
	role,
	registerConnection,
	unregisterConnection,
	sessionId,
}: {
	connections: Connections;
	role: string | undefined;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
}) {
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
			</div>
		);
	}

	return (
		<>
			<p>Register for this game by selecting a role below</p>
			<div className="member-select">
				<button
					type="button"
					onClick={() => {
						registerConnection({ id: sessionId, name: `Contestant ${connections.contestants.length + 1}`, role: 'contestant' });
					}}
				>
					Add me as contestant
				</button>
				<button
					type="button"
					onClick={() => {
						registerConnection({ id: sessionId, name: `Host ${connections.contestants.length + 1}`, role: 'host' });
					}}
				>
					Register this device as host
				</button>
				<button
					type="button"
					onClick={() => {
						registerConnection({ id: sessionId, name: `Display ${connections.contestants.length + 1}`, role: 'display' });
					}}
				>
					Use this device as display
				</button>
			</div>
		</>
	);
}
