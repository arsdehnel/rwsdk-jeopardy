import type { RequestInfo } from 'rwsdk/worker';
import { SortClues } from '@/components/admin';
import { KADLink } from '@/components/design-system';
import { DefaultLayout } from '@/layouts';
import { getCluesByCategoryId } from '@/repositories';

export default async function Pages__admin__categories__clues__sort({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	const categoryId = params.categoryId;
	const clues = await getCluesByCategoryId(params.categoryId, ctx.logger);

	return (
		<DefaultLayout ctx={ctx} currentBasePage="categories" pageTitle={`Sort Clues for Category ${categoryId}`}>
			<KADLink
				href={`/admin/categories/${categoryId}/clues`}
				userPermissions={ctx.permissions}
				requiredPermission="clues:admin"
				label="Back to Clues"
			/>
			<SortClues clues={clues} userPermissions={ctx.permissions} />
		</DefaultLayout>
	);
}
