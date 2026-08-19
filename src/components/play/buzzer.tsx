'use client';
import classnames from 'classnames';
import locales from '@/locales';
import type { ClueInGame } from '@/types';

export function Buzzer({
	selectedClue,
	buzzIn,
	buzzerQueue,
	sessionId,
	buzzInTimerIsExpired,
}: {
	selectedClue: ClueInGame | null;
	buzzIn: (contestantSessionId: string) => void;
	buzzerQueue: string[];
	sessionId: string;
	buzzInTimerIsExpired: boolean;
}): React.ReactNode {
	if (!selectedClue) {
		return;
	}
	const someoneHasBuzzedIn = buzzerQueue.length > 0;
	const buzzerPosition = buzzerQueue.indexOf(sessionId);
	const currentHasBuzzedIn = buzzerQueue.includes(sessionId);
	let buzzerText = locales.buzzerText.initial;
	if (buzzInTimerIsExpired) {
		buzzerText = locales.buzzerText.timesUp;
	} else if (someoneHasBuzzedIn && !currentHasBuzzedIn) {
		buzzerText = locales.buzzerText.initial;
	} else if (buzzerPosition === 0) {
		buzzerText = locales.buzzerText.yourTurn;
	} else if (buzzerPosition > 0) {
		buzzerText = locales.buzzerText.inQueue;
	}

	const disabled = currentHasBuzzedIn || buzzInTimerIsExpired;
	const buttonClassnames = classnames({
		'buzzer-button': true,
		'buzzer-button-not-your-turn': currentHasBuzzedIn && buzzerPosition > 0,
		'buzzer-button-your-turn': buzzerPosition === 0,
		'buzzer-button-timer-expired': buzzInTimerIsExpired,
	});

	return (
		<button className={buttonClassnames} type="button" disabled={disabled} onClick={(): void => buzzIn(sessionId)}>
			{buzzerText}
		</button>
	);
}
