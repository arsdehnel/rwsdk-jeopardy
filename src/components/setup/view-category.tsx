import type { GeneratedCategory } from '@/types';

export default function ViewCategory({ name, clues }: GeneratedCategory): React.ReactNode {
	return (
		<>
			<p>{name}</p>
			<ol>
				{clues?.map(clue => {
					return (
						<li key={clue.text}>
							<strong>{clue.text}</strong> ({clue.response})
						</li>
					);
				})}
			</ol>
		</>
	);
}
