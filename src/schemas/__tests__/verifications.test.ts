import { describe, expect, it } from 'vitest';
import { verificationsSchemas } from '../verifications';

const VALID_UUID = crypto.randomUUID();

describe('verificationsSchemas.form', () => {
	describe('valid inputs', () => {
		it('passes with all optional fields omitted and no referenceUrls', () => {
			const result = verificationsSchemas.form.safeParse({});
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});

		it('defaults referenceUrls to [] when not provided', () => {
			const result = verificationsSchemas.form.safeParse({ clueId: VALID_UUID });
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});

		it('passes with an empty referenceUrls array', () => {
			const result = verificationsSchemas.form.safeParse({ referenceUrls: [] });
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});

		it('passes with a single HTTPS URL', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['https://example.com'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with multiple HTTPS URLs', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['https://example.com', 'https://other.org/path'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with an HTTPS URL including query parameters', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['https://example.com/search?q=jeopardy&page=1'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with an HTTPS URL including a hash fragment', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['https://en.wikipedia.org/wiki/Jeopardy#History'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with a valid UUID for id', () => {
			const result = verificationsSchemas.form.safeParse({
				id: VALID_UUID,
				referenceUrls: [],
			});
			expect(result.success).toBe(true);
		});

		it('passes with valid UUIDs for categoryId and clueId', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: VALID_UUID,
				clueId: VALID_UUID,
				referenceUrls: [],
			});
			expect(result.success).toBe(true);
		});

		it('passes when categoryId is null (treated as undefined)', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: null,
				referenceUrls: [],
			});
			expect(result.success).toBe(true);
			expect(result.data?.categoryId).toBeUndefined();
		});

		it('passes when categoryId is empty string (treated as undefined)', () => {
			const result = verificationsSchemas.form.safeParse({
				categoryId: '',
				referenceUrls: [],
			});
			expect(result.success).toBe(true);
			expect(result.data?.categoryId).toBeUndefined();
		});

		it('passes when id is omitted', () => {
			const result = verificationsSchemas.form.safeParse({ referenceUrls: [] });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});
	});

	describe('referenceUrls validation', () => {
		it('rejects an HTTP URL', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['http://example.com'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects a plain string that is not a URL', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['not a url'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects a domain without a protocol', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['example.com'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects an ftp URL', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['ftp://example.com/file.txt'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects an array with a mix of valid and invalid URLs', () => {
			const result = verificationsSchemas.form.safeParse({
				referenceUrls: ['https://example.com', 'http://bad.com'],
			});
			expect(result.success).toBe(false);
		});
	});

	describe('id validation', () => {
		it('rejects a non-UUID id', () => {
			const result = verificationsSchemas.form.safeParse({
				id: 'not-a-uuid',
				referenceUrls: [],
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
				referenceUrls: [],
			});
			expect(result.success).toBe(false);
		});

		it('rejects a non-UUID clueId that is not null or empty string', () => {
			const result = verificationsSchemas.form.safeParse({
				clueId: 'not-a-uuid',
				referenceUrls: [],
			});
			expect(result.success).toBe(false);
		});
	});
});
