import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, getGameById } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleDisplayRegistration from '../handle-display-registration';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('handleDisplayRegistration.set (integration)', () => {
	it('sets displaySessionId in DB when called with a valid DisplayRegistration with userId', async () => {
		const owner = await createUser('owner', null, logger);
		const displayUser = await createUser('display', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionId = crypto.randomUUID();

		await handleDisplayRegistration.set(game.id, { sessionId, userId: displayUser.id }, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.displaySessionId).toBe(sessionId);
	});

	it('sets displaySessionId in DB when called with a valid DisplayRegistration without userId', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionId = crypto.randomUUID();

		await handleDisplayRegistration.set(game.id, { sessionId }, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.displaySessionId).toBe(sessionId);
	});

	it('clears displaySessionId in DB when called with null after setting a display session', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionId = crypto.randomUUID();

		await handleDisplayRegistration.set(game.id, { sessionId }, logger);
		await handleDisplayRegistration.set(game.id, null, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.displaySessionId).toBeNull();
	});

	it('does not throw and leaves displaySessionId unchanged when given an invalid shape', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await expect(handleDisplayRegistration.set(game.id, 999, logger)).resolves.not.toThrow();

		const updated = await getGameById(game.id, logger);
		expect(updated.displaySessionId).toBeNull();
	});
});

describe('handleDisplayRegistration.get (integration)', () => {
	it('returns the display session ID from the DB', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionId = crypto.randomUUID();

		await handleDisplayRegistration.set(game.id, { sessionId }, logger);

		const result = await handleDisplayRegistration.get(game.id, logger);
		expect(result).toBe(sessionId);
	});

	it('returns null when no display is registered', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		const result = await handleDisplayRegistration.get(game.id, logger);
		expect(result).toBeNull();
	});
});
