import { useState } from 'react';

// Mirrors the useSyncedState signature but uses local React state.
// Broadcasting behavior is RWSDK's responsibility — not ours to test.
export function useSyncedState<T>(initialValue: T, _key: string): [T, (value: T) => void] {
	return useState<T>(initialValue);
}
