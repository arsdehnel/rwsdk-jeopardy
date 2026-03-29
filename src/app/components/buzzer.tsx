'use client';
import classnames from 'classnames';

export default function Buzzer({
	buzzIn,
	buzzerQueue,
	sessionId,
}: {
	buzzIn: (contestantSessionId: string) => void;
	buzzerQueue: string[];
	sessionId: string;
}) {
	const buzzerPosition = buzzerQueue.indexOf(sessionId);
	const hasBuzzedIn = buzzerQueue.includes(sessionId);
	let buzzerText = 'Buzz In';
	if (buzzerPosition === 0) {
		buzzerText = 'Your turn to answer';
	} else if (buzzerPosition > 0) {
		buzzerText = `Your are in position ${buzzerPosition + 1} in the queue`;
	}

	return (
		<button
			className={classnames('buzzer-button', `buzzer-button--position-${buzzerPosition}`)}
			type="button"
			disabled={hasBuzzedIn}
			onClick={() => buzzIn(sessionId)}
		>
			{buzzerText}
		</button>
	);
}
