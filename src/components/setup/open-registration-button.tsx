'use client';
import { openRegistration } from '@/actions/games';

export function OpenRegistrationButton({
	gamePhase,
	isRegisterable,
	gameId,
	isRegisterableErrors,
}: {
	gamePhase: string;
	isRegisterable: boolean;
	gameId: string;
	isRegisterableErrors: string;
}): React.ReactNode {
	return (
		<div>
			{gamePhase === 'SETUP' ? (
				<div>
					<p>Registration</p>
					{isRegisterable ? (
						<button
							type="button"
							onClick={(): void => {
								openRegistration({ gameId });
							}}
						>
							Open Registration
						</button>
					) : (
						<pre>{isRegisterableErrors}</pre>
					)}
				</div>
			) : (
				<a href={`/games/${gameId}/register`}>View Registration Page</a>
			)}
		</div>
	);
}
