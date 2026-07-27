import { z } from 'zod';

const formSchema = z.object({
	id: z
		.union([z.string().uuid('Must be a valid UUID'), z.literal('')])
		.transform(val => (val === '' ? undefined : val))
		.optional(), // Present for update, absent for create
	name: z.string(),
});

export const categoriesSchemas = {
	form: formSchema,
};
