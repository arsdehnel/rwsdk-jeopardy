export const Home = () => {
	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">Welcome!</h2>
				<p>
					This is really just a way for me to mess around with <a href="https://rwsdk.com/">RedwoodSDK</a> and their sweet{' '}
					<a href="https://docs.rwsdk.com/experimental/realtime/">
						<code>useSyncedState</code>
					</a>{' '}
					realtime hook.
				</p>
				<h2>Play a Game</h2>
				<p>
					To play a game we just have these static links for now. In the future we will add a way to make your own custom and
					private game.
				</p>
				<div className="games-listing">
					<ul>
						<li>
							<a href="/games/123">Game 123</a>
						</li>
						<li>
							<a href="/games/456">Game 456</a>
						</li>
						<li>
							<a href="/games/789">Game 789</a>
						</li>
					</ul>
				</div>
			</main>
		</>
	);
};
