import { z } from 'zod';
import { optionalUuid } from './utils';

const formSchema = z.object({
	id: z.string().uuid('Must be a valid UUID').optional(),
	categoryId: optionalUuid,
	clueId: optionalUuid,
});

export const verificationsSchemas = {
	form: formSchema,
};
