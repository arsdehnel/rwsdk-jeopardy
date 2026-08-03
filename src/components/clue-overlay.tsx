'use client';

import type { ClueInGame } from '@/types';

const ClueOverlay = ({ selectedClue }: { selectedClue: ClueInGame | null }): React.ReactNode => {
	if (!selectedClue) {
		return null;
	}

	return (
		<div className="clue-overlay">
			<div className="clue-content">{selectedClue && <p>{selectedClue.text}</p>}</div>
		</div>
	);
};

export default ClueOverlay;
