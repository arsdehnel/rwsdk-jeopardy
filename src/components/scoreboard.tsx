'use client';
import type { Connection, Connections } from '@/types';

export default function Scoreboard({
	connections,
	scores,
	buzzerQueue,
}: {
	connections: Connections;
	scores: Record<string, number>;
	buzzerQueue?: string[];
}) {
	return (
		<div className="jeopardy-scoreboard">
			{connections.contestants.map((member: Connection) => {
				const buzzerPosition = buzzerQueue?.indexOf(member.id);
				return (
					<span key={member.id} className={`scoreboard-buzzer-queue--${buzzerPosition === 0 ? 'current' : 'in-queue'}`}>
						{member.name}: {scores[member.id]}
					</span>
				);
			})}
		</div>
	);
}
