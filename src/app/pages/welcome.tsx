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

			<div>
				<p>Count: {count}</p>
				<button type="submit" onClick={() => setCount(count + 1)} className={styles.button}>
					{' '}
					Increment
				</button>
			</div>

			<main>
				<section className={styles.section}>
					<h2 className={styles.sectionTitle}>Next steps</h2>
					<ol className={styles.list}>
						<li>
							Read the{' '}
							<a
								href="https://docs.rwsdk.com/getting-started/quick-start/"
								target="_blank"
								rel="noreferrer"
								className={styles.link}
							>
								Quick Start
							</a>{' '}
							to learn the basics.
						</li>
						<li>
							Explore React Server Components and Server Functions in the{' '}
							<a href="https://docs.rwsdk.com/" target="_blank" rel="noreferrer" className={styles.link}>
								Docs
							</a>
							.
						</li>
						<li>Join the community to ask questions and share what you’re building.</li>
					</ol>
				</section>
			</main>
		</div>
	);
};
