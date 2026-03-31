'use client';
import classnames from 'classnames';
import Buzzer from '@/components/buzzer';
import ClueSelect from '@/components/clue-select';
import type { Category, Clue } from '@/types';

export default function ContestantView({
	selectClue,
	selectedClue,
	categories,
	buzzerQueue,
	sessionId,
	buzzIn,
	usedClueIds,
}: {
	selectClue: (clue: Clue) => void;
	selectedClue: Clue | null;
	categories: Category[];
	buzzerQueue: string[];
	sessionId: string;
	buzzIn: (contestantSessionId: string) => void;
	usedClueIds: string[];
}) {
	const mode = selectedClue ? 'buzzer' : 'clue-select';

	return (
		<div className={classnames('view-contestant', `view-contestant--${mode}`)}>
			{selectedClue === null ? (
				<ClueSelect selectClue={selectClue} categories={categories} usedClueIds={usedClueIds} />
			) : (
				<Buzzer buzzIn={buzzIn} buzzerQueue={buzzerQueue} sessionId={sessionId} />
			)}
		</div>
	);
}
