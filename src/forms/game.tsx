'use client';
import { Form } from 'radix-ui';
import { useState } from 'react';
import { saveGame } from '@/actions/games';
import { gamePhaseEnum, gameStageEnum } from '@/models';
import { gamesSchemas } from '@/schemas';
import type { ActionState, GameFormInput, GameWithEverything, Permission } from '@/types';
import { useAppForm } from './setup/context';
import { FormDevtools } from './setup/FormDevtools';

export default function GameForm({
	game,
	categoryOptions,
	userPermissions,
}: {
	game?: GameFormInput;
	categoryOptions: { value: string; label: string }[];
	userPermissions: Permission[];
}): React.ReactNode {
	const [formState, setFormState] = useState<ActionState<GameWithEverything>>();

	const phaseOptions = gamePhaseEnum.map(phase => ({ value: phase, label: phase }));
	const stageOptions = gameStageEnum.map(stage => ({ value: stage, label: stage }));

	const defaultGame: GameFormInput = {
		phase: 'SETUP',
		stage: 'SINGLE',
		categories: [],
	};

	const requiredPermission = game?.id ? 'games:update' : 'games:create';

	const form = useAppForm({
		formId: 'ingredient-season',
		defaultValues: game ?? defaultGame,
		validators: {
			onBlur: gamesSchemas.form,
		},
		onSubmit: async ({ value }: { value: GameFormInput }): Promise<void> => {
			setFormState(await saveGame(value));
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
				<form.AppField name="stage">
					{(field): React.ReactNode => <field.SelectInput label="Stage" options={stageOptions} required />}
				</form.AppField>
				<form.AppField name="phase">
					{(field): React.ReactNode => <field.SelectInput label="Phase" options={phaseOptions} required />}
				</form.AppField>
				<form.AppField name="categories">
					{(field): React.ReactNode => <field.CheckboxGroupInput label="Categories" required options={categoryOptions} />}
				</form.AppField>

				{/* biome-ignore-end lint/nursery/useExplicitType: TanStack Form field render prop — parameter type is a deep internal generic impractical to annotate */}
				{formState?.errors?._form && <p className="error">{formState.errors._form[0]}</p>}
				{formState?.success && <p className="success">Game saved.</p>}
				<form.AppForm>
					<form.SubmitButton label="Save Game" userPermissions={userPermissions} requiredPermission={requiredPermission} />
				</form.AppForm>
			</Form.Root>
			<FormDevtools />
		</>
	);
}
