import type { RequestInfo } from 'rwsdk/worker';
import KADTable from '@/components/design-system/table/kad-table';
import SetupLayout from '@/layouts/setup';
import { getCluesByCategoryId } from '@/repositories';
import type { KADTableColumn } from '@/types/kad-table';

const columns: KADTableColumn[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'text', label: 'Text' },
	{ key: 'response', label: 'Response' },
	{ key: 'lastVerifiedAt', label: 'Last Verified' },
	{ key: 'createdAt', label: 'Created' },
	{
		key: 'actions',
		label: '',
		actions: [
			{ type: 'link', hrefProp: 'editUrl', label: 'Edit', requiredPermission: 'categories:update' },
			{ type: 'link', hrefProp: 'cluesUrl', label: 'View Clues', requiredPermission: 'categories:update' },
			{ type: 'link', hrefProp: 'verifyUrl', label: 'Verify', requiredPermission: 'categories:admin' },
		],
	},
];

export default async function Pages__Admin__Categories_Clues__Listing({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	const clues = await getCluesByCategoryId(params.categoryId, ctx.logger);

	const rows = clues.map(clue => ({
		...clue,
		editUrl: `/admin/categories/${clue.categoryId}/clues/${clue.id}/edit`,
		verifyUrl: `/admin/categories/${clue.categoryId}/clues/${clue.id}/verify`,
	}));

	return (
		<SetupLayout pageTitle={`Category ${params.categoryId} Clues`} ctx={ctx} currentBasePage="categories">
			<KADTable userPermissions={ctx.permissions} columns={columns} data={rows} />
		</SetupLayout>
	);
}
