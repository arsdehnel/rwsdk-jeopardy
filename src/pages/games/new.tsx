import type { RequestInfo } from 'rwsdk/worker';
import CategorySelector from '@/components/setup/category-selector';
import { getCategories } from '@/repositories';

export default async function Pages__Games__New({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const categories = await getCategories(ctx.logger);
	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">New Game</h2>
				<p>Setup a new game</p>
				<CategorySelector categories={categories} />
			</main>
		</>
	);
}
