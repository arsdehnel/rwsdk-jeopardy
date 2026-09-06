'use client';
import { useState } from 'react';
import { saveSortedClues } from '@/actions/clues';
import { KADButton, KADSortableList } from '@/components/design-system';
import type { ClueDBRead, Permission } from '@/types';

export function SortClues({ clues, userPermissions }: { clues: ClueDBRead[]; userPermissions: Permission[] }): React.ReactNode {
	const [orderedClues, setOrderedClues] = useState<ClueDBRead[]>(clues);
	const [errors, setErrors] = useState<string>();
	const [pending, setPending] = useState<boolean>(false);
	const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

	const submitOrderedClues = async (): Promise<void> => {
		setPending(true);
		setErrors(undefined);
		const sortedCluesResult = await saveSortedClues(orderedClues.map(c => ({ id: c.id, position: c.position })));
		if (sortedCluesResult.errors) {
			setErrors(JSON.stringify(sortedCluesResult.errors));
		}
		if (sortedCluesResult.data) {
			setOrderedClues(sortedCluesResult.data);
			setSavedSuccess(true);
		}
		setPending(false);
	};

	return (
		<>
			<KADSortableList
				items={orderedClues}
				renderItem={(clue: ClueDBRead): React.ReactNode => (
					<>
						<p>{clue.text}</p>
						<p>{clue.response}</p>
					</>
				)}
				onChange={setOrderedClues}
			/>
			<p>{pending ? <span>Saving...</span> : null}</p>
			{errors && <p>{JSON.stringify(errors)}</p>}
			{savedSuccess && <p>Clues sorted successfully!</p>}
			<div className="btn-group">
				<KADButton
					label="Save Sorted Clues"
					userPermissions={userPermissions}
					requiredPermission="clues:admin"
					onClick={submitOrderedClues}
				/>
			</div>
		</>
	);
}
