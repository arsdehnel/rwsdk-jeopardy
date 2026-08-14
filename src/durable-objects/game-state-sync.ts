import { SyncedStateServer } from 'rwsdk/use-synced-state/worker';

export class GameStateSyncDurableObject extends SyncedStateServer {}

GameStateSyncDurableObject.registerSetStateHandler((key, value) => {
	// biome-ignore lint/suspicious/noConsole: short term while we do some logging
	console.log('State updated:', key, value);
});

GameStateSyncDurableObject.registerGetStateHandler((key, value) => {
	// biome-ignore lint/suspicious/noConsole: short term while we do some logging
	console.log('State read:', key, value);
});
