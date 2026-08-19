import type { RequestInfo } from 'rwsdk/worker';
import KADTable from '@/components/design-system/table/kad-table';
import { DefaultLayout } from '@/layouts';
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
			{ type: 'link', hrefProp: 'registerUrl', label: 'Register', requiredPermission: 'games:update' },
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
		registerUrl: `/games/${g.id}/register`,
		playUrl: `/games/${g.id}/play`,
	}));

	return (
		<DefaultLayout pageTitle="My Games" ctx={ctx} currentBasePage="games">
			<KADTable userPermissions={ctx.permissions} columns={columns} data={rows} />
		</DefaultLayout>
	);
}
