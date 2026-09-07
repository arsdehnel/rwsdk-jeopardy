import { describe, expect, it } from 'vitest';
import { KADRegistrationError } from '../kad-registration-error';

describe('KADRegistrationError', () => {
	it('is an instance of Error', () => {
		expect(new KADRegistrationError('host_exists')).toBeInstanceOf(Error);
	});

	it('has name KADRegistrationError', () => {
		expect(new KADRegistrationError('host_exists').name).toBe('KADRegistrationError');
	});

	it('sets message to the reason', () => {
		const err = new KADRegistrationError('role_change');
		expect(err.message).toBe('role_change');
	});

	it.each([['host_exists'], ['display_exists'], ['role_change'], ['duplicate_id'], ['missing_id']] as const)(
		'stores reason "%s" on the instance',
		reason => {
			const err = new KADRegistrationError(reason);
			expect(err.reason).toBe(reason);
		},
	);
});
