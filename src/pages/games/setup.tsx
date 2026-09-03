import type { RequestInfo } from 'rwsdk/worker';
import { KADLink } from '@/components/design-system';
import { CategorySelector } from '@/components/setup';
import GameForm from '@/forms/game';
import { DefaultLayout } from '@/layouts';
import { getCategories, getGameById } from '@/repositories';
import { caughtError } from '../utils';

export default async function Pages__games__setup({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	try {
		const gameId = params.gameId;
		const game = await getGameById(gameId, ctx.logger);
		const categories = await getCategories(ctx.logger);
		return (
			<DefaultLayout pageTitle="Setup Game" ctx={ctx} currentBasePage="games">
				<p>Setup Game {game.id}</p>
				<KADLink href="/auth/login" userPermissions={ctx.permissions} requiredPermission="auth:login" label="Log In" />
				<CategorySelector categories={categories} userPermissions={ctx.permissions} />
				<GameForm
					game={game}
					categoryOptions={categories.map(c => ({ value: c.id, label: c.name }))}
					userPermissions={ctx.permissions}
				/>
			</DefaultLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
