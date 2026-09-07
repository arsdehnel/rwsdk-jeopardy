import { z } from 'zod';
import { coercedInt, primaryKeyUuid, requiredUuid } from './utils';

const formSchema = z.object({
	id: primaryKeyUuid,
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
