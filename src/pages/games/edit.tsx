import type { RequestInfo } from 'rwsdk/worker';
import { KADLink } from '@/components/design-system';
import { CategorySelector } from '@/components/setup/category-selector';
import GameForm from '@/forms/game';
import SetupLayout from '@/layouts/setup';
import { getCategories, getGameById } from '@/repositories';
import { caughtError } from '../utils';

export default async function Pages__Games__Edit({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	try {
		const gameId = params.gameId;
		const game = await getGameById(gameId, ctx.logger);
		const categories = await getCategories(ctx.logger);
		return (
			<SetupLayout pageTitle="Edit Game" ctx={ctx} currentBasePage="games">
				<p>Edit Game {game.id}</p>
				<KADLink href="/auth/login" userPermissions={ctx.permissions} requiredPermission="auth:login" label="Log In" />
				<CategorySelector categories={categories} userPermissions={ctx.permissions} />
				<GameForm
					game={game}
					categoryOptions={categories.map(c => ({ value: c.id, label: c.name }))}
					userPermissions={ctx.permissions}
				/>
			</SetupLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
