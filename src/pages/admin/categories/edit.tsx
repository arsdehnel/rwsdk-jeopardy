import type { RequestInfo } from 'rwsdk/worker';
import CategoryForm from '@/forms/category';
import { DefaultLayout } from '@/layouts';
import { getCategoryById } from '@/repositories';
import type { CategoryFormInput } from '@/types';

export default async function Pages__admin__categories__edit({ ctx, params }: RequestInfo): Promise<React.JSX.Element> {
	const categoryId = params.categoryId;
	const category: CategoryFormInput = categoryId ? await getCategoryById(categoryId, ctx.logger) : { name: '' };

	const pageTitle = categoryId ? `Edit ${category.name}` : 'New Category';

	return (
		<DefaultLayout ctx={ctx} currentBasePage="admin" pageTitle={pageTitle}>
			<CategoryForm category={category} userPermissions={ctx.permissions} />
		</DefaultLayout>
	);
}
