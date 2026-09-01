import { SyncedStateServer } from 'rwsdk/use-synced-state/worker';
import { handleGetState } from './handle-get-state-dispatch';
import { handleSetState } from './handle-set-state-dispatch';

export class GameStateSyncDurableObject extends SyncedStateServer {}

GameStateSyncDurableObject.registerSetStateHandler(handleSetState);
GameStateSyncDurableObject.registerGetStateHandler(handleGetState);
