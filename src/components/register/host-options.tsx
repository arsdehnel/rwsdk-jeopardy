import { startGame } from '@/actions/games';
import type { ContestantRegistration, DisplayRegistration } from '@/types';

export function HostOptions({
	gameId,
	display,
	contestants,
}: {
	gameId: string;
	display: DisplayRegistration;
	contestants: ContestantRegistration[];
}): React.ReactNode {
	if (!display) {
		return <p>Please register a display before starting the game</p>;
	}
	if (contestants.length < 2) {
		return <p>At least two contestants must be registered before you can start the game</p>;
	}
	return (
		<button
			type="button"
			onClick={(): void => {
				startGame({ gameId, displaySessionId: display.sessionId, contestants });
			}}
		>
			Start Game
		</button>
	);
}
