export class KADRegistrationError extends Error {
	constructor(public readonly reason: 'host_exists' | 'display_exists' | 'role_change' | 'duplicate_id' | 'missing_id') {
		super(reason);
		this.name = 'KADRegistrationError';
	}
}
