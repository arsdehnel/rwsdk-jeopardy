'use client';
import { Form } from 'radix-ui';
import { useState } from 'react';
import { saveVerification } from '@/actions/verifications';
import { verificationsSchemas } from '@/schemas';
import type { ActionState, Permission, VerificationDBRead, VerificationFormInput } from '@/types';
import { useAppForm } from './setup/context';
import { FormDevtools } from './setup/FormDevtools';

export default function VerificationForm({
	verification,
	userPermissions,
}: {
	verification: VerificationFormInput;
	userPermissions: Permission[];
}): React.ReactNode {
	const [formState, setFormState] = useState<ActionState<VerificationDBRead>>();

	const form = useAppForm({
		formId: 'verification',
		defaultValues: verification,
		validators: {
			onBlur: verificationsSchemas.form,
		},
		onSubmit: async ({ value }: { value: VerificationFormInput }): Promise<void> => {
			setFormState(await saveVerification(value));
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
				{formState?.errors?._form && <p className="error">{formState.errors._form[0]}</p>}
				{formState?.success && <p className="success">Verification saved.</p>}
				<form.AppForm>
					<form.SubmitButton
						label="Save Verification"
						userPermissions={userPermissions}
						requiredPermission="verifications:create"
					/>
				</form.AppForm>
			</Form.Root>
			<FormDevtools />
		</>
	);
}
