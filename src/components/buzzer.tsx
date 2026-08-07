'use client';
import classnames from 'classnames';
import locales from '@/locales';

export default function Buzzer({
	buzzIn,
	buzzerQueue,
	sessionId,
}: {
	buzzIn: (contestantSessionId: string) => void;
	buzzerQueue: string[];
	sessionId: string;
}): React.ReactNode {
	const someoneHasBuzzedIn = buzzerQueue.length > 0;
	const buzzerPosition = buzzerQueue.indexOf(sessionId);
	const currentHasBuzzedIn = buzzerQueue.includes(sessionId);
	let buzzerText = locales.buzzerText.initial;
	if (someoneHasBuzzedIn && !currentHasBuzzedIn) {
		buzzerText = locales.buzzerText.initial;
	} else if (buzzerPosition === 0) {
		buzzerText = locales.buzzerText.yourTurn;
	} else if (buzzerPosition > 0) {
		buzzerText = locales.buzzerText.inQueue;
	}

	return (
		<button
			className={classnames('buzzer-button', `buzzer-button--position-${buzzerPosition}`)}
			type="button"
			disabled={currentHasBuzzedIn}
			onClick={(): void => buzzIn(sessionId)}
		>
			{buzzerText}
		</button>
	);
}
