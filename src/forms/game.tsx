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
	game?: GameWithEverything;
	categoryOptions: { value: string; label: string }[];
	userPermissions: Permission[];
}): React.ReactNode {
	const [formState, setFormState] = useState<ActionState<GameWithEverything>>();

	const phaseOptions = gamePhaseEnum.map(phase => ({ value: phase, label: phase }));
	const stageOptions = gameStageEnum.map(stage => ({ value: stage, label: stage }));
	const gameWithFlattedCategories: GameFormInput | undefined = {
		...game,
		stages:
			game?.stages.map(stage => ({
				...stage,
				categories: stage.categories.map(c => c.categoryId),
			})) ?? [],
	};

	const defaultGame: GameFormInput = {
		phase: 'SETUP',
		stages: [
			{
				stage: 'SINGLE',
				categories: [],
			},
		],
	};

	const requiredPermission = game?.id ? 'games:update' : 'games:create';

	const form = useAppForm({
		formId: 'game',
		defaultValues: gameWithFlattedCategories ?? defaultGame,
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
				<form.AppField name="stages" mode="array">
					{(stagesField): React.ReactNode => (
						<div>
							{stagesField.state.value?.map((stage, idx) => (
								<fieldset key={stage.id || `new-${idx}`}>
									<form.AppField name={`stages[${idx}].stage`}>
										{(stageField): React.ReactNode => (
											<>
												<legend>
													Stage: <b>{stageField.state.value ? `${stageField.state.value} Jeopardy` : 'No Stage Set'}</b>
												</legend>
												<stageField.SelectInput label="Stage" options={stageOptions} required />
												<form.AppField name={`stages[${idx}].categories`}>
													{(field): React.ReactNode => (
														<field.CheckboxGroupInput label="Categories" required options={categoryOptions} />
													)}
												</form.AppField>
											</>
										)}
									</form.AppField>
									<button type="button" onClick={(): void => stagesField.removeValue(idx)}>
										Remove Stage
									</button>
								</fieldset>
							))}
							<button
								type="button"
								onClick={(): void =>
									stagesField.pushValue({
										stage: 'SINGLE',
										categories: [],
									})
								}
							>
								Add Stage
							</button>
						</div>
					)}
				</form.AppField>
				<form.AppField name="phase">
					{(field): React.ReactNode => <field.SelectInput label="Phase" options={phaseOptions} required />}
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
