'use client';
import type { TCategory } from '@/types';
import Category from './category';

export default function Board({ categories }: { categories: TCategory[] }) {
	return (
		<div className="jeopardy-board">
			{categories.map(category => (
				<Category key={category.id} category={category} />
			))}
		</div>
	);
}
