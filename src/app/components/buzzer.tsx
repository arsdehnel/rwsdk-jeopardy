'use client';

export default function Buzzer({
	setBuzzedInPlayer,
	buzzedInPlayer,
	sessionId,
}: {
	setBuzzedInPlayer: (player: string | null) => void;
	buzzedInPlayer: string | null;
	sessionId: string;
}) {
	if (buzzedInPlayer && buzzedInPlayer !== sessionId) {
		return (
			<div>
				<p>{buzzedInPlayer} has buzzed in!</p>
			</div>
		);
	}

	if (buzzedInPlayer === sessionId) {
		return (
			<div>
				<p>You have buzzed in!</p>
			</div>
		);
	}

	return (
		<div>
			<button type="button" onClick={() => setBuzzedInPlayer(sessionId)}>
				Buzz In
			</button>
		</div>
	);
}
