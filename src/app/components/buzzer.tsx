'use client';

export default function Buzzer({
	buzzIn,
	buzzedInSessionId,
	sessionId,
}: {
	buzzIn: (playerSessionId: string) => void;
	buzzedInSessionId: string | null;
	sessionId: string;
}) {
	if (buzzedInSessionId && buzzedInSessionId !== sessionId) {
		return (
			<div>
				<p>{buzzedInSessionId} has buzzed in!</p>
			</div>
		);
	}

	if (buzzedInSessionId === sessionId) {
		return (
			<div>
				<p>You have buzzed in!</p>
			</div>
		);
	}

	return (
		<div>
			<button type="button" onClick={() => buzzIn(sessionId)}>
				Buzz In
			</button>
		</div>
	);
}
