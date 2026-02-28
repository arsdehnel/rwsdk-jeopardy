import Clue from './clue';

const Category = ({ category }: { category: { title: string; clues: any[] } }) => {
	const values = [200, 400, 600, 800, 1000];

	const toTitleCase = (str: string) => {
		return str
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	};

	const title = toTitleCase(category.title);

	return (
		<div className="jeopardy-category">
			<h2>{title}</h2>
			{values.map((value, index) => {
				const clue = category.clues[index];
				return <Clue key={clue.id} value={value} {...clue} />;
			})}
		</div>
	);
};

export default Category;
