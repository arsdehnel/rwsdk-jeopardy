'use client';
import ClueSelect from '@/app/components/clue-select';
import getCategories from '@/categories';
import type { Clue } from '@/types';

export default function ClueSelectStyling() {
	const selectClue = (clue: Clue) => {
		console.log(clue);
	};
	const categories = getCategories();
	const usedClueIds: string[] = [];
	categories.forEach(cat => {
		cat.clues.forEach(clue => {
			if (Math.random() > 0.5) {
				usedClueIds.push(clue.id);
			}
		});
	});
	return <ClueSelect selectClue={selectClue} categories={categories} usedClueIds={usedClueIds} />;
}
