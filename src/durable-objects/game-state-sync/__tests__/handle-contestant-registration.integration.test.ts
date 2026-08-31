import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, getGameById } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleContestantRegistration from '../handle-contestant-registration';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('handleContestantRegistration.set (integration)', () => {
	it('saves contestants in DB when called with valid contestants array', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const contestants = [
			{ sessionId: crypto.randomUUID(), name: 'Alice' },
			{ sessionId: crypto.randomUUID(), name: 'Bob' },
		];

		await handleContestantRegistration.set(game.id, contestants, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.contestants).toHaveLength(2);
		const names = updated.contestants.map(c => c.name);
		expect(names).toContain('Alice');
		expect(names).toContain('Bob');
		const sessionIds = updated.contestants.map(c => c.sessionId);
		expect(sessionIds).toContain(contestants[0].sessionId);
		expect(sessionIds).toContain(contestants[1].sessionId);
	});

	it('saves an empty contestants list in DB when called with empty array', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await handleContestantRegistration.set(game.id, [], logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.contestants).toHaveLength(0);
	});

	it('removes contestants not in the new list when called again with a subset', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);
		const sessionIdAlice = crypto.randomUUID();
		const sessionIdBob = crypto.randomUUID();

		await handleContestantRegistration.set(
			game.id,
			[
				{ sessionId: sessionIdAlice, name: 'Alice' },
				{ sessionId: sessionIdBob, name: 'Bob' },
			],
			logger,
		);

		await handleContestantRegistration.set(game.id, [{ sessionId: sessionIdAlice, name: 'Alice' }], logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.contestants).toHaveLength(1);
		expect(updated.contestants[0].sessionId).toBe(sessionIdAlice);
		expect(updated.contestants[0].name).toBe('Alice');
	});

	it('does not throw and leaves contestants unchanged when given an invalid shape', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await expect(handleContestantRegistration.set(game.id, 'not-an-array', logger)).resolves.not.toThrow();

		const updated = await getGameById(game.id, logger);
		expect(updated.contestants).toHaveLength(0);
	});
});
