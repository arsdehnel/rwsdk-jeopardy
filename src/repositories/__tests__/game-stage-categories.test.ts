import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { resetDb } from '../../../tests/mocks/db';
import { createCategory } from '../categories';
import {
	createGameStageCategory,
	getGameStageCategories,
	saveGameStageCategories,
	updateGameStageCategory,
} from '../game-stage-categories';
import { createGameStage } from '../game-stages';
import { createGame } from '../games';
import { createUser } from '../users';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

async function setupStage() {
	const user = await createUser(`user-${crypto.randomUUID()}`, null, logger);
	const game = await createGame({ ownerId: user.id, currentStage: 'SINGLE' }, user.id, logger);
	const stage = await createGameStage({ stage: 'SINGLE' }, game.id, user.id, logger);
	return { user, game, stage };
}

describe('createGameStageCategory', () => {
	it('throws when gameStageId is not a valid UUID', async () => {
		const user = await createUser('testuser', null, logger);
		const cat = await createCategory({ name: 'Science' }, user.id, logger);

		await expect(createGameStageCategory({ categoryId: cat.id, position: 0 }, 'not-a-uuid', user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game Stage',
		);
	});

	it('creates a game stage category and returns it', async () => {
		const { user, stage } = await setupStage();
		const cat = await createCategory({ name: 'Animals' }, user.id, logger);

		const gsc = await createGameStageCategory({ categoryId: cat.id, position: 0 }, stage.id, user.id, logger);

		expect(gsc.id).toBeDefined();
		expect(gsc.gameStageId).toBe(stage.id);
		expect(gsc.categoryId).toBe(cat.id);
		expect(gsc.position).toBe(0);
	});
});

describe('updateGameStageCategory', () => {
	it('throws when gameStageCategoryId is not a valid UUID', async () => {
		const { user, stage } = await setupStage();
		const cat = await createCategory({ name: 'History' }, user.id, logger);

		await expect(updateGameStageCategory('not-a-uuid', { categoryId: cat.id, position: 1 }, user.id, logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game Stage Category',
		);
	});

	it('throws when game stage category is not found in the DB', async () => {
		const { user } = await setupStage();
		const cat = await createCategory({ name: 'Geography' }, user.id, logger);
		const nonExistentId = crypto.randomUUID();

		await expect(updateGameStageCategory(nonExistentId, { categoryId: cat.id, position: 1 }, user.id, logger)).rejects.toThrow(
			'Expected 1 Game Stage Category record(s), but found 0',
		);
	});

	it('updates a game stage category and returns the updated record', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Sports' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Movies' }, user.id, logger);
		const gsc = await createGameStageCategory({ categoryId: cat1.id, position: 0 }, stage.id, user.id, logger);

		const updated = await updateGameStageCategory(gsc.id, { categoryId: cat2.id, position: 1 }, user.id, logger);

		expect(updated.id).toBe(gsc.id);
		expect(updated.categoryId).toBe(cat2.id);
		expect(updated.position).toBe(1);
	});
});

describe('getGameStageCategories', () => {
	it('throws when stageId is not a valid UUID', async () => {
		await expect(getGameStageCategories('not-a-uuid', logger)).rejects.toThrow(
			'The value "not-a-uuid" is not a valid ID for a Game Stage',
		);
	});

	it('returns categories for a stage', async () => {
		const { user, stage } = await setupStage();
		const cat = await createCategory({ name: 'Music' }, user.id, logger);
		await createGameStageCategory({ categoryId: cat.id, position: 0 }, stage.id, user.id, logger);

		const result = await getGameStageCategories(stage.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].categoryId).toBe(cat.id);
	});

	it('returns empty array when stage has no categories', async () => {
		const { stage } = await setupStage();

		const result = await getGameStageCategories(stage.id, logger);

		expect(result).toEqual([]);
	});
});

describe('saveGameStageCategories', () => {
	it('returns empty array when no existing and no new categories (allStatements.length === 0)', async () => {
		const { stage, user } = await setupStage();

		const result = await saveGameStageCategories(stage.id, [], user.id, logger);

		expect(result).toEqual([]);
	});

	it('inserts new categories when none exist previously', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Tech' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Art' }, user.id, logger);

		const result = await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);

		expect(result).toHaveLength(2);
		const categoryIds = result.map(r => r.categoryId);
		expect(categoryIds).toContain(cat1.id);
		expect(categoryIds).toContain(cat2.id);
	});

	it('soft-deletes existing categories that are removed (deleteCount > 0 branch)', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Literature' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Politics' }, user.id, logger);

		// First save: insert both categories
		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);

		// Second save: keep only cat2, which should soft-delete the gsc for cat1
		await saveGameStageCategories(stage.id, [cat2.id], user.id, logger);

		const remaining = await getGameStageCategories(stage.id, logger);
		expect(remaining).toHaveLength(1);
		expect(remaining[0].categoryId).toBe(cat2.id);
	});

	it('skips the delete log when no existing categories are removed (deleteCount === 0)', async () => {
		const { user, stage } = await setupStage();
		const cat = await createCategory({ name: 'Philosophy' }, user.id, logger);

		// Save with a single new category — no existing ones, so deleteCount will be 0
		const result = await saveGameStageCategories(stage.id, [cat.id], user.id, logger);

		expect(result).toHaveLength(1);
		expect(result[0].categoryId).toBe(cat.id);
	});

	it('assigns positions matching the index order of categoryIds', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Alpha' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Beta' }, user.id, logger);
		const cat3 = await createCategory({ name: 'Gamma' }, user.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id, cat3.id], user.id, logger);

		const saved = await getGameStageCategories(stage.id, logger);
		const byCategory = Object.fromEntries(saved.map(r => [r.categoryId, r.position]));

		expect(byCategory[cat1.id]).toBe(0);
		expect(byCategory[cat2.id]).toBe(1);
		expect(byCategory[cat3.id]).toBe(2);
	});

	it('reorders existing categories when order changes', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'First' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Second' }, user.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);

		// Reverse the order
		await saveGameStageCategories(stage.id, [cat2.id, cat1.id], user.id, logger);

		const saved = await getGameStageCategories(stage.id, logger);
		const byCategory = Object.fromEntries(saved.map(r => [r.categoryId, r.position]));

		expect(byCategory[cat2.id]).toBe(0);
		expect(byCategory[cat1.id]).toBe(1);
	});

	it('preserves junction row IDs for retained categories', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Keep' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Drop' }, user.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);
		const before = await getGameStageCategories(stage.id, logger);
		const cat1JunctionId = before.find(r => r.categoryId === cat1.id)!.id;

		// Re-save with cat1 still present (cat2 dropped)
		await saveGameStageCategories(stage.id, [cat1.id], user.id, logger);
		const after = await getGameStageCategories(stage.id, logger);

		expect(after).toHaveLength(1);
		expect(after[0].id).toBe(cat1JunctionId);
	});

	it('assigns correct positions when new categories are mixed with existing ones', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Existing' }, user.id, logger);
		const cat2 = await createCategory({ name: 'New' }, user.id, logger);
		const cat3 = await createCategory({ name: 'AlsoNew' }, user.id, logger);

		// cat1 already exists at position 0
		await saveGameStageCategories(stage.id, [cat1.id], user.id, logger);

		// Re-save with cat2 inserted at index 0, cat1 moved to index 1, cat3 inserted at index 2
		await saveGameStageCategories(stage.id, [cat2.id, cat1.id, cat3.id], user.id, logger);

		const saved = await getGameStageCategories(stage.id, logger);
		const byCategory = Object.fromEntries(saved.map(r => [r.categoryId, r.position]));

		expect(byCategory[cat2.id]).toBe(0);
		expect(byCategory[cat1.id]).toBe(1);
		expect(byCategory[cat3.id]).toBe(2);
	});

	it('completely replaces all categories when none overlap', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Old1' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Old2' }, user.id, logger);
		const cat3 = await createCategory({ name: 'New1' }, user.id, logger);
		const cat4 = await createCategory({ name: 'New2' }, user.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);
		await saveGameStageCategories(stage.id, [cat3.id, cat4.id], user.id, logger);

		const saved = await getGameStageCategories(stage.id, logger);
		const categoryIds = saved.map(r => r.categoryId);

		expect(saved).toHaveLength(2);
		expect(categoryIds).toContain(cat3.id);
		expect(categoryIds).toContain(cat4.id);
		expect(categoryIds).not.toContain(cat1.id);
		expect(categoryIds).not.toContain(cat2.id);
	});

	it('does not affect categories on other stages', async () => {
		const { user, stage: stage1 } = await setupStage();
		const { stage: stage2 } = await setupStage();
		const cat1 = await createCategory({ name: 'StageOne' }, user.id, logger);
		const cat2 = await createCategory({ name: 'StageTwo' }, user.id, logger);

		await saveGameStageCategories(stage1.id, [cat1.id], user.id, logger);
		await saveGameStageCategories(stage2.id, [cat2.id], user.id, logger);

		// Modify stage1 — stage2 should be unaffected
		const cat3 = await createCategory({ name: 'StageOneNew' }, user.id, logger);
		await saveGameStageCategories(stage1.id, [cat3.id], user.id, logger);

		const stage2Results = await getGameStageCategories(stage2.id, logger);
		expect(stage2Results).toHaveLength(1);
		expect(stage2Results[0].categoryId).toBe(cat2.id);
	});

	it('removes all categories when saved with empty list after having some', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Gone1' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Gone2' }, user.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);
		await saveGameStageCategories(stage.id, [], user.id, logger);

		const remaining = await getGameStageCategories(stage.id, logger);
		expect(remaining).toHaveLength(0);
	});

	it('is idempotent when saving the same categories in the same order', async () => {
		const { user, stage } = await setupStage();
		const cat1 = await createCategory({ name: 'Stable1' }, user.id, logger);
		const cat2 = await createCategory({ name: 'Stable2' }, user.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);
		const before = await getGameStageCategories(stage.id, logger);

		await saveGameStageCategories(stage.id, [cat1.id, cat2.id], user.id, logger);
		const after = await getGameStageCategories(stage.id, logger);

		expect(after).toHaveLength(2);
		const beforeIds = before.map(r => r.id).sort();
		const afterIds = after.map(r => r.id).sort();
		expect(afterIds).toEqual(beforeIds);

		const byCategory = Object.fromEntries(after.map(r => [r.categoryId, r.position]));
		expect(byCategory[cat1.id]).toBe(0);
		expect(byCategory[cat2.id]).toBe(1);
	});
});
