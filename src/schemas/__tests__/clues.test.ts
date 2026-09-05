import { describe, expect, it } from 'vitest';
import { cluesSchemas } from '../clues';

const VALID_UUID = crypto.randomUUID();

const baseClue = {
	categoryId: VALID_UUID,
	text: "This volcanic island chain in the Pacific is home to the world's most isolated population center",
	response: 'Hawaii',
	position: 1,
};

describe('cluesSchemas.form', () => {
	describe('valid inputs', () => {
		it('passes with all required fields and no referenceUrls', () => {
			const result = cluesSchemas.form.safeParse(baseClue);
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});

		it('passes with a valid id UUID', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, id: VALID_UUID });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBe(VALID_UUID);
		});

		it('passes with an empty referenceUrls array', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, referenceUrls: [] });
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});

		it('passes with a single HTTPS URL', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['https://example.com'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with multiple HTTPS URLs', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['https://example.com', 'https://other.org/path'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with an HTTPS URL including query parameters', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['https://example.com/search?q=jeopardy&page=1'],
			});
			expect(result.success).toBe(true);
		});

		it('passes with an HTTPS URL including a hash fragment', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['https://en.wikipedia.org/wiki/Jeopardy#History'],
			});
			expect(result.success).toBe(true);
		});
	});

	describe('id field', () => {
		it('transforms empty string to undefined', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, id: '' });
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});

		it('is undefined when omitted', () => {
			const result = cluesSchemas.form.safeParse(baseClue);
			expect(result.success).toBe(true);
			expect(result.data?.id).toBeUndefined();
		});

		it('rejects a non-UUID id', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, id: 'not-a-uuid' });
			expect(result.success).toBe(false);
			const issue = result.error?.issues.find(i => i.path.includes('id'));
			expect(issue?.message).toContain('UUID');
		});
	});

	describe('referenceUrls coercion', () => {
		it('defaults to [] when referenceUrls is undefined', () => {
			const result = cluesSchemas.form.safeParse(baseClue);
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});

		it('coerces null to []', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, referenceUrls: null });
			expect(result.success).toBe(true);
			expect(result.data?.referenceUrls).toEqual([]);
		});
	});

	describe('referenceUrls URL validation', () => {
		it('rejects an HTTP URL', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['http://example.com'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects a plain string that is not a URL', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['not a url'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects a domain without a protocol', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['example.com'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects an ftp URL', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['ftp://example.com/file.txt'],
			});
			expect(result.success).toBe(false);
		});

		it('rejects an array with a mix of valid and invalid URLs', () => {
			const result = cluesSchemas.form.safeParse({
				...baseClue,
				referenceUrls: ['https://example.com', 'http://bad.com'],
			});
			expect(result.success).toBe(false);
		});
	});

	describe('position validation', () => {
		it('accepts a number within range', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, position: 25 });
			expect(result.success).toBe(true);
		});

		it('coerces a numeric string to a number', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, position: '3' });
			expect(result.success).toBe(true);
			expect(result.data?.position).toBe(3);
		});

		it('rejects position below minimum (1)', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, position: 0 });
			expect(result.success).toBe(false);
		});

		it('rejects position above maximum (50)', () => {
			const result = cluesSchemas.form.safeParse({ ...baseClue, position: 51 });
			expect(result.success).toBe(false);
		});
	});

	describe('required fields', () => {
		it('rejects when categoryId is missing', () => {
			const { categoryId: _, ...rest } = baseClue;
			const result = cluesSchemas.form.safeParse(rest);
			expect(result.success).toBe(false);
		});

		it('rejects when text is missing', () => {
			const { text: _, ...rest } = baseClue;
			const result = cluesSchemas.form.safeParse(rest);
			expect(result.success).toBe(false);
		});

		it('rejects when response is missing', () => {
			const { response: _, ...rest } = baseClue;
			const result = cluesSchemas.form.safeParse(rest);
			expect(result.success).toBe(false);
		});
	});
});
