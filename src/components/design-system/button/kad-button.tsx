'use client';
import type { KADButton as KADButtonType } from '@/types';
import styleClasses from './kad-button.module.css';

export default function KADButton({
	isSubmitting,
	label,
	requiredPermission,
	userPermissions,
	children,
	...other
}: KADButtonType): React.ReactNode {
	if (!userPermissions?.includes(requiredPermission)) {
		return null;
	}
	return (
		<button type="submit" disabled={isSubmitting} {...other} className={styleClasses.kadButton}>
			{label ?? children}
		</button>
	);
}
