import animalKingdom from './categories/animal-kingdom';
import growingUpHealthy from './categories/growing-up-healthy';
import lifeSkills from './categories/life-skills-101';
import makingGoodChoices from './categories/making-good-choices';
import naturalWonders from './categories/natural-wonders';
import worldGeography from './categories/world-geography';
import type { Category } from './types';

export default function getCategories(): Category[] {
	const rawCategories = [animalKingdom, lifeSkills, worldGeography, growingUpHealthy, naturalWonders, makingGoodChoices];
	const categories: Category[] = rawCategories.map(ctgry => {
		return {
			...ctgry,
			clues: ctgry.clues.map((clue, idx) => {
				return {
					...clue,
					value: (idx + 1) * 100,
				};
			}),
		};
	});
	return categories;
}
