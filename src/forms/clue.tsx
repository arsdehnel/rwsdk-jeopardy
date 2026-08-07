'use client';
import { Form } from 'radix-ui';
import { useState } from 'react';
import { saveClue } from '@/actions/clues';
import { cluesSchemas } from '@/schemas';
import type { ActionState, ClueDBRead, ClueFormInput, Permission } from '@/types';
import { useAppForm } from './setup/context';
import { FormDevtools } from './setup/FormDevtools';

export default function ClueForm({
	clue,
	userPermissions,
}: {
	clue: ClueFormInput;
	userPermissions: Permission[];
}): React.ReactNode {
	const [formState, setFormState] = useState<ActionState<ClueDBRead>>();

	const form = useAppForm({
		formId: 'clue',
		defaultValues: clue,
		validators: {
			onBlur: cluesSchemas.form,
		},
		onSubmit: async ({ value }: { value: ClueFormInput }): Promise<void> => {
			setFormState(await saveClue(value));
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
				<form.AppField name="text">{(field): React.ReactNode => <field.TextareaInput label="Text" required />}</form.AppField>
				<form.AppField name="response">
					{(field): React.ReactNode => <field.TextareaInput label="Response" required />}
				</form.AppField>
				<form.AppField name="position">
					{(field): React.ReactNode => <field.NumberInput label="Position" required />}
				</form.AppField>
				{/* biome-ignore-end lint/nursery/useExplicitType: TanStack Form field render prop — parameter type is a deep internal generic impractical to annotate */}
				{formState?.errors?._form && <p className="error">{formState.errors._form[0]}</p>}
				{formState?.success && <p className="success">Clue saved.</p>}
				<form.AppForm>
					<form.SubmitButton label="Save Clue" userPermissions={userPermissions} requiredPermission="clues:admin" />
				</form.AppForm>
			</Form.Root>
			<FormDevtools />
		</>
	);
}
