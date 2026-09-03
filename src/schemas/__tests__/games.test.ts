import { describe, expect, it } from 'vitest';
import { gamesSchemas } from '../games';

// IDs reused across helpers so relational fields are internally consistent
const GAME_ID = crypto.randomUUID();
const GAME_STAGE_ID = crypto.randomUUID();
const USER_ID = crypto.randomUUID();

// Minimal GameStageCategoryDBRead — schema only checks array length, not shape
const makeCategory = () => ({
	id: crypto.randomUUID(),
	gameStageId: GAME_STAGE_ID,
	categoryId: crypto.randomUUID(),
	position: 0,
	createdAt: '2024-01-01',
	createdBy: USER_ID,
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
});

// GameStageDBRead & { categories: GameStageCategoryDBRead[] }
const makeStage = (stage: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'FINAL', categoryCount: number) => ({
	id: GAME_STAGE_ID,
	gameId: GAME_ID,
	stage,
	categories: Array.from({ length: categoryCount }, makeCategory),
	createdAt: '2024-01-01',
	createdBy: USER_ID,
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
});

// GameContestantDBRead — name is nullable in the DB
const makeContestant = (name: string | null = 'Alice') => ({
	id: crypto.randomUUID(),
	gameId: GAME_ID,
	sessionId: crypto.randomUUID(),
	userId: null,
	name,
	score: null,
	createdAt: '2024-01-01',
	createdBy: USER_ID,
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
});

// Minimal valid GameWithEverything for isRegisterable
const validRegisterable = {
	id: GAME_ID,
	ownerId: USER_ID,
	phase: 'SETUP' as const,
	currentStage: 'SINGLE' as const,
	hostUserId: null,
	displaySessionId: null,
	activeContestantSessionId: null,
	usedClueIds: null,
	createdAt: '2024-01-01',
	createdBy: USER_ID,
	updatedAt: null,
	updatedBy: null,
	deletedAt: null,
	deletedBy: null,
	stages: [makeStage('SINGLE', 6)],
	contestants: [],
};

const HOST_USER_ID = crypto.randomUUID();
const DISPLAY_SESSION_ID = crypto.randomUUID();

// Minimal valid GameWithEverything for isPlayable
const validPlayable = {
	...validRegisterable,
	hostUserId: HOST_USER_ID,
	displaySessionId: DISPLAY_SESSION_ID,
	contestants: [makeContestant('Alice'), makeContestant(null)],
};

describe('gamesSchemas.isRegisterable', () => {
	describe('valid games', () => {
		it('passes for a single standard stage with 6 categories', () => {
			expect(gamesSchemas.isRegisterable.safeParse(validRegisterable).success).toBe(true);
		});

		it('passes for multiple different standard stages each with 6 categories', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('SINGLE', 6), makeStage('DOUBLE', 6)],
			});
			expect(result.success).toBe(true);
		});

		it('passes for a FINAL stage with 1 category', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('FINAL', 1)],
			});
			expect(result.success).toBe(true);
		});

		it('passes for a mix of standard and FINAL stages', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('SINGLE', 6), makeStage('FINAL', 1)],
			});
			expect(result.success).toBe(true);
		});
	});

	describe('stage category count', () => {
		it('fails when a standard stage has fewer than 6 categories', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('SINGLE', 5)],
			});
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('categories'));
			expect(issue?.message).toContain('6 categories');
		});

		it('fails when a standard stage has more than 6 categories', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('SINGLE', 7)],
			});
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('categories'));
			expect(issue?.message).toContain('6 categories');
		});

		it('fails when the FINAL stage has more than 1 category', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('FINAL', 6)],
			});
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('categories'));
			expect(issue?.message).toContain('1 category');
		});

		it('fails when the FINAL stage has no categories', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('FINAL', 0)],
			});
			expect(result.success).toBe(false);
		});
	});

	describe('stage uniqueness', () => {
		it('fails when the same stage type appears more than once', () => {
			const result = gamesSchemas.isRegisterable.safeParse({
				...validRegisterable,
				stages: [makeStage('SINGLE', 6), makeStage('SINGLE', 6)],
			});
			expect(result.success).toBe(false);
			expect(result.error?.issues[0].message).toContain('SINGLE');
		});
	});

	describe('stage count', () => {
		it('fails when there are no stages', () => {
			const result = gamesSchemas.isRegisterable.safeParse({ ...validRegisterable, stages: [] });
			expect(result.success).toBe(false);
			expect(result.error?.issues[0].message).toContain('at least one stage');
		});
	});

	describe('id validation', () => {
		it('fails when id is not a valid UUID', () => {
			const result = gamesSchemas.isRegisterable.safeParse({ ...validRegisterable, id: 'not-a-uuid' });
			expect(result.success).toBe(false);
		});
	});
});

describe('gamesSchemas.isPlayable', () => {
	describe('valid games', () => {
		it('passes for a fully configured game', () => {
			expect(gamesSchemas.isPlayable.safeParse(validPlayable).success).toBe(true);
		});

		it('passes when a contestant has a null name', () => {
			const result = gamesSchemas.isPlayable.safeParse({
				...validPlayable,
				contestants: [makeContestant(null), makeContestant(null)],
			});
			expect(result.success).toBe(true);
		});
	});

	describe('inherits isRegisterable stage validation', () => {
		it('fails when a stage has the wrong number of categories', () => {
			const result = gamesSchemas.isPlayable.safeParse({
				...validPlayable,
				stages: [makeStage('SINGLE', 5)],
			});
			expect(result.success).toBe(false);
		});

		it('fails when there are duplicate stages', () => {
			const result = gamesSchemas.isPlayable.safeParse({
				...validPlayable,
				stages: [makeStage('SINGLE', 6), makeStage('SINGLE', 6)],
			});
			expect(result.success).toBe(false);
		});
	});

	describe('host and display validation', () => {
		it('fails when hostUserId is missing', () => {
			const { hostUserId: _, ...withoutHost } = validPlayable;
			expect(gamesSchemas.isPlayable.safeParse(withoutHost).success).toBe(false);
		});

		it('fails when hostUserId is not a valid UUID', () => {
			const result = gamesSchemas.isPlayable.safeParse({ ...validPlayable, hostUserId: 'not-a-uuid' });
			expect(result.success).toBe(false);
		});

		it('fails when displaySessionId is missing', () => {
			const { displaySessionId: _, ...withoutDisplay } = validPlayable;
			expect(gamesSchemas.isPlayable.safeParse(withoutDisplay).success).toBe(false);
		});
	});

	describe('contestant validation', () => {
		it('fails when there is only one contestant', () => {
			const result = gamesSchemas.isPlayable.safeParse({
				...validPlayable,
				contestants: [makeContestant()],
			});
			expect(result.success).toBe(false);
		});

		it('fails when there are no contestants', () => {
			const result = gamesSchemas.isPlayable.safeParse({ ...validPlayable, contestants: [] });
			expect(result.success).toBe(false);
		});
	});
});
