'use server';
import { requestInfo, serverAction } from 'rwsdk/worker';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import { verifyCategory, verifyClue } from '@/repositories';
import { verificationsSchemas } from '@/schemas';
import type { ActionState, VerificationDBRead, VerificationFormInput } from '@/types';
import { errorResponse, successResponse } from './utils';

export const saveVerification = serverAction([
	requireAuthentication,
	requirePermissions('verifications:create'),
	_saveVerification,
]);

/**
 * @private - exported for testing only, do not use directly
 */
export async function _saveVerification(formData: VerificationFormInput): Promise<ActionState<VerificationDBRead>> {
	const { ctx } = requestInfo;
	// biome-ignore lint/style/noNonNullAssertion: guaranteed by requireAuthentication in serverAction chain
	const userId = ctx.user!.id;

	requestInfo.ctx.logger.debug('Verification form data received', {
		id: formData.id,
		categoryId: formData.categoryId,
		clueId: formData.clueId,
	});

	try {
		const parsed = verificationsSchemas.form.safeParse(formData);
		if (!parsed.success) {
			return errorResponse<VerificationDBRead>(parsed.error.flatten().fieldErrors, 400);
		}
		if (parsed.data.id) {
			requestInfo.ctx.logger.error('Updating existing verifications is not implemented yet');
			return errorResponse<VerificationDBRead>(
				`Updating existing verifications is not implemented yet`,
				400,
				'Request included ID which indicates updating an existing verification which has not been implemented yet',
			);
		} else {
			if (parsed.data.clueId && parsed.data.categoryId) {
				requestInfo.ctx.logger.error(
					`Both Clue ID ${parsed.data.clueId} and Category ID ${parsed.data.categoryId} were provided but we need one or the other`,
				);
				return errorResponse<VerificationDBRead>(
					`Request to verify must include a single identifier`,
					400,
					`Request to verify must include a single identifier`,
				);
			} else if (parsed.data.categoryId) {
				const categoryVerification = await verifyCategory(parsed.data.categoryId, userId, requestInfo.ctx.logger);
				return successResponse<VerificationDBRead>(categoryVerification.verification);
			} else if (parsed.data.clueId) {
				const clueVerification = await verifyClue(parsed.data.clueId, userId, requestInfo.ctx.logger);
				return successResponse<VerificationDBRead>(clueVerification.verification);
			}
		}
		requestInfo.ctx.logger.error('Request did not include categoryId or clueId');
		return errorResponse<VerificationDBRead>(
			`Request must include categoryId or clueId`,
			400,
			'Request did not include categoryId or clueId',
		);
	} catch (error) {
		requestInfo.ctx.logger.error('Failed to save verification', { error });
		return errorResponse<VerificationDBRead>(error, 500, 'Failed to save verification');
	}
}
