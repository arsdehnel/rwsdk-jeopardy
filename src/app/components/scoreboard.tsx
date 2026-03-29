'use client';
import type { Connection, Connections } from '@/types';

export default function Scoreboard({ connections, scores }: { connections: Connections; scores: Record<string, number> }) {
	return (
		<div className="jeopardy-scoreboard">
			{connections.contestants.map((member: Connection) => (
				<span key={member.id}>
					{member.name}: {scores[member.id]}
				</span>
			))}
		</div>
	);
}
