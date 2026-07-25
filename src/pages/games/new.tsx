import CategorySelector from '@/components/setup/category-selector';

export default async function Pages__Games__New() {
	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">New Game</h2>
				<p>Setup a new game</p>
				<CategorySelector />
			</main>
		</>
	);
}
