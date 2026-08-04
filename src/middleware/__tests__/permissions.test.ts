import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockRequestInfo = {
	ctx: {
		user: null as { id: string; role?: string | null } | null,
		session: undefined as { permissionsOverride?: string[] } | undefined,
		permissions: [] as string[],
	},
};

vi.mock('rwsdk/worker', () => ({
	get requestInfo() {
		return mockRequestInfo;
	},
	getRequestInfo: () => mockRequestInfo,
}));

import permissionsMiddleware from '../permissions';

describe('permissionsMiddleware', () => {
	beforeEach(() => {
		mockRequestInfo.ctx.user = null;
		mockRequestInfo.ctx.session = undefined;
		mockRequestInfo.ctx.permissions = [];
	});

	it('sets permissions on context for unauthenticated users', () => {
		permissionsMiddleware(mockRequestInfo as any);

		expect(mockRequestInfo.ctx.permissions).toBeDefined();
		expect(Array.isArray(mockRequestInfo.ctx.permissions)).toBe(true);
		expect(mockRequestInfo.ctx.permissions.length).toBeGreaterThan(0);

		// Should only have read permissions
		expect(
			mockRequestInfo.ctx.permissions.every(
				p => p.endsWith(':read') || p.endsWith(':login') || p.endsWith(':register') || p.endsWith(':unregister'),
			),
		).toBe(true);
	});

	it('sets permissions for BASIC role users', () => {
		mockRequestInfo.ctx.user = { id: 'user-123', role: 'BASIC' };

		permissionsMiddleware(mockRequestInfo as any);

		expect(mockRequestInfo.ctx.permissions).toBeDefined();
		expect(mockRequestInfo.ctx.permissions).toContain('categories:generate');
		expect(mockRequestInfo.ctx.permissions).not.toContain('categories:create');
	});

	it('sets all permissions for ADMIN role users', () => {
		mockRequestInfo.ctx.user = { id: 'admin-123', role: 'ADMIN' };

		permissionsMiddleware(mockRequestInfo as any);

		expect(mockRequestInfo.ctx.permissions).toBeDefined();
		expect(mockRequestInfo.ctx.permissions).toContain('categories:create');
		expect(mockRequestInfo.ctx.permissions).toContain('categories:delete');
	});

	it('handles users without a role', () => {
		mockRequestInfo.ctx.user = { id: 'user-123', role: null };

		permissionsMiddleware(mockRequestInfo as any);

		expect(mockRequestInfo.ctx.permissions).toBeDefined();
		expect(
			mockRequestInfo.ctx.permissions.every(
				p => p.endsWith(':read') || p.endsWith(':login') || p.endsWith(':register') || p.endsWith(':unregister'),
			),
		).toBe(true);
	});

	it('handles users with undefined role', () => {
		mockRequestInfo.ctx.user = { id: 'user-123', role: undefined };

		permissionsMiddleware(mockRequestInfo as any);

		expect(mockRequestInfo.ctx.permissions).toBeDefined();
		expect(
			mockRequestInfo.ctx.permissions.every(
				p => p.endsWith(':read') || p.endsWith(':login') || p.endsWith(':register') || p.endsWith(':unregister'),
			),
		).toBe(true);
	});

	it('handles users with unknown role', () => {
		mockRequestInfo.ctx.user = { id: 'user-123', role: 'UNKNOWN' };

		permissionsMiddleware(mockRequestInfo as any);

		expect(mockRequestInfo.ctx.permissions).toBeDefined();
		// Should only get public permissions
		expect(
			mockRequestInfo.ctx.permissions.every(
				p => p.endsWith(':read') || p.endsWith(':login') || p.endsWith(':register') || p.endsWith(':unregister'),
			),
		).toBe(true);
	});

	describe('permissionsOverride', () => {
		it('uses permissionsOverride from session when present', () => {
			mockRequestInfo.ctx.user = { id: 'user-123', role: 'ADMIN' };
			mockRequestInfo.ctx.session = { permissionsOverride: ['categories:read'] };

			permissionsMiddleware(mockRequestInfo as any);

			expect(mockRequestInfo.ctx.permissions).toEqual(['categories:read']);
			// Admin role permissions should NOT be used
			expect(mockRequestInfo.ctx.permissions).not.toContain('categories:create');
		});

		it('override takes precedence over role-based permissions', () => {
			mockRequestInfo.ctx.user = { id: 'user-123', role: 'ADMIN' };
			mockRequestInfo.ctx.session = { permissionsOverride: ['categories:read'] };

			permissionsMiddleware(mockRequestInfo as any);

			expect(mockRequestInfo.ctx.permissions).toEqual(['categories:read']);
			expect(mockRequestInfo.ctx.permissions).not.toContain('categories:create');
		});

		it('falls through to role-based when session has no permissionsOverride', () => {
			mockRequestInfo.ctx.user = { id: 'user-123', role: 'ADMIN' };
			mockRequestInfo.ctx.session = {}; // session exists but no override

			permissionsMiddleware(mockRequestInfo as any);

			expect(mockRequestInfo.ctx.permissions).toContain('categories:create');
		});

		// [] is truthy in JS, so `if (ctx.session?.permissionsOverride)` takes the override
		// branch and sets zero permissions — a complete blackout. Desired behaviour: treat an
		// empty override array the same as no override (fall through to role-based permissions).
		it('TDD: empty array permissionsOverride falls through to role-based permissions', () => {
			mockRequestInfo.ctx.user = { id: 'user-123', role: 'BASIC' };
			mockRequestInfo.ctx.session = { permissionsOverride: [] };

			permissionsMiddleware(mockRequestInfo as any);

			expect(mockRequestInfo.ctx.permissions).toContain('categories:generate');
		});
	});
});
