'use client';
import { useEffect, useState } from 'react';

import type { Connection, Connections, Permission, Role } from '@/types';
import { KADButton } from './design-system';

export function MemberSelect({
	connections,
	role,
	registerConnection,
	unregisterConnection,
	sessionId,
	hasDisplay,
	userPermissions,
}: {
	connections: Connections;
	role: string | undefined;
	registerConnection: (connection: Connection) => void;
	unregisterConnection: (connectionId: string) => void;
	sessionId: string;
	hasDisplay: boolean;
	userPermissions: Permission[];
}): React.ReactNode {
	const gameHasHost = connections.host && connections.host !== null;
	const gameHasDisplay = connections.display && connections.display !== null;
	const defaultRole: Role = !gameHasHost ? 'host' : !gameHasDisplay ? 'display' : 'contestant';
	const [name, setName] = useState('');
	const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);

	useEffect(() => {
		if (!gameHasHost && !gameHasDisplay) {
			setSelectedRole('contestant');
		}
	}, [gameHasHost, gameHasDisplay]);

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
					onClick={(): void => {
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
					No devices are registered yet. The first device to register will be the display. If you want another device to act as
					the display please start the game on that one.
				</p>
				<button
					className="registration-button"
					type="button"
					onClick={(): void => {
						registerConnection({ id: sessionId, role: 'display' });
					}}
				>
					Register this device as the display
				</button>
			</>
		);
	}

	let buttonDisabled = true;
	if (selectedRole === 'host') {
		buttonDisabled = false;
	} else if (selectedRole === 'contestant' && name) {
		buttonDisabled = false;
	}

	return (
		<>
			<p>Who are you?</p>
			<div className="member-select">
				{(!gameHasHost || !gameHasDisplay) && (
					<>
						<label htmlFor="role">Role:</label>
						<select
							id="role"
							value={selectedRole}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => setSelectedRole(e.target.value as Role)}
						>
							{!gameHasHost && <option value="host">Host</option>}
							{!gameHasDisplay && <option value="display">Display</option>}
							<option value="contestant">Contestant</option>
						</select>
					</>
				)}
				{selectedRole === 'contestant' && (
					<>
						<label htmlFor="name">Name:</label>
						<input
							id="name"
							type="text"
							placeholder="Your name here"
							value={name}
							onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setName(e.target.value)}
						/>
					</>
				)}
				{selectedRole}
				<KADButton
					className="registration-button"
					type="button"
					disabled={buttonDisabled}
					userPermissions={userPermissions}
					requiredPermission="games:register"
					onClick={(): void => {
						registerConnection({ id: sessionId, name, role: selectedRole });
					}}
				>
					Register for this game
				</KADButton>
			</div>
		</>
	);
}
