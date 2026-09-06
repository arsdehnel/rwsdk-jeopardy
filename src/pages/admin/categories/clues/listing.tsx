import type { RequestInfo } from 'rwsdk/worker';
import { KADLink, KADTable } from '@/components/design-system';
import { DefaultLayout } from '@/layouts';
import { getCluesByCategoryId } from '@/repositories';
import type { KADTableColumn } from '@/types/kad-table';
import { caughtError } from '../../../utils';

const columns: KADTableColumn[] = [
	{ key: 'text', label: 'Text' },
	{ key: 'response', label: 'Response' },
	{ key: 'position', label: 'Position' },
	{ key: 'idFirst8', label: 'ID (First 8)' },
	{ key: 'lastVerifiedAt', label: 'Last Verified' },
	{ key: 'referenceUrls', label: 'Reference URLs' },
	{ key: 'createdAt', label: 'Created' },
	{
		key: 'actions',
		label: '',
		actions: [
			{ type: 'link', hrefProp: 'editUrl', label: 'Edit', requiredPermission: 'categories:update' },
			{ type: 'link', hrefProp: 'verifyUrl', label: 'Verify', requiredPermission: 'categories:admin' },
		],
	},
];

export default async function Pages__admin__categories__clues__listing({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	try {
		const clues = await getCluesByCategoryId(params.categoryId, ctx.logger);

		const rows = clues.map(clue => ({
			...clue,
			idFirst8: clue.id.substring(0, 8),
			editUrl: `/admin/categories/${clue.categoryId}/clues/${clue.id}/edit`,
			verifyUrl: `/admin/categories/${clue.categoryId}/clues/${clue.id}/verify`,
		}));

		return (
			<DefaultLayout pageTitle={`Category ${params.categoryId} Clues`} ctx={ctx} currentBasePage="categories">
				<KADLink
					href={`/admin/categories`}
					userPermissions={ctx.permissions}
					requiredPermission="categories:admin"
					label="Back to Categories"
				/>
				<KADLink
					href={`/admin/categories/${params.categoryId}/clues/sort`}
					userPermissions={ctx.permissions}
					requiredPermission="categories:admin"
					label="Sort Clues"
				/>
				<KADTable userPermissions={ctx.permissions} columns={columns} data={rows} />
			</DefaultLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
