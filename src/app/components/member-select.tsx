'use client';

import type { Connection, Connections } from '@/app/pages/game';

export default function MemberSelect({
	connections,
	registerConnection,
}: {
	connections: Connections;
	registerConnection: (connection: Connection) => void;
}) {
	return (
		<div className="member-select">
			<button
				type="button"
				onClick={() => {
					registerConnection({ id: Date.now(), name: `Player ${connections.members.length + 1}`, role: 'player' });
				}}
			>
				Add me as player
			</button>
			<button
				type="button"
				onClick={() => {
					registerConnection({ id: Date.now(), name: `Host ${connections.members.length + 1}`, role: 'host' });
				}}
			>
				Register this device as host
			</button>
			<button
				type="button"
				onClick={() => {
					registerConnection({ id: Date.now(), name: `Display ${connections.members.length + 1}`, role: 'display' });
				}}
			>
				Show gameboard on this device
			</button>
			{connections.members.map(member => (
				<div key={member.id}>
					{member.name} ({member.role})
				</div>
			))}
		</div>
	);
}
