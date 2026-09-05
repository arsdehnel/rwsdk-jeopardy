import { describe, expect, it } from 'vitest';
import { verificationsSchemas } from '../verifications';

const VALID_UUID = crypto.randomUUID();

describe('verificationsSchemas.form', () => {
	describe('valid inputs', () => {
		it('passes with all optional fields omitted', () => {
			const result = verificationsSchemas.form.safeParse({});
			expect(result.success).toBe(true);
		});

		it('passes with a valid UUID for id', () => {
			const result = verificationsSchemas.form.safeParse({
				id: VALID_UUID,
			});
			expect(result.success).toBe(true);
		});

		it('passes with valid UUIDs for categoryId and clueId', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: VALID_UUID,
				clueId: VALID_UUID,
			});
			expect(result.success).toBe(true);
		});

		it('passes when categoryId is null (treated as undefined)', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: null,
			});
			expect(result.success).toBe(true);
			expect(result.data?.categoryId).toBeUndefined();
		});

		it('passes when categoryId is empty string (treated as undefined)', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: '',
			});
			expect(result.success).toBe(true);
			expect(result.data?.categoryId).toBeUndefined();
		});

		it('passes when id is omitted', () => {
			const result = verificationsSchemas.form.safeParse({});
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});
	});

	describe('id validation', () => {
		it('rejects a non-UUID id', () => {
			const result = verificationsSchemas.form.safeParse({
				id: 'not-a-uuid',
			});
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('id'));
			expect(issue?.message).toContain('UUID');
		});
	});

	describe('categoryId and clueId validation', () => {
		it('rejects a non-UUID categoryId that is not null or empty string', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: 'not-a-uuid',
			});
			expect(result.success).toBe(false);
		});

		it('rejects a non-UUID clueId that is not null or empty string', () => {
			const result = verificationsSchemas.form.safeParse({
				clueId: 'not-a-uuid',
			});
			expect(result.success).toBe(false);
		});
	});
});
