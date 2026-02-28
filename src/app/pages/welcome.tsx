'use client';

import { useSyncedState } from 'rwsdk/use-synced-state/client';
import styles from './welcome.module.css';

export const Welcome = () => {
	const [count, setCount] = useSyncedState(0, 'counter');

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<h1 className={styles.title}>Welcome to RedwoodSDK</h1>
				<p className={styles.subtitle}>You’ve just installed the starter project. Here’s what to do next.</p>
			</header>

			<a href="/board">Go to board</a>

			<div>
				<p>Count: {count}</p>
				<button type="submit" onClick={() => setCount(count + 1)} className={styles.button}>
					{' '}
					Increment
				</button>
			</div>
		</div>
	);
};
