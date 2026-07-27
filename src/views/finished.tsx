'use client';
import Scoreboard from '@/components/scoreboard';
import type { Connections } from '@/types';

export default function FinishedView({
	connections,
	scores,
}: {
	connections: Connections;
	scores: Record<string, number>;
}): React.ReactNode {
	return (
		<>
			<h1>Game Over</h1>
			<Scoreboard connections={connections} scores={scores} />
		</>
	);
}
