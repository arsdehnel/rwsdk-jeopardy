'use client';

import type { Clue, ClueState } from '@/types';

const ClueOverlay = ({ selectedClue, clueState }: { selectedClue: Clue | null; clueState: ClueState }) => {
	if (clueState === 'initial' || !selectedClue) {
		return null;
	}

	return (
		<div className="clue-overlay">
			<div className="clue-content">{clueState === 'clue' ? <p>{selectedClue.clue}</p> : <p>{selectedClue.response}</p>}</div>
		</div>
	);
};

export default ClueOverlay;
