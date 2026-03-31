import type { RequestInfo } from 'rwsdk/worker';

import GameClient from '@/components/game';

export default function Game({ params, ctx, request }: RequestInfo) {
	const gameId = params.gameId;
	if (!gameId) {
		return <p>Game ID not provided</p>;
	}

	const sessionId = ctx?.session.sessionId;
	if (!sessionId) {
		return <p>Session ID not found, please refresh the page.</p>;
	}

	const gameUrl = new URL(`/games/${gameId}`, request.url).href;

	return <GameClient gameUrl={gameUrl} sessionId={sessionId} />;
}
