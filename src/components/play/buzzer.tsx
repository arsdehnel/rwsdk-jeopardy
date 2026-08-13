'use client';
import classnames from 'classnames';
import locales from '@/locales';

export function Buzzer({
	buzzIn,
	buzzerQueue,
	sessionId,
	buzzInTimeLeft,
}: {
	buzzIn: (contestantSessionId: string) => void;
	buzzerQueue: string[];
	sessionId: string;
	buzzInTimeLeft: number | undefined;
}): React.ReactNode {
	const someoneHasBuzzedIn = buzzerQueue.length > 0;
	const buzzerPosition = buzzerQueue.indexOf(sessionId);
	const currentHasBuzzedIn = buzzerQueue.includes(sessionId);
	let buzzerText = locales.buzzerText.initial;
	if (buzzInTimeLeft && buzzInTimeLeft <= 0) {
		buzzerText = locales.buzzerText.timesUp;
	} else if (someoneHasBuzzedIn && !currentHasBuzzedIn) {
		buzzerText = locales.buzzerText.initial;
	} else if (buzzerPosition === 0) {
		buzzerText = locales.buzzerText.yourTurn;
	} else if (buzzerPosition > 0) {
		buzzerText = locales.buzzerText.inQueue;
	}

	const timerIsActive = typeof buzzInTimeLeft !== 'undefined';
	const timerIsExpired = timerIsActive ? buzzInTimeLeft <= 0 : false;

	const disabled = currentHasBuzzedIn || timerIsExpired;
	const buttonClassnames = classnames({
		'buzzer-button': true,
		'buzzer-button-not-your-turn': currentHasBuzzedIn && buzzerPosition > 0,
		'buzzer-button-your-turn': buzzerPosition === 0,
		'buzzer-button-timer-expired': timerIsExpired,
	});

	return (
		<button className={buttonClassnames} type="button" disabled={disabled} onClick={(): void => buzzIn(sessionId)}>
			{buzzerText}
		</button>
	);
}
