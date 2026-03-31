'use client';
import { Cross2Icon, RowSpacingIcon } from '@radix-ui/react-icons';
import { Collapsible } from 'radix-ui';
import { useState } from 'react';
import type { Category, Clue } from '@/types';

export default function ClueSelect({
	categories,
	selectClue,
	usedClueIds,
}: {
	categories: Category[];
	selectClue: (clue: Clue) => void;
	usedClueIds: string[];
}) {
	const [openCategory, setOpenCategory] = useState('');

	const toggleCategory = (categoryId: string) => {
		if (openCategory === categoryId) {
			setOpenCategory('');
		} else {
			setOpenCategory(categoryId);
		}
	};
	return (
		<>
			<h1 className="welcome-title">RWSDK Jeopardy</h1>
			<main>
				<h2 className="page-title">Select A Clue</h2>
				<div className="clue-select">
					{categories.map(category => {
						return (
							<Collapsible.Root
								key={category.id}
								className="CollapsibleRoot"
								open={openCategory === category.id}
								onOpenChange={() => toggleCategory(category.id)}
							>
								<div className="clue-select-category">
									<h3>{category.title}</h3>
									<Collapsible.Trigger asChild>
										<button type="button" className="IconButton">
											{openCategory === category.id ? <Cross2Icon /> : <RowSpacingIcon />}
										</button>
									</Collapsible.Trigger>
								</div>
								<Collapsible.Content>
									<ul className="clue-select-clue-options">
										{category.clues.map((clue: Clue) => {
											return (
												<li key={clue.id}>
													<button type="button" onClick={() => selectClue(clue)} disabled={usedClueIds.includes(clue.id)}>
														{clue.value}
													</button>
												</li>
											);
										})}
									</ul>
								</Collapsible.Content>
							</Collapsible.Root>
						);
					})}
				</div>
			</main>
		</>
	);
}
