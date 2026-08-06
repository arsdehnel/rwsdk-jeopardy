import { defineRelations } from 'drizzle-orm';
import { categories } from './categories';
import { clues } from './clues';
import { credentials } from './credentials';
import { gameStageCategories } from './game-stage-categories';
import { gameStages } from './game-stages';
import { games } from './games';
import { users } from './users';
import { verifications } from './verifications';

export default defineRelations(
	{ credentials, users, clues, categories, games, gameStages, gameStageCategories, verifications },
	r => ({
		users: {
			credentials: r.many.credentials({
				from: r.users.id,
				to: r.credentials.userId,
				where: {
					deletedAt: { isNull: true },
				},
			}),
		},
		credentials: {
			owner: r.one.users({
				from: r.credentials.userId,
				to: r.users.id,
				optional: false,
			}),
		},
		categories: {
			clues: r.many.clues({
				from: r.categories.id,
				to: r.clues.categoryId,
				where: {
					deletedAt: { isNull: true },
				},
			}),
			verification: r.one.verifications({
				from: r.categories.id,
				to: r.verifications.categoryId,
				optional: false,
			}),
		},
		clues: {
			category: r.one.categories({
				from: r.clues.categoryId,
				to: r.categories.id,
				optional: false,
			}),
			verification: r.one.verifications({
				from: r.clues.id,
				to: r.verifications.clueId,
				optional: false,
			}),
		},
		games: {
			stages: r.many.gameStages({
				from: r.games.id,
				to: r.gameStages.gameId,
				where: {
					deletedAt: { isNull: true },
				},
			}),
		},
		gameStages: {
			game: r.one.games({
				from: r.gameStages.gameId,
				to: r.games.id,
				optional: false,
			}),
			categories: r.many.gameStageCategories({
				from: r.gameStages.id,
				to: r.gameStageCategories.gameStageId,
				where: {
					deletedAt: { isNull: true },
				},
			}),
		},
		gameStageCategories: {
			stage: r.one.gameStages({
				from: r.gameStageCategories.gameStageId,
				to: r.gameStages.id,
				optional: false,
			}),
		},
	}),
);
