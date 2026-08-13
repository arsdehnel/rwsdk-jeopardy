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

GameStateSyncDurableObject.registerKeyHandler(async (key, stub) => {
	// Access user ID from request context
	// const userId = requestInfo.ctx.userId;

	// // Scope keys that start with "user:" to the current user
	// if (key.startsWith('user:')) {
	// 	return `${key}:${userId}`;
	// }

	const stubData = await stub.getState(key);
	// biome-ignore lint/suspicious/noConsole: short term while we do some logging
	console.log(stubData);
	// biome-ignore lint/suspicious/noConsole: short term while we do some logging
	console.log(`Stub ID: ${stub.id}`);
	// biome-ignore lint/suspicious/noConsole: short term while we do some logging
	console.log(`Stub name: ${stub.name}`);

	return key;
});
