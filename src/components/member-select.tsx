'use client';
import { useState } from 'react';

import type { Connection, Connections, Role } from '@/types';

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
	const [name, setName] = useState('');
	const [selectedRole, setSelectedRole] = useState<Role>('contestant');

	const gameHasHost = connections.host && connections.host !== null;
	const gameHasDisplay = connections.display && connections.display !== null;

	if (role) {
		return (
			<div className="member-select">
				<div>You are registered as a {role}.</div>
				<button
					className="registration-button"
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
			<p>Enter your name and pick a role!</p>
			<div className="member-select">
				<label htmlFor="name">Name:</label>
				<input id="name" type="text" placeholder="Your name here" value={name} onChange={e => setName(e.target.value)} />
				<label htmlFor="role">Role:</label>
				<select id="role" value={selectedRole} onChange={e => setSelectedRole(e.target.value as Role)}>
					{!gameHasHost && <option value="host">Host</option>}
					{!gameHasDisplay && <option value="display">Display</option>}
					<option value="contestant">Contestant</option>
				</select>
				<button
					className="registration-button"
					type="button"
					disabled={!name || !selectedRole}
					onClick={() => {
						registerConnection({ id: sessionId, name, role: selectedRole });
					}}
				>
					Register for this game
				</button>
			</div>
		</>
	);
}
