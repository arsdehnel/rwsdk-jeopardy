'use client';
import type { KADLink as KADLinkType } from '@/types';

export default function KADLink({ label, requiredPermission, userPermissions, ...other }: KADLinkType): React.ReactNode {
	if (!userPermissions?.includes(requiredPermission)) {
		return null;
	}
	return <a {...other}>{label}</a>;
}
