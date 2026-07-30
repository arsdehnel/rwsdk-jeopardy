import { z } from 'zod';
import { gamePhaseEnum, gameStageEnum } from '@/models';
import { optionalUuid, requiredUuid } from './utils';

const formSchema = z.object({
	id: optionalUuid, // Present for update, absent for create
	phase: z.enum(gamePhaseEnum).optional(),
	stage: z.enum(gameStageEnum).optional(),
	categories: z.array(requiredUuid).min(1).max(6),
});

export const gamesSchemas = {
	form: formSchema,
};
