import { z } from 'zod';
import { userRoles } from '@/data/roles';
import { primaryKeyUuid } from './utils';

const usernameField = z.string().trim().min(1, 'Username is required').max(50, 'Username must be 50 characters or less');

const formSchema = z.object({
	id: primaryKeyUuid,
	username: usernameField,
});

const adminEditSchema = z.object({
	id: primaryKeyUuid,
	username: usernameField,
	role: z.enum(userRoles),
});

export const usersSchemas = {
	form: formSchema,
	adminEdit: adminEditSchema,
};
