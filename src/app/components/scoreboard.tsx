'use client';

export default function Scoreboard({ connections, setGameState }: { connections: any; setGameState: (state: string) => void }) {
	return (
		<div className="jeopardy-scoreboard">
			<h2>Scoreboard</h2>
			<ul>
				{connections.members.map((member: any) => (
					<li key={member.id}>{member.name}</li>
				))}
			</ul>
			<button type="button" onClick={() => setGameState('setup')}>
				Back to Setup
			</button>
			<button type="button" onClick={() => setGameState('end')}>
				End Game
			</button>
		</div>
	);
}
