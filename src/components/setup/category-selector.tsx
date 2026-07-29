'use client';
import { useState } from 'react';
import { generateCategory, saveCategory } from '@/actions/categories';
import { KADButton } from '@/components/design-system';
import type { CategoryDBRead, GeneratedCategory, Permission } from '@/types';
import ViewCategory from './view-category';

export default function CategorySelector({
	categories,
	userPermissions,
}: {
	categories: CategoryDBRead[];
	userPermissions: Permission[];
}): React.ReactNode {
	const [generatedCategory, setGeneratedCategory] = useState<GeneratedCategory>();
	const [errors, setErrors] = useState<string>();
	const [pending, setPending] = useState<boolean>(false);

	const triggerCategoryGeneration = async (): Promise<void> => {
		setPending(true);
		setErrors(undefined);
		const generationResult = await generateCategory();
		if (generationResult.errors) {
			setErrors(JSON.stringify(generationResult.errors));
		}
		setGeneratedCategory(generationResult.data);
		setPending(false);
	};

	const saveGeneratedCategory = async (): Promise<void> => {
		if (!generatedCategory) {
			setErrors(`There is no generated category, please generate a category first`);
		}
		setPending(true);
		// biome-ignore lint/style/noNonNullAssertion: guaranteed by the !generatedCategory above
		const saveResult = await saveCategory(generatedCategory!);
		if (saveResult.errors) {
			setErrors(JSON.stringify(saveResult.errors));
		}
		console.log(`Save result: ${JSON.stringify(saveResult, null, 4)}`);
		setPending(false);
		setGeneratedCategory(undefined);
	};

	return (
		<>
			<p>
				Existing Categories:
				<ul>
					{categories.map(c => {
						return <li key={c.id}>{c.name}</li>;
					})}
				</ul>
			</p>
			<p>{pending ? <span>Pending, might take 30 seconds or so, please be patient.</span> : null}</p>
			{errors && <p>{JSON.stringify(errors)}</p>}
			{generatedCategory && (
				<div className="generated-category">
					{generatedCategory && <ViewCategory {...generatedCategory} />}
					<button type="button" onClick={saveGeneratedCategory}>
						Save Generated Category
					</button>
				</div>
			)}

			<div className="btn-group">
				<KADButton
					label="Generate Category"
					userPermissions={userPermissions}
					requiredPermission="categories:generate"
					onClick={triggerCategoryGeneration}
				/>
			</div>
		</>
	);
}
