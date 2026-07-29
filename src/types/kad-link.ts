import type { JSX } from 'react';
import type { Permission } from '@/types';

export type KADLink = {
	href: string;
	label: JSX.Element | string;
	userPermissions: Permission[];
	requiredPermission: Permission;
} & React.ComponentPropsWithoutRef<'a'>;
