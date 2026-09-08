import type { RequestInfo } from 'rwsdk/worker';
import { DefaultLayout } from '@/layouts';

export default async function Pages__root({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	const isLoggedIn = !!ctx.user;

	return (
		<DefaultLayout pageTitle="Welcome" ctx={ctx} currentBasePage="home">
			<p>
				RWSDK Jeopardy is a real-time, multiplayer Jeopardy-style game — everyone plays on their own device, screen share is just
				for the display of the board, scores, or the active clue.
			</p>

			<h3>How a game works</h3>
			<ul>
				<li>
					<strong>Host</strong> — creates the game, controls the board, and judges responses.
				</li>
				<li>
					<strong>Display</strong> — a dedicated screen that shows the board and active clue, usually on a TV or shared monitor.
				</li>
				<li>
					<strong>Contestants</strong> — join from their phones, select clues, and buzz in to answer. Everyone stays in sync
					automatically.
				</li>
			</ul>

			{isLoggedIn ? (
				<div>
					<p>Ready to host a game?</p>
					<ul>
						<li>
							<a href="/games/listing">My Games</a>
						</li>
						<li>
							<a href="/games/new">Create a New Game</a>
						</li>
					</ul>
				</div>
			) : (
				<p>
					<a href="/auth/login">Log in</a> to create a game or scan the QR code on the display to join a game as a contestant (no
					login required to play a game someone else is hosting).
				</p>
			)}

			<p>
				Curious about what's under the hood? See the <a href="/about">About</a> page for a full architecture breakdown.
			</p>
		</DefaultLayout>
	);
}
