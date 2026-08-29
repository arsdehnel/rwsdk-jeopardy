import type { RequestInfo } from 'rwsdk/worker';
import { RegisterLayout } from '@/layouts';
import { getGameById } from '@/repositories';
import ViewGameRegister from '@/views/game-register';

export default async function Pages__games__register({ params, ctx, request }: RequestInfo): Promise<React.JSX.Element> {
	try {
		const gameId = params.gameId;
		if (!gameId) {
			return <p>Game ID not provided</p>;
		}

		const sessionId = ctx?.session?.sessionId;
		if (!sessionId) {
			return <p>Session ID not found, please refresh the page.</p>;
		}

		const game = await getGameById(gameId, ctx.logger);
		if (!game) {
			return <p>Game not found</p>;
		}
		const gameUrl = new URL(`/games/${gameId}/play`, request.url).href;

		return (
			<RegisterLayout pageTitle={`Setup Game ${game.id}`} ctx={ctx} currentBasePage="games">
				<ViewGameRegister
					gameId={gameId}
					gameUrl={gameUrl}
					sessionId={sessionId}
					userId={ctx.user?.id}
					userPermissions={ctx.permissions}
				/>
			</RegisterLayout>
		);
	} catch (err) {
		ctx.logger.error('Unexpected error in Pages__Games__Register', { err: err instanceof Error ? err : new Error(String(err)) });
		return <p>Unexpected error occurred. Please try again later.</p>;
	}
}
