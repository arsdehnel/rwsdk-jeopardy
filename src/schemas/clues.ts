import { z } from 'zod';
import { coercedInt, requiredUuid } from './utils';

const formSchema = z.object({
	id: z
		.union([z.string().uuid('Must be a valid UUID'), z.literal('')])
		.transform(val => (val === '' ? undefined : val))
		.optional(), // Present for update, absent for create
	categoryId: requiredUuid,
	text: z.string(),
	response: z.string(),
	position: coercedInt(1, 50),
	referenceUrls: z
		.array(z.url({ protocol: /^https$/ }))
		.nullish()
		.transform(val => val ?? []),
});

export const cluesSchemas = {
	form: formSchema,
};
