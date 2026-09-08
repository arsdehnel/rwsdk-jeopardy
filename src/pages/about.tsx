import type { RequestInfo } from 'rwsdk/worker';
import { DefaultLayout } from '@/layouts';

export default async function Pages__about({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	return (
		<DefaultLayout pageTitle="About" ctx={ctx} currentBasePage="about">
			<p>
				This project started as an experiment: could <a href="https://rwsdk.com/">RedwoodSDK</a>'s{' '}
				<a href="https://docs.rwsdk.com/experimental/realtime/">
					<code>useSyncedState</code>
				</a>{' '}
				hook power a real multiplayer game where every connected device stays perfectly in sync — with no manual API wiring? The
				short answer turned out to be yes, and what began as a throwaway prototype grew into a reasonably complete Jeopardy-style
				game.
			</p>

			<h3>Architecture</h3>

			<h4>RedwoodSDK</h4>
			<p>
				The app runs on <a href="https://rwsdk.com/">RedwoodSDK</a>, a React framework built for Cloudflare Workers. It brings
				React Server Components to the edge — pages are rendered server-side on Cloudflare's global network, with client
				components hydrating only where interactivity is needed. Routing is defined in a single <code>worker.tsx</code> entry
				point using RedwoodSDK's composable <code>route</code>/<code>prefix</code> helpers.
			</p>

			<h4>
				Real-time state with <code>useSyncedState</code>
			</h4>
			<p>
				The core mechanic of any multiplayer game is shared, synchronized state. RedwoodSDK's <code>useSyncedState</code> hook
				handles this without any manual WebSocket plumbing. Each piece of game state — the selected clue, buzzer queue, scores,
				active contestant, game phase — has a unique key. When any client updates that key, the backing Durable Object broadcasts
				the new value to every other connected client instantly.
			</p>
			<p>
				From the client's perspective it reads like a simple <code>useState</code> replacement. From the server's perspective, a{' '}
				<code>GameStateSyncDurableObject</code> (which extends RedwoodSDK's <code>SyncedStateServer</code>) manages the WebSocket
				connections, holds current state in memory, and seeds initial values from the database when a new session starts.
			</p>

			<h4>Cloudflare Durable Objects</h4>
			<p>Two Durable Objects power the app:</p>
			<ul>
				<li>
					<strong>GameStateSyncDurableObject</strong> — one instance per game, keeps all connected clients in sync via WebSockets.
					State is held in memory inside the DO and broadcast on every write.
				</li>
				<li>
					<strong>SessionDurableObject</strong> — manages authenticated sessions with a 14-day lifetime. Sessions are referenced
					via HMAC-signed cookies so session data never travels over the wire unnecessarily.
				</li>
			</ul>

			<h4>Cloudflare D1 (SQLite)</h4>
			<p>
				Persistent data — games, categories, clues, contestants, scores — lives in a Cloudflare D1 database. D1 is SQLite running
				at the edge. Drizzle ORM provides a type-safe query layer and handles migrations. The Durable Object seeds its in-memory
				state from D1 on first access, then keeps an authoritative copy in memory for the life of the game session.
			</p>

			<h4>Authentication</h4>
			<p>
				Logins use <a href="https://webauthn.guide/">WebAuthn passkeys</a> via the SimpleWebAuthn library — no passwords, no OAuth
				redirects. Registration and verification are handled server-side in the <code>/auth</code> routes, with credential storage
				in D1.
			</p>

			<h4>Build &amp; deployment</h4>
			<p>
				The build pipeline is Vite with Cloudflare's Vite plugin. The output is a single Cloudflare Worker bundle deployed
				globally. Environments (development, staging, production) are managed via <code>wrangler.jsonc</code>.
			</p>

			<h3>Source</h3>
			<p>
				The full source is on GitHub: <a href="https://github.com/arsdehnel/rwsdk-jeopardy">arsdehnel/rwsdk-jeopardy</a>.
			</p>
		</DefaultLayout>
	);
}
