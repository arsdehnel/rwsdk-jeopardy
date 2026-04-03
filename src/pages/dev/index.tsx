import { route } from 'rwsdk/router';
import DevBoardStyling from './board-styling';
import DevViewContestant from './view-contestant';
import DevViewDisplay from './view-display';
import DevViewHost from './view-host';

export default [
	route('/board-styling', DevBoardStyling),
	route('/view-contestant', DevViewContestant),
	route('/view-display', DevViewDisplay),
	route('/view-host', DevViewHost),
];
