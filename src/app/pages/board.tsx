import categories from '@/categories';
import Category from '../components/category';

function Board() {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<Category key={category.id} category={category} />
			))}
		</div>
	);
}

export default Board;
