import type { GeneratedCategory } from '@/types';

export default function ViewCategory({ title, clues }: GeneratedCategory): React.ReactNode {
	return (
		<>
			<p>{title}</p>
			<ol>
				{clues?.map(clue => {
					return (
						<li key={clue.clue}>
							<strong>{clue.clue}</strong> ({clue.response})
						</li>
					);
				})}
			</ol>
		</>
	);
}
