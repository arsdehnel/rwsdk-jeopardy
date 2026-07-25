'use client';
import { useState } from 'react';

import type { Connection, Connections, Role } from '@/types';

export default function MemberSelect({
	connections,
	role,
	registerConnection,
	unregisterConnection,
	sessionId,
	hasDisplay,
}: {
	connections: Connections;
	role: string | undefined;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
	hasDisplay: boolean;
}) {
	const [name, setName] = useState('');
	const [selectedRole, setSelectedRole] = useState<Role>('host');

	const gameHasHost = connections.host && connections.host !== null;
	const gameHasDisplay = connections.display && connections.display !== null;

	if (role) {
		let registrationNote: string = `Welcome contestant ${name}!`;
		if (role === 'display') {
			registrationNote = `Game display`;
		} else if (role === 'host') {
			registrationNote = `Welcome host!`;
		}

		return (
			<div className="member-select">
				<div>{registrationNote}</div>
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

	if (!hasDisplay) {
		return (
			<>
				<p>
					No devices are registered yet so this one will be the display. If you want another device to act as the
					display please start the game on that one.
				</p>
				<button
					className="registration-button"
					type="button"
					onClick={() => {
						registerConnection({ id: sessionId, role: 'display' });
					}}
				>
					Register this device as the display
				</button>
			</>
		);
	}

	return (
		<>
			<p>Who are you?</p>
			<div className="member-select">
				<label htmlFor="role">Role:</label>
				<select id="role" value={selectedRole} onChange={e => setSelectedRole(e.target.value as Role)}>
					{!gameHasHost && <option value="host">Host</option>}
					{!gameHasDisplay && <option value="display">Display</option>}
					<option value="contestant">Contestant</option>
				</select>
				{selectedRole === 'contestant' && (
					<>
						<label htmlFor="name">Name:</label>
						<input
							id="name"
							type="text"
							placeholder="Your name here"
							value={name}
							onChange={e => setName(e.target.value)}
						/>
					</>
				)}
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
