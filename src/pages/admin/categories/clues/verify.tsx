import type { RequestInfo } from 'rwsdk/worker';
import { KADTable } from '@/components/design-system';
import VerificationForm from '@/forms/verification';
import SetupLayout from '@/layouts/setup';
import { getClueById } from '@/repositories';
import type { KADTableColumn } from '@/types';

const columns: KADTableColumn[] = [
	{ key: 'createdAt', label: 'Verified At' },
	{ key: 'createdBy', label: 'Verified By' },
];

export default async function Pages__admin__categories__clues__verify({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	const clue = await getClueById(params.clueId, ctx.logger);

	return (
		<SetupLayout ctx={ctx} currentBasePage="categories" pageTitle={`Verifications for ${clue.text}`}>
			<KADTable userPermissions={ctx.permissions} columns={columns} data={clue.verifications} />
			<VerificationForm verification={{ clueId: clue.id }} userPermissions={ctx.permissions} />
		</SetupLayout>
	);
}
