import { describe, expect, it } from 'vitest';
// Import from the barrel so index.ts gets coverage too
import { categoriesSchemas } from '../index';

const VALID_UUID = crypto.randomUUID();

const baseCategoryForm = {
	name: 'Science',
};

describe('categoriesSchemas.form', () => {
	describe('valid inputs', () => {
		it('passes with just a name', () => {
			const result = categoriesSchemas.form.safeParse(baseCategoryForm);
			expect(result.success).toBe(true);
		});

		it('passes with a valid UUID id', () => {
			const result = categoriesSchemas.form.safeParse({ ...baseCategoryForm, id: VALID_UUID });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBe(VALID_UUID);
		});
	});

	describe('id field', () => {
		it('is undefined when omitted', () => {
			const result = categoriesSchemas.form.safeParse(baseCategoryForm);
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});

		it('transforms empty string to undefined', () => {
			const result = categoriesSchemas.form.safeParse({ ...baseCategoryForm, id: '' });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});

		it('rejects a non-UUID id', () => {
			const result = categoriesSchemas.form.safeParse({ ...baseCategoryForm, id: 'not-a-uuid' });
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('id'));
			expect(issue?.message).toContain('UUID');
		});
	});

	describe('name field', () => {
		it('rejects when name is missing', () => {
			const result = categoriesSchemas.form.safeParse({});
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('name'));
			expect(issue).toBeDefined();
		});
	});
});
