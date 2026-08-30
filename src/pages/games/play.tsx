import type { RequestInfo } from 'rwsdk/worker';
import { DefaultLayout, PlayLayout } from '@/layouts';
import { getCategoriesForGameStage, getGameById } from '@/repositories';
import type { Role } from '@/types';
import ViewGamePlay from '@/views/game-play';

export default async function Pages__games__play({ params, ctx }: RequestInfo): Promise<React.JSX.Element> {
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
		const categoryIds =
			currentStage?.categories.sort((a, b) => a.position - b.position).map(gmStgCtgry => gmStgCtgry.categoryId) || [];
		const categories = await getCategoriesForGameStage(categoryIds, game.currentStage, ctx.logger);

		let currentUserRole: Role | undefined;
		if (game.displaySessionId === sessionId) {
			currentUserRole = 'display';
		} else if (game.hostUserId === ctx.user?.id) {
			currentUserRole = 'host';
		} else if (game.contestants.some(c => c.sessionId === sessionId)) {
			currentUserRole = 'contestant';
		}

		if (!currentUserRole) {
			return (
				<DefaultLayout pageTitle={`Play Game ${game.id}`} ctx={ctx} currentBasePage="games">
					<p>Sorry you don't seem to be a registered contestant in this game</p>
				</DefaultLayout>
			);
		}

		return (
			<PlayLayout pageTitle={`Play Game ${game.id}`} ctx={ctx} currentBasePage="games">
				<ViewGamePlay
					currentUserRole={currentUserRole}
					contestants={game.contestants}
					gameId={gameId}
					sessionId={sessionId}
					categories={categories}
				/>
			</PlayLayout>
		);
	} catch (err) {
		ctx.logger.error('Unexpected error in Pages__Games__Play', { err: err instanceof Error ? err : new Error(String(err)) });
		return <p>Unexpected error occurred. Please try again later.</p>;
	}
}
