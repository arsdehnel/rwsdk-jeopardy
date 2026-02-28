'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import type { RequestInfo } from 'rwsdk/worker';

import Board from '@/app/components/board';
import QuestionOverlay from '@/app/components/question-overlay';
import getCategories from '@/categories';

export default function Game({ params }: RequestInfo) {
	const [selectedQuestion, setSelectedQuestion] = useSyncedState({}, 'selectedQuestion');
	const [questionState, setQuestionState] = useSyncedState('initial', 'questionState');

	const gameId = params.gameId;
	if (!gameId) {
		return <p>Game ID not provided</p>;
	}

	const selectQuestion = (question: object) => {
		setSelectedQuestion(question);
		setQuestionState('question');
	};

	const categories = getCategories();
	return (
		<>
			<QuestionOverlay selectedQuestion={selectedQuestion} setQuestionState={setQuestionState} questionState={questionState} />
			<Board categories={categories} selectQuestion={selectQuestion} />
		</>
	);
}
