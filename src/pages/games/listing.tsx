import type { RequestInfo } from 'rwsdk/worker';
import { KADTable } from '@/components/design-system';
import { DefaultLayout } from '@/layouts';
import { getGamesByOwnerId } from '@/repositories';
import { gamesSchemas } from '@/schemas';
import type { KADTableColumn } from '@/types/kad-table';

const columns: KADTableColumn[] = [
	{ key: 'id', label: 'ID' },
	{ key: 'phase', label: 'Phase' },
	{ key: 'createdAt', label: 'Created' },
	{ key: 'stageCount', label: 'Stages' },
	{ key: 'categoryCount', label: 'Category Count (all stages)' },
	{ key: 'isRegisterable', label: 'Is Registerable' },
	{ key: 'isRegisterableErrors', label: 'Is Registerable Errors' },
	{ key: 'isPlayable', label: 'Is Playable' },
	{ key: 'isPlayableErrors', label: 'Is Playable Errors' },
	{
		key: 'actions',
		label: '',
		actions: [
			{ type: 'link', hrefProp: 'setupUrl', label: 'Setup', requiredPermission: 'games:update' },
			{ type: 'link', hrefProp: 'viewUrl', label: 'View', requiredPermission: 'games:update' },
		],
	},
];

export default async function Pages__games__listing({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	const games = await getGamesByOwnerId(userId, ctx.logger);
	const rows = games.map(g => {
		const stageCount = g.stages.length;
		const categoryCount = g.stages.reduce((prev, stage) => {
			prev = prev + stage.categories.length;
			return prev;
		}, 0);
		const { success: isRegisterable, error: isRegisterableValidationErrors } = gamesSchemas.isRegisterable.safeParse(g);
		const isRegisterableErrors = isRegisterable ? '' : isRegisterableValidationErrors.flatten();
		const { success: isPlayable, error: isPlayableValidationErrors } = gamesSchemas.isPlayable.safeParse(g);
		const isPlayableErrors = isPlayable ? '' : isPlayableValidationErrors.flatten();
		return {
			...g,
			stageCount,
			categoryCount,
			isRegisterable: isRegisterable,
			isRegisterableErrors: JSON.stringify(isRegisterableErrors),
			isPlayable: isPlayable,
			isPlayableErrors: JSON.stringify(isPlayableErrors),
			setupUrl: `/games/${g.id}/setup`,
			viewUrl: `/games/${g.id}/view`,
		};
	});

	return (
		<DefaultLayout pageTitle="My Games" ctx={ctx} currentBasePage="games">
			<KADTable userPermissions={ctx.permissions} columns={columns} data={rows} />
		</DefaultLayout>
	);
}
