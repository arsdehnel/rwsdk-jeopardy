import { z } from 'zod';
import { gamePhaseEnum, gameStageEnum } from '@/models';
import { requiredUuid } from './utils';

const stageSchema = z.object({
	id: z.string().uuid('Must be a valid UUID').optional(), // Present for update, absent for create,
	gameId: z.string().uuid('Must be a valid UUID').optional(), // Present for update, absent for create
	stage: z.enum(gameStageEnum),
	categories: z.array(requiredUuid).min(1).max(6),
});

const formSchema = z.object({
	id: z.string().uuid('Must be a valid UUID').optional(), // Present for update, absent for create
	ownerId: z.string().uuid('Must be a valid UUID').optional(), // Present for update, absent for create
	phase: z.enum(gamePhaseEnum).optional(),
	stages: z.array(stageSchema).min(1).max(4),
});

const contestantSchema = z.object({
	sessionId: z.string().uuid('Must be a valid UUID'),
	userId: z.string().uuid('Must be a valid UUID').optional(),
	name: z.string(),
});

const registerSchema = z.object({
	gameId: z.string().uuid('Must be a valid UUID'),
	displaySessionId: z.string().uuid('Must be a valid UUID'),
	contestants: z.array(contestantSchema).min(2),
});

export const gamesSchemas = {
	form: formSchema,
	register: registerSchema,
};
