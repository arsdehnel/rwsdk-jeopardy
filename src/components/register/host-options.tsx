import { startGame } from '@/actions/games';
import type { Contestant } from '@/types';

export function HostOptions({
	gameId,
	display,
	contestants,
}: {
	gameId: string;
	display: string | undefined;
	contestants: Contestant[];
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
				startGame({ gameId, displaySessionId: display, contestants });
			}}
		>
			Start Game
		</button>
	);
}
