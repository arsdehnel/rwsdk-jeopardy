import type { RequestInfo } from 'rwsdk/worker';
import { KADTable } from '@/components/design-system';
import { RegisterLayout } from '@/layouts';
import type { KADTableColumn } from '@/types/kad-table';
import { caughtError } from '../../../utils';
import { REGISTERED_STATES, UNREGISTERED_STATES } from './_states';

export default async function Pages__dev__games__register__index({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const unregisteredColumns: KADTableColumn[] = [
		{ key: 'takenSlots', label: 'Taken Slots' },
		{ key: 'hasHostPerms', label: 'Has Host Perms' },
		{ key: 'contestantCount', label: 'Contestant Count' },
		{
			key: 'actions',
			label: '',
			actions: [{ type: 'link', hrefProp: 'devUrl', label: 'View Dev Page', requiredPermission: '__controls:read' }],
		},
	];

	const unregisteredRows = UNREGISTERED_STATES.map(state => {
		const [takenSlots, hasHostPerms, contestantCount] = state.label.split('|');
		return {
			label: state.label,
			takenSlots,
			hasHostPerms,
			contestantCount,
			devUrl: `/dev/games/register/${state.slug}`,
		};
	});

	const registeredColumns: KADTableColumn[] = [
		{ key: 'label', label: 'Label' },
		{
			key: 'actions',
			label: '',
			actions: [{ type: 'link', hrefProp: 'devUrl', label: 'View Dev Page', requiredPermission: '__controls:read' }],
		},
	];

	const registeredRows = REGISTERED_STATES.map(state => {
		return {
			label: state.label,
			devUrl: `/dev/games/register/${state.slug}`,
		};
	});

	try {
		return (
			<RegisterLayout pageTitle="Dev: Register States" currentBasePage="dev" ctx={ctx}>
				<h3>Unregistered States</h3>
				<p>These are all the possible states for a user that has not yet registered.</p>
				<KADTable columns={unregisteredColumns} data={unregisteredRows} userPermissions={ctx.permissions} />
				<h3>Registered States</h3>
				<p>Once a user registers they have fewer variants, these are what they might see.</p>
				<KADTable columns={registeredColumns} data={registeredRows} userPermissions={ctx.permissions} />
			</RegisterLayout>
		);
	} catch (err) {
		return caughtError(err, ctx.logger);
	}
}
