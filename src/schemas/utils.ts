import { z } from 'zod';

export const optionalUuid = z
	.union([z.string().uuid('Must be a valid UUID'), z.null(), z.literal('')])
	.transform(val => (val === '' || val === null ? undefined : val))
	.optional() satisfies z.ZodType<string | undefined>;

export const requiredUuid = z.string().uuid('Must be a valid UUID');

export const coercedInt = (min?: number, max?: number) => {
	let schema = z.coerce.number().int();
	if (min !== undefined) schema = schema.min(min);
	if (max !== undefined) schema = schema.max(max);
	return schema;
};
