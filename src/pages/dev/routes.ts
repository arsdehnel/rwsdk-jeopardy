import { route } from 'rwsdk/router';
import Pages__dev__games__play__contestant from './games/play/contestant';
import Pages__dev__games__play__display from './games/play/display';
import Pages__dev__games__play__host from './games/play/host';

export default {
	app: [
		route('/games/play/display', Pages__dev__games__play__display),
		route('/games/play/host', Pages__dev__games__play__host),
		route('/games/play/contestant', Pages__dev__games__play__contestant),
	],
};
