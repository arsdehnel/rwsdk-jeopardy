import { describe, expect, it } from 'vitest';
import { usersSchemas } from '../users';

const VALID_UUID = crypto.randomUUID();

describe('usersSchemas.form', () => {
	describe('valid inputs', () => {
		it('passes with just a username', () => {
			const result = usersSchemas.form.safeParse({ username: 'alice' });
			expect(result.success).toBe(true);
		});

		it('passes with a valid UUID id and username', () => {
			const result = usersSchemas.form.safeParse({ id: VALID_UUID, username: 'alice' });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBe(VALID_UUID);
		});
	});

	describe('id field', () => {
		it('is undefined when omitted', () => {
			const result = usersSchemas.form.safeParse({ username: 'alice' });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});

		it('transforms empty string to undefined', () => {
			const result = usersSchemas.form.safeParse({ id: '', username: 'alice' });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});

		it('rejects a non-UUID id', () => {
			const result = usersSchemas.form.safeParse({ id: 'not-a-uuid', username: 'alice' });
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('id'));
			expect(issue?.message).toContain('UUID');
		});
	});

	describe('username field', () => {
		it('rejects when username is missing', () => {
			const result = usersSchemas.form.safeParse({});
			expect(result.success).toBe(false);
		});

		it('rejects an empty username', () => {
			const result = usersSchemas.form.safeParse({ username: '' });
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('username'));
			expect(issue?.message).toContain('required');
		});

		it('rejects a username longer than 50 characters', () => {
			const result = usersSchemas.form.safeParse({ username: 'a'.repeat(51) });
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('username'));
			expect(issue?.message).toContain('50 characters');
		});

		it('accepts a username of exactly 50 characters', () => {
			const result = usersSchemas.form.safeParse({ username: 'a'.repeat(50) });
			expect(result.success).toBe(true);
		});

		it('trims leading and trailing whitespace', () => {
			const result = usersSchemas.form.safeParse({ username: '  alice  ' });
			expect(result.success).toBe(true);
			expect(result.data?.username).toBe('alice');
		});

		it('rejects a username that is only whitespace (empty after trim)', () => {
			const result = usersSchemas.form.safeParse({ username: '   ' });
			expect(result.success).toBe(false);
		});
	});
});

describe('usersSchemas.adminEdit', () => {
	const validAdminEdit = {
		id: VALID_UUID,
		username: 'alice',
		role: 'BASIC' as const,
	};

	describe('valid inputs', () => {
		it('passes with a valid id, username, and BASIC role', () => {
			const result = usersSchemas.adminEdit.safeParse(validAdminEdit);
			expect(result.success).toBe(true);
		});

		it('passes with the ADMIN role', () => {
			const result = usersSchemas.adminEdit.safeParse({ ...validAdminEdit, role: 'ADMIN' });
			expect(result.success).toBe(true);
		});
	});

	describe('id field', () => {
		it('rejects when id is missing', () => {
			const { id: _, ...withoutId } = validAdminEdit;
			const result = usersSchemas.adminEdit.safeParse(withoutId);
			expect(result.success).toBe(false);
		});

		it('rejects a non-UUID id', () => {
			const result = usersSchemas.adminEdit.safeParse({ ...validAdminEdit, id: 'not-a-uuid' });
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('id'));
			expect(issue?.message).toContain('UUID');
		});
	});

	describe('role field', () => {
		it('rejects an invalid role', () => {
			const result = usersSchemas.adminEdit.safeParse({ ...validAdminEdit, role: 'SUPERUSER' });
			expect(result.success).toBe(false);
		});

		it('rejects when role is missing', () => {
			const { role: _, ...withoutRole } = validAdminEdit;
			const result = usersSchemas.adminEdit.safeParse(withoutRole);
			expect(result.success).toBe(false);
		});
	});

	describe('username field', () => {
		it('rejects an empty username', () => {
			const result = usersSchemas.adminEdit.safeParse({ ...validAdminEdit, username: '' });
			expect(result.success).toBe(false);
		});

		it('rejects a username longer than 50 characters', () => {
			const result = usersSchemas.adminEdit.safeParse({ ...validAdminEdit, username: 'a'.repeat(51) });
			expect(result.success).toBe(false);
		});
	});
});
