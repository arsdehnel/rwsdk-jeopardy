import type { Session } from '@/session/durable-object';

interface AppContext {
	session?: Session | null;
}

declare module 'rwsdk/worker' {
	interface DefaultAppContext extends AppContext {}
}
