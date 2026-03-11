'use client';

import type { Connection, Connections } from '@/types';

export default function Scoreboard({ connections, scores }: { connections: Connections; scores: Record<string, number> }) {
	return (
		<div className="jeopardy-scoreboard">
			<h2>Scoreboard</h2>
			<ul>
				{connections.contestants.map((member: Connection) => (
					<li key={member.id}>
						{member.name}: {scores[member.id]}
					</li>
				))}
			</ul>
		</div>
	);
}
