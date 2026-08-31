import { beforeEach, describe, expect, it } from 'vitest';
import { createNoopLogger } from '@/logger';
import { createGame, createUser, getGameById } from '@/repositories';
import { resetDb } from '../../../../tests/mocks/db';
import handleHostRegistration from '../handle-host-registration';

const logger = createNoopLogger();

beforeEach(async () => {
	await resetDb();
});

describe('handleHostRegistration.set (integration)', () => {
	it('sets hostUserId in DB when called with a valid HostRegistration', async () => {
		const owner = await createUser('owner', null, logger);
		const host = await createUser('host', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await handleHostRegistration.set(game.id, { sessionId: crypto.randomUUID(), userId: host.id }, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.hostUserId).toBe(host.id);
	});

	it('clears hostUserId in DB when called with null after setting a host', async () => {
		const owner = await createUser('owner', null, logger);
		const host = await createUser('host', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await handleHostRegistration.set(game.id, { sessionId: crypto.randomUUID(), userId: host.id }, logger);
		await handleHostRegistration.set(game.id, null, logger);

		const updated = await getGameById(game.id, logger);
		expect(updated.hostUserId).toBeNull();
	});

	it('does not throw and leaves hostUserId unchanged when given an invalid shape', async () => {
		const owner = await createUser('owner', null, logger);
		const game = await createGame({ ownerId: owner.id, currentStage: 'SINGLE' }, owner.id, logger);

		await expect(handleHostRegistration.set(game.id, 'invalid', logger)).resolves.not.toThrow();

		const updated = await getGameById(game.id, logger);
		expect(updated.hostUserId).toBeNull();
	});
});
