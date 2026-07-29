import type { RequestInfo } from 'rwsdk/worker';
import { KADLink } from '@/components/design-system';
import CategorySelector from '@/components/setup/category-selector';
import SetupLayout from '@/layouts/setup';
import { getCategories } from '@/repositories';

export default async function Pages__Games__New({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const categories = await getCategories(ctx.logger);
	return (
		<SetupLayout pageTitle="Setup New Game" ctx={ctx} currentBasePage="games">
			<p>Setup a new game</p>
			<KADLink href="/auth/login" userPermissions={ctx.permissions} requiredPermission="auth:login" label="Log In" />
			<CategorySelector categories={categories} userPermissions={ctx.permissions} />
		</SetupLayout>
	);
}
