import { z } from 'zod';
import { primaryKeyUuid } from './utils';

const formSchema = z.object({
	id: primaryKeyUuid,
	name: z.string().trim().min(1, 'Name is required').max(30, 'Name must be 30 characters or less'),
});

export const categoriesSchemas = {
	form: formSchema,
};
