import { z } from 'zod';
import { gamePhaseEnum, gameStageEnum } from '@/data/enums';
import { primaryKeyUuid, requiredUuid } from './utils';

const stageSchema = z.object({
	id: primaryKeyUuid,
	gameId: z.string().uuid('Must be a valid UUID').optional(),
	stage: z.enum(gameStageEnum),
	categories: z.array(requiredUuid).min(1).max(6), // allow anything in this range while building a game, but will be validated later for registerability
});

const formSchema = z.object({
	id: primaryKeyUuid,
	ownerId: z.string().uuid('Must be a valid UUID').optional(),
	phase: z.enum(gamePhaseEnum).optional(),
	stages: z.array(stageSchema).min(1).max(4),
});

const contestantSchema = z
	.object({
		sessionId: z.string().uuid('Must be a valid UUID'),
		userId: z.string().uuid('Must be a valid UUID').optional(),
		name: z.string(),
	})
	.superRefine(({ userId, name }, ctx) => {
		if (!userId && name.trim().length === 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Name is required when no user ID is provided',
				path: ['name'],
			});
		}
	});

const registerSchema = z.object({
	gameId: z.string().uuid('Must be a valid UUID'),
	displaySessionId: z.string().uuid('Must be a valid UUID'),
	contestants: z.array(contestantSchema).min(2),
});

const isRegisterableStageSchema = z
	.object({
		stage: z.enum(gameStageEnum),
		categories: z.array(z.unknown()),
	})
	.superRefine(({ stage, categories }, ctx) => {
		const expected = stage === 'FINAL' ? 1 : 6;
		if (categories.length !== expected) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `${stage} stage requires exactly ${expected} ${expected === 1 ? 'category' : 'categories'}`,
				path: ['categories'],
			});
		}
	});

const isRegisterableSchema = z.object({
	id: z.string().uuid('Must be a valid UUID'),
	stages: z
		.array(isRegisterableStageSchema)
		.min(1, { message: 'Game must have at least one stage' })
		.max(4)
		.superRefine((stages, ctx) => {
			const seen = new Set<string>();
			for (const stage of stages) {
				if (seen.has(stage.stage)) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: `Stage "${stage.stage}" appears more than once`,
					});
				}
				seen.add(stage.stage);
			}
		}),
});

// validates a GameWithEverything from D1 to confirm the game is ready to be played
const isPlayableSchema = isRegisterableSchema.extend({
	hostUserId: z.string().uuid('Must be a valid UUID'),
	displaySessionId: z.string().uuid('Must be a valid UUID'),
	// contestants come from the DB as GameContestantDBRead — we only care about count here
	contestants: z.array(z.unknown()).min(2, { message: 'Game must have at least 2 contestants' }),
});

export const gamesSchemas = {
	form: formSchema,
	register: registerSchema,
	isRegisterable: isRegisterableSchema,
	isPlayable: isPlayableSchema,
};
