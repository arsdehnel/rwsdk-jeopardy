'use client';

import type { Connection, Connections } from '@/types';

export default function Scoreboard({ connections }: { connections: Connections }) {
	return (
		<div className="jeopardy-scoreboard">
			<h2>Scoreboard</h2>
			<ul>
				{connections.members.map((member: Connection) => (
					<li key={member.id}>{member.name}</li>
				))}
			</ul>
		</div>
	);
}
