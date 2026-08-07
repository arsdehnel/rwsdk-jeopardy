import { route } from 'rwsdk/router';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import Pages__Admin__Categories_Clues__Listing from './categories/clues/listing';
import Pages__admin__categories__clues__verify from './categories/clues/verify';
import Pages__Admin__Categories__Listing from './categories/listing';
import Pages__admin__categories__verify from './categories/verify';

export default [
	route('/categories', [requireAuthentication, requirePermissions('categories:admin'), Pages__Admin__Categories__Listing]),
	route('/categories/:categoryId/verify', [
		requireAuthentication,
		requirePermissions('verifications:create'),
		Pages__admin__categories__verify,
	]),
	route('/categories/:categoryId/clues', [
		requireAuthentication,
		requirePermissions('clues:admin'),
		Pages__Admin__Categories_Clues__Listing,
	]),
	route('/categories/:categoryId/clues/:clueId/verify', [
		requireAuthentication,
		requirePermissions('verifications:create'),
		Pages__admin__categories__clues__verify,
	]),
];
