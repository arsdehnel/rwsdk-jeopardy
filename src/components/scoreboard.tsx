'use client';
import classNames from 'classnames';
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
					<span
						key={member.id}
						className={classNames({
							'scoreboard-buzzer-queue--current': buzzerPosition === 0,
							'scoreboard-buzzer-queue--in-queue': buzzerPosition !== undefined && buzzerPosition > 0,
						})}
					>
						{member.name}: {scores[member.id]}
					</span>
				);
			})}
		</div>
	);
}
