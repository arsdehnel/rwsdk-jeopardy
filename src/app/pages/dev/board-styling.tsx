import Board from '@/app/components/board';
import getCategories from '@/categories';

export default function BoardStyling() {
	const categories = getCategories();
	const usedClueIds: string[] = [];
	categories.forEach(cat => {
		cat.clues.forEach(clue => {
			if (Math.random() > 0.5) {
				usedClueIds.push(clue.id);
			}
		});
	});
	return <Board categories={categories} usedClueIds={usedClueIds} />;
}
