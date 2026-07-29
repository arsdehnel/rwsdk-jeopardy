import { beforeEach, describe, expect, it, vi } from 'vitest';
import { KADAccessError } from '@/classes';

const mockRequestInfo = {
	ctx: {
		user: null as { id: string; role?: string | null } | null,
		permissions: [] as string[],
	},
};

vi.mock('rwsdk/worker', () => ({
	get requestInfo() {
		return mockRequestInfo;
	},
	getRequestInfo: () => mockRequestInfo,
}));

import { requirePermissions } from '@/interrupters';

describe('requirePermissions', () => {
	beforeEach(() => {
		mockRequestInfo.ctx.user = null;
		mockRequestInfo.ctx.permissions = [];
	});

	it('returns undefined when user has all required permissions', async () => {
		mockRequestInfo.ctx.permissions = ['categories:create', 'categories:update'];

		const middleware = requirePermissions('categories:create', 'categories:update');
		const result = await middleware();

		expect(result).toBeUndefined();
	});

	it('throws KADAccessError 500 if there is a perms check that has no indicated perms', async () => {
		expect(() => requirePermissions()).toThrow(KADAccessError);
	});

	it('throws KADAccessError 403 when user is missing all required permissions', async () => {
		mockRequestInfo.ctx.permissions = [];

		const middleware = requirePermissions('categories:create');

		await expect(middleware()).rejects.toThrow(KADAccessError);
		await expect(middleware()).rejects.toMatchObject({ code: 403 });
	});

	it('throws KADAccessError 403 when user is missing some required permissions', async () => {
		mockRequestInfo.ctx.permissions = ['categories:create'];

		const middleware = requirePermissions('categories:create', 'categories:delete');

		await expect(middleware()).rejects.toThrow(KADAccessError);
		await expect(middleware()).rejects.toMatchObject({ code: 403 });
	});

	it('throws KADAccessError 403 when ctx.permissions is undefined', async () => {
		mockRequestInfo.ctx.permissions = undefined as any;

		const middleware = requirePermissions('categories:create');

		await expect(middleware()).rejects.toThrow(KADAccessError);
	});

	it('returns undefined when user has the required permission', async () => {
		mockRequestInfo.ctx.permissions = ['categories:generate'];

		const middleware = requirePermissions('categories:generate');
		const result = await middleware();

		expect(result).toBeUndefined();
	});

	it('throws KADAccessError 403 when user lacks the required permission', async () => {
		mockRequestInfo.ctx.permissions = ['categories:generate'];

		const middleware = requirePermissions('categories:delete');

		await expect(middleware()).rejects.toThrow(KADAccessError);
		await expect(middleware()).rejects.toMatchObject({ code: 403 });
	});
});
