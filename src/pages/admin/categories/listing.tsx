import type { RequestInfo } from 'rwsdk/worker';
import KADTable from '@/components/design-system/table/kad-table';
import { DefaultLayout } from '@/layouts';
import { getCategories } from '@/repositories';
import type { KADTableColumn } from '@/types/kad-table';

const columns: KADTableColumn[] = [
	{ key: 'name', label: 'Name' },
	{ key: 'idFirst8', label: 'ID (First 8)' },
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

export default async function Pages__Admin__Categories__Listing({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const categories = await getCategories(ctx.logger);

	const rows = categories.map(ctgry => ({
		...ctgry,
		idFirst8: ctgry.id.substring(0, 8),
		editUrl: `/admin/categories/${ctgry.id}/edit`,
		cluesUrl: `/admin/categories/${ctgry.id}/clues`,
		verifyUrl: `/admin/categories/${ctgry.id}/verify`,
	}));

	return (
		<DefaultLayout pageTitle="Categories" ctx={ctx} currentBasePage="categories">
			<KADTable userPermissions={ctx.permissions} columns={columns} data={rows} />
		</DefaultLayout>
	);
}
