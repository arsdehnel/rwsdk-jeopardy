import { route } from 'rwsdk/router';
import DevBoardStyling from './board-styling';
import DevClueSelectStyling from './clue-select-styling';

export default [route('/clue-select-styling', DevClueSelectStyling), route('/board-styling', DevBoardStyling)];
