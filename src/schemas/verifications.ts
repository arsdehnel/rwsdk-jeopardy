import { z } from 'zod';
import { optionalUuid, primaryKeyUuid } from './utils';

const formSchema = z.object({
	id: primaryKeyUuid,
	categoryId: optionalUuid,
	clueId: optionalUuid,
});

export const verificationsSchemas = {
	form: formSchema,
};
