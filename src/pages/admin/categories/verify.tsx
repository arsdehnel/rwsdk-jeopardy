import type { RequestInfo } from 'rwsdk/worker';
import { KADTable } from '@/components/design-system';
import VerificationForm from '@/forms/verification';
import SetupLayout from '@/layouts/setup';
import { getCategoryById } from '@/repositories';
import type { KADTableColumn } from '@/types';

const columns: KADTableColumn[] = [
	{ key: 'createdAt', label: 'Verified At' },
	{ key: 'createdBy', label: 'Verified By' },
];

export default async function Pages__admin__categories__verify({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	const category = await getCategoryById(params.categoryId, ctx.logger);

	return (
		<SetupLayout ctx={ctx} currentBasePage="categories" pageTitle={`Verifications for ${category.name}`}>
			<KADTable userPermissions={ctx.permissions} columns={columns} data={category.verifications} />
			<VerificationForm verification={{ categoryId: category.id }} userPermissions={ctx.permissions} />
		</SetupLayout>
	);
}
