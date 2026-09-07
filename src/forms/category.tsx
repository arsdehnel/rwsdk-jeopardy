'use client';
import { Form } from 'radix-ui';
import { useState } from 'react';
import { saveCategory } from '@/actions/categories';
import { categoriesSchemas } from '@/schemas';
import type { ActionState, CategoryDBRead, CategoryFormInput, Permission } from '@/types';
import { useAppForm } from './setup/context';
import { FormDevtools } from './setup/FormDevtools';

export default function CategoryForm({
	category,
	userPermissions,
}: {
	category: CategoryFormInput;
	userPermissions: Permission[];
}): React.ReactNode {
	const [formState, setFormState] = useState<ActionState<CategoryDBRead>>();

	const form = useAppForm({
		formId: 'category',
		defaultValues: category,
		validators: {
			onBlur: categoriesSchemas.form,
		},
		onSubmit: async ({ value }: { value: CategoryFormInput }): Promise<void> => {
			setFormState(await saveCategory(value));
		},
	});

	return (
		<>
			<Form.Root
				className="rz-form"
				onSubmit={(e: React.FormEvent): void => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				{/* biome-ignore-start lint/nursery/useExplicitType: TanStack Form field render prop — parameter type is a deep internal generic impractical to annotate */}
				<form.AppField name="name">{(field): React.ReactNode => <field.TextInput label="Name" required />}</form.AppField>
				{/* biome-ignore-end lint/nursery/useExplicitType: TanStack Form field render prop — parameter type is a deep internal generic impractical to annotate */}
				{formState?.errors?._form && <p className="error">{formState.errors._form[0]}</p>}
				{formState?.success && <p className="success">Category saved.</p>}
				<form.AppForm>
					<form.SubmitButton label="Save Category" userPermissions={userPermissions} requiredPermission="categories:admin" />
				</form.AppForm>
			</Form.Root>
			<FormDevtools />
		</>
	);
}
