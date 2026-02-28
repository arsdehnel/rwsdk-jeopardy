'use client';
import { useSyncedState } from 'rwsdk/use-synced-state/client';
import getCategories from '@/categories';
import Category from '../components/category';
import QuestionOverlay from '../components/question-overlay';

function Board() {
	const [selectedQuestion, setSelectedQuestion] = useSyncedState({}, 'selectedQuestion');
	const [questionState, setQuestionState] = useSyncedState('initial', 'questionState');

	const selectQuestion = (question: object) => {
		setSelectedQuestion(question);
		setQuestionState('question');
	};

	const categories = getCategories();
	return (
		<>
			<QuestionOverlay selectedQuestion={selectedQuestion} setQuestionState={setQuestionState} questionState={questionState} />
			<div className="jeopardy-board">
				{categories.map(category => (
					<Category key={category.id} category={category} selectQuestion={selectQuestion} />
				))}
			</div>
		</>
	);
}

export default Board;
