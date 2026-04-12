'use client';
import { navigate } from 'rwsdk/client';

export const Home = () => {
	const createGame = () => {
		const gameId = crypto.randomUUID();
		navigate(`/games/${gameId}`);
	};

	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">Welcome!</h2>
				<p>
					This is really just a way for me to mess around with <a href="https://rwsdk.com/">RedwoodSDK</a> and their
					sweet{' '}
					<a href="https://docs.rwsdk.com/experimental/realtime/">
						<code>useSyncedState</code>
					</a>{' '}
					realtime hook.
				</p>
				<h2>Play a Game</h2>
				<button type="button" onClick={createGame}>
					Create New Game
				</button>
			</main>
		</>
	);
};
