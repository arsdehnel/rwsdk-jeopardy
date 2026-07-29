import { route } from 'rwsdk/router';
import { requireAuthentication, requirePermissions } from '@/interrupters';
import Pages__profile__root from './root';

export default [route('/', [requireAuthentication, requirePermissions('profile:read'), Pages__profile__root])];
