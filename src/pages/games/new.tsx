import type { RequestInfo } from 'rwsdk/worker';
import { CategorySelector } from '@/components/setup';
import GameForm from '@/forms/game';
import { DefaultLayout } from '@/layouts';
import { getCategories } from '@/repositories';

export default async function Pages__games__new({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const categories = await getCategories(ctx.logger);
	return (
		<DefaultLayout pageTitle="Setup New Game" ctx={ctx} currentBasePage="games">
			<p>Setup a new game</p>
			<CategorySelector categories={categories} userPermissions={ctx.permissions} />
			<GameForm categoryOptions={categories.map(c => ({ value: c.id, label: c.name }))} userPermissions={ctx.permissions} />
		</DefaultLayout>
	);
}
