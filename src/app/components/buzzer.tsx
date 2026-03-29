'use client';

export default function Buzzer({
	buzzIn,
	buzzerQueue,
	sessionId,
}: {
	buzzIn: (contestantSessionId: string) => void;
	buzzerQueue: string[];
	sessionId: string;
}) {
	if (buzzerQueue.length > 0 && !buzzerQueue.includes(sessionId)) {
		return (
			<div>
				<p>{buzzerQueue[0]} has buzzed in!</p>
			</div>
		);
	}

	if (buzzerQueue.includes(sessionId)) {
		return (
			<div>
				<p>You have buzzed in!</p>
			</div>
		);
	}

	return (
		<button className="buzzer-button" type="button" onClick={() => buzzIn(sessionId)}>
			Buzz In
		</button>
	);
}
