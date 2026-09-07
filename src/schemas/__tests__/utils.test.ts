import { describe, expect, it } from 'vitest';
import { coercedInt, optionalUuid, primaryKeyUuid, requiredUuid } from '../utils';

describe('primaryKeyUuid', () => {
	it('accepts a valid UUID', () => {
		const result = primaryKeyUuid.safeParse(crypto.randomUUID());
		expect(result.success).toBe(true);
	});

	it('transforms empty string to undefined (create path)', () => {
		const result = primaryKeyUuid.safeParse('');
		expect(result.success).toBe(true);
		expect(result.data).toBeUndefined();
	});

	it('is undefined when omitted', () => {
		const result = primaryKeyUuid.safeParse(undefined);
		expect(result.success).toBe(true);
		expect(result.data).toBeUndefined();
	});

	it('rejects a non-UUID string', () => {
		const result = primaryKeyUuid.safeParse('not-a-uuid');
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toContain('UUID');
	});

	it('rejects null (unlike optionalUuid)', () => {
		const result = primaryKeyUuid.safeParse(null);
		expect(result.success).toBe(false);
	});
});

describe('optionalUuid', () => {
	it('accepts a valid UUID', () => {
		const result = optionalUuid.safeParse(crypto.randomUUID());
		expect(result.success).toBe(true);
	});

	it('transforms empty string to undefined', () => {
		const result = optionalUuid.safeParse('');
		expect(result.success).toBe(true);
		expect(result.data).toBeUndefined();
	});

	it('transforms null to undefined', () => {
		const result = optionalUuid.safeParse(null);
		expect(result.success).toBe(true);
		expect(result.data).toBeUndefined();
	});

	it('is undefined when omitted', () => {
		const result = optionalUuid.safeParse(undefined);
		expect(result.success).toBe(true);
		expect(result.data).toBeUndefined();
	});

	it('rejects a non-UUID string', () => {
		const result = optionalUuid.safeParse('not-a-uuid');
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toContain('UUID');
	});
});

describe('requiredUuid', () => {
	it('accepts a valid UUID', () => {
		const result = requiredUuid.safeParse(crypto.randomUUID());
		expect(result.success).toBe(true);
	});

	it('rejects a non-UUID string', () => {
		const result = requiredUuid.safeParse('not-a-uuid');
		expect(result.success).toBe(false);
		expect(result.error?.issues[0].message).toContain('UUID');
	});

	it('rejects undefined', () => {
		const result = requiredUuid.safeParse(undefined);
		expect(result.success).toBe(false);
	});
});

describe('coercedInt', () => {
	describe('with no bounds', () => {
		it('accepts any integer', () => {
			const schema = coercedInt();
			expect(schema.safeParse(0).success).toBe(true);
			expect(schema.safeParse(-100).success).toBe(true);
			expect(schema.safeParse(999999).success).toBe(true);
		});

		it('rejects a non-integer number', () => {
			const schema = coercedInt();
			expect(schema.safeParse(1.5).success).toBe(false);
		});
	});

	describe('with only min', () => {
		it('accepts a value at the minimum', () => {
			const schema = coercedInt(5);
			expect(schema.safeParse(5).success).toBe(true);
		});

		it('accepts a value above the minimum', () => {
			const schema = coercedInt(5);
			expect(schema.safeParse(100).success).toBe(true);
		});

		it('rejects a value below the minimum', () => {
			const schema = coercedInt(5);
			expect(schema.safeParse(4).success).toBe(false);
		});
	});

	describe('with only max', () => {
		it('accepts a value at the maximum', () => {
			const schema = coercedInt(undefined, 10);
			expect(schema.safeParse(10).success).toBe(true);
		});

		it('accepts a value below the maximum', () => {
			const schema = coercedInt(undefined, 10);
			expect(schema.safeParse(0).success).toBe(true);
		});

		it('rejects a value above the maximum', () => {
			const schema = coercedInt(undefined, 10);
			expect(schema.safeParse(11).success).toBe(false);
		});
	});

	describe('with both min and max', () => {
		it('accepts a value within the range', () => {
			const schema = coercedInt(1, 50);
			expect(schema.safeParse(25).success).toBe(true);
		});

		it('rejects a value below the minimum', () => {
			const schema = coercedInt(1, 50);
			expect(schema.safeParse(0).success).toBe(false);
		});

		it('rejects a value above the maximum', () => {
			const schema = coercedInt(1, 50);
			expect(schema.safeParse(51).success).toBe(false);
		});

		it('coerces a numeric string to a number', () => {
			const schema = coercedInt(1, 50);
			const result = schema.safeParse('25');
			expect(result.success).toBe(true);
			expect(result.data).toBe(25);
		});
	});
});
