import type { RequestInfo } from 'rwsdk/worker';
import KADTable from '@/components/design-system/table/kad-table';
import SetupLayout from '@/layouts/setup';
import { getGamesByOwnerId } from '@/repositories';
import type { KADTableColumn } from '@/types/kad-table';

const columns: KADTableColumn[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'phase', label: 'Phase' },
	{ key: 'createdAt', label: 'Created' },
	{
		key: 'actions',
		label: '',
		actions: [
			{ type: 'link', hrefProp: 'editUrl', label: 'Edit', requiredPermission: 'games:update' },
			{ type: 'link', hrefProp: 'registrationUrl', label: 'Registration', requiredPermission: 'games:update' },
			{ type: 'link', hrefProp: 'playUrl', label: 'Play', requiredPermission: 'games:update' },
		],
	},
];

export default async function Pages__Games__Listing({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const games = await getGamesByOwnerId(userId, ctx.logger);
	const rows = games.map(g => ({
		...g,
		editUrl: `/games/${g.id}/edit`,
		registrationUrl: `/games/${g.id}/registration`,
		playUrl: `/games/${g.id}/play`,
	}));

	return (
		<SetupLayout pageTitle="My Games" ctx={ctx} currentBasePage="games">
			<KADTable userPermissions={ctx.permissions} columns={columns} data={rows} />
		</SetupLayout>
	);
}
