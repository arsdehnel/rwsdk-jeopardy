'use client';
import { useState } from 'react';
import { replaceClue } from '@/actions/clues';
import { KADButton } from '@/components/design-system';
import type { Permission, ReplacedClue } from '@/types';

export function ReplaceClue({ clueId, userPermissions }: { clueId: string; userPermissions: Permission[] }): React.ReactNode {
	const [replacementState, setReplacementState] = useState<ReplacedClue>();
	const [errors, setErrors] = useState<string>();
	const [pending, setPending] = useState<boolean>(false);

	const triggerReplaceClue = async (): Promise<void> => {
		setPending(true);
		setErrors(undefined);
		const replaceResult = await replaceClue(clueId);
		if (replaceResult.errors) {
			setErrors(JSON.stringify(replaceResult.errors));
		}
		setReplacementState(replaceResult.data);
		setPending(false);
	};

	return (
		<>
			<p>{pending ? <span>Pending, might take 30 seconds or so, please be patient.</span> : null}</p>
			{errors && <p>{JSON.stringify(errors)}</p>}
			<div className="btn-group">
				<KADButton
					label={replacementState ? 'Try Another Replacement' : 'Replace Clue'}
					userPermissions={userPermissions}
					requiredPermission="clues:replace"
					onClick={triggerReplaceClue}
				/>
			</div>
			{replacementState && (
				<>
					<p>Clue: {replacementState.text}</p>
					<p>Response: {replacementState.response}</p>
				</>
			)}
		</>
	);
}
