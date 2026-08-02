import type { RequestInfo } from 'rwsdk/worker';
import GameClient from '@/components/game';
import SetupLayout from '@/layouts/setup';
import { getCategoriesForGameStage, getGameById } from '@/repositories';

export default async function Pages__Games__Play({ params, ctx, request }: RequestInfo): Promise<React.JSX.Element> {
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
		const currentStage = game.stages.find(stage => stage.stage === game.currentStage);
		const categoryIds = currentStage?.categories.sort((a, b) => a.position - b.position).map(category => category.id) || [];
		const categories = await getCategoriesForGameStage(categoryIds, game.currentStage, ctx.logger);

		const gameUrl = new URL(`/games/${gameId}/play`, request.url).href;

		return (
			<SetupLayout pageTitle={`Play Game ${game.id}`} ctx={ctx} currentBasePage="games">
				<GameClient gameUrl={gameUrl} sessionId={sessionId} categories={categories} />
			</SetupLayout>
		);
	} catch (err) {
		ctx.logger.error('Unexpected error in Pages__Games__Play', { err: err instanceof Error ? err : new Error(String(err)) });
		return <p>Unexpected error occurred. Please try again later.</p>;
	}
}
