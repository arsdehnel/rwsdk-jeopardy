'use client';
import Scoreboard from '@/app/components/scoreboard';
import type { Connections } from '@/types';

export default function FinishedView({ connections }: { connections: Connections }) {
	return (
		<>
			<h1>Game Over</h1>
			<Scoreboard connections={connections} />
		</>
	);
}
