'use server';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { createClue, updateClue } from '@/repositories';
import { cluesSchemas } from '@/schemas';
import type { ActionState, ClueDBRead, ClueFormInput } from '@/types';
import { errorResponse, successResponse } from './utils';

export const saveClue = serverAction([requireAuthentication, requirePermissions('clues:admin'), _saveClue]);

/**
 * @private - exported for testing only, do not use directly
 */
export async function _saveClue(formData: ClueFormInput): Promise<ActionState<ClueDBRead>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	requestInfo.ctx.logger.debug('Growing zone form data received', { id: formData.id });

	try {
		const parsed = cluesSchemas.form.safeParse(formData);
		if (!parsed.success) {
			return errorResponse<ClueDBRead>(parsed.error.flatten().fieldErrors, 400);
		}
		if (parsed.data.id) {
			const updatedGrowingZone = await updateClue(parsed.data.id, parsed.data, userId, requestInfo.ctx.logger);
			return successResponse<ClueDBRead>(updatedGrowingZone);
		}
		const createdGrowingZone = await createClue(parsed.data, userId, requestInfo.ctx.logger);
		return successResponse<ClueDBRead>(createdGrowingZone);
	} catch (error) {
		requestInfo.ctx.logger.error('Failed to save growing zone', { error });
		return errorResponse<ClueDBRead>(error, 500, 'Failed to save growing zone');
	}
}
