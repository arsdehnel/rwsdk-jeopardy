import { route } from 'rwsdk/router';
import DevBoardStyling from './board-styling';
import DevClueSelectStyling from './clue-select-styling';
import DevViewContestant from './view-contestant';
import DevViewDisplay from './view-display';

export default [
	route('/clue-select-styling', DevClueSelectStyling),
	route('/board-styling', DevBoardStyling),
	route('/view-contestant', DevViewContestant),
	route('/view-display', DevViewDisplay),
];
