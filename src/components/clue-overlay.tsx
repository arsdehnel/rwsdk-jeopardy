'use client';

import type { Clue } from '@/types';

const ClueOverlay = ({ selectedClue }: { selectedClue: Clue | null }) => {
	if (!selectedClue) {
		return null;
	}

	return (
		<div className="clue-overlay">
			<div className="clue-content">{selectedClue && <p>{selectedClue.clue}</p>}</div>
		</div>
	);
};

export default ClueOverlay;
