import type { RequestInfo } from 'rwsdk/worker';
import { OpenRegistrationButton } from '@/components/setup';
import { DefaultLayout } from '@/layouts';
import { getGameById } from '@/repositories';
import { gamesSchemas } from '@/schemas';
import { caughtError } from '../utils';

export default async function Pages__games__view({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	try {
		const gameId = params.gameId;
		const game = await getGameById(gameId, ctx.logger);

		const { success: isRegisterable, error: isRegisterableValidationErrors } = gamesSchemas.isRegisterable.safeParse(game);
		const isRegisterableErrors = isRegisterable ? '' : isRegisterableValidationErrors.flatten();
		return (
			<DefaultLayout pageTitle="View Game" ctx={ctx} currentBasePage="games">
				<p>View Game {game.id}</p>
				<OpenRegistrationButton
					gameId={gameId}
					gamePhase={game.phase}
					isRegisterable={isRegisterable}
					isRegisterableErrors={JSON.stringify(isRegisterableErrors, null, 4)}
				/>
				<p>
					<pre>{JSON.stringify(game, null, 4)}</pre>
				</p>
			</DefaultLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
