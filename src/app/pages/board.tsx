// import categories from '@/categories';
import getCategories from '@/categories';
import Category from '../components/category';

function Board() {
	const categories = getCategories();
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<Category key={category.id} category={category} />
			))}
		</div>
	);
}

export default Board;
