import type { RequestInfo } from 'rwsdk/worker';
import ClueForm from '@/forms/clue';
import SetupLayout from '@/layouts/setup';
import { getClueById } from '@/repositories';
import type { ClueFormInput } from '@/types';

export default async function Pages__admin__categories__clues__edit({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	const clueId = params.clueId;
	const categoryId = params.categoryId;
	const clue: ClueFormInput = clueId ? await getClueById(clueId, ctx.logger) : { categoryId, text: '', response: '' };

	const pageTitle = clueId ? `Edit ${clue.text}` : 'New Clue';

	return (
		<SetupLayout ctx={ctx} currentBasePage="categories" pageTitle={pageTitle}>
			<ClueForm clue={clue} userPermissions={ctx.permissions} />
		</SetupLayout>
	);
}
