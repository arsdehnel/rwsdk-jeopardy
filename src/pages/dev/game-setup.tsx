import type { RequestInfo } from 'rwsdk/worker';
import GameClient from '@/components/game';
import type { CategoryInGame } from '@/types';

export default function Pages__Dev__Game_Setup({ ctx, request }: RequestInfo): React.JSX.Element {
	const sessionId = ctx?.session?.sessionId ?? crypto.randomUUID(); // Use a random UUID if sessionId is not available
	const gameId = 'test-game-id'; // Use a fixed game ID for testing purposes
	const gameUrl = new URL(`/games/${gameId}/play`, request.url).href;
	const categories: CategoryInGame[] = [];

	return (
		<GameClient
			gameUrl={gameUrl}
			gameId={gameId}
			sessionId={sessionId}
			categories={categories}
			userPermissions={['games:register']}
		/>
	);
}
