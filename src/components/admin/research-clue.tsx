'use client';
import { useState } from 'react';
import { researchClue } from '@/actions/clues';
import { KADButton } from '@/components/design-system';
import type { Permission } from '@/types';

export function ResearchClue({ clueId, userPermissions }: { clueId: string; userPermissions: Permission[] }): React.ReactNode {
	const [researchState, setResearchState] = useState<string[]>();
	const [errors, setErrors] = useState<string>();
	const [pending, setPending] = useState<boolean>(false);

	const triggerResearchClue = async (): Promise<void> => {
		setPending(true);
		setErrors(undefined);
		const researchResult = await researchClue(clueId);
		if (researchResult.errors) {
			setErrors(JSON.stringify(researchResult.errors));
		}
		setResearchState(researchResult.data);
		setPending(false);
	};

	return (
		<>
			<p>{pending ? <span>Pending, might take 30 seconds or so, please be patient.</span> : null}</p>
			{errors && <p>{JSON.stringify(errors)}</p>}
			<div className="btn-group">
				<KADButton
					label={researchState ? 'Refresh Research' : 'Research Clue'}
					userPermissions={userPermissions}
					requiredPermission="clues:research"
					onClick={triggerResearchClue}
				/>
			</div>
			{researchState && (
				<ul>
					{researchState.map(url => {
						return (
							<li key={url}>
								<a href={url}>{url}</a>
							</li>
						);
					})}
				</ul>
			)}
		</>
	);
}
