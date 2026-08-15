'use client';
import { useState } from 'react';

export function RegisterContestant({
	registerAsContestant,
	userId,
}: {
	registerAsContestant: (name: string, userId: string | undefined) => void;
	userId?: string;
}): React.ReactNode {
	const [name, setName] = useState('');

	return (
		<>
			<p>Contestant</p>
			<label htmlFor="name">Name:</label>
			<input
				id="name"
				type="text"
				placeholder="Your name here"
				value={name}
				onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setName(e.target.value)}
			/>
			<button
				type="button"
				disabled={!name}
				onClick={(): void => {
					registerAsContestant(name, userId);
				}}
			>
				Register this device as the host
			</button>
		</>
	);
}
