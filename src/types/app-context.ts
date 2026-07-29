import type { KADLogger } from '@/types';
import type { Permission } from './permissions';
import type { Session } from './sessions';
import type { UserDBRead } from './users';

export interface AppContext {
	user?: UserDBRead | undefined;
	session?: Session | null;
	permissions: Permission[];
	logger: KADLogger;
}
