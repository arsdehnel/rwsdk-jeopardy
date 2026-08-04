import type { JSX } from 'react';
import type { Permission } from '@/types';

export type KADButton = {
	isSubmitting?: boolean;
	label?: JSX.Element | string;
	userPermissions: Permission[];
	requiredPermission: Permission;
} & React.ComponentPropsWithoutRef<'button'>;
