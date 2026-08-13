'use client';
import classNames from 'classnames';
import type { Contestant } from '@/types';

export function Scoreboard({
	contestants,
	scores,
	buzzerQueue,
}: {
	contestants: Contestant[];
	scores: Record<string, number>;
	buzzerQueue?: string[];
}): React.ReactNode {
	return (
		<div className="jeopardy-scoreboard">
			{contestants.map(contestant => {
				const buzzerPosition = buzzerQueue?.indexOf(contestant.sessionId);

				return (
					<span
						key={contestant.sessionId}
						className={classNames({
							'scoreboard-buzzer-queue--current': buzzerPosition === 0,
							'scoreboard-buzzer-queue--in-queue': buzzerPosition !== undefined && buzzerPosition > 0,
						})}
					>
						{contestant.name}: {scores[contestant.sessionId]}
					</span>
				);
			})}
		</div>
	);
}
