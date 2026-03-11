import { route } from 'rwsdk/router';
import DevBoardStyling from './board-styling';
import DevUsedClueStyling from './used-clue-styling';

export default [route('/used-clue-styling', DevUsedClueStyling), route('/board-styling', DevBoardStyling)];
