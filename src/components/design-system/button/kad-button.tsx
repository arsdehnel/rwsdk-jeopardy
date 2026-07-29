'use client';
import type { KADButton as KADButtonType } from '@/types';
import styleClasses from './kad-button.module.css';

export default function KADButton({
	isSubmitting,
	label,
	requiredPermission,
	userPermissions,
	...other
}: KADButtonType): React.ReactNode {
	if (!userPermissions?.includes(requiredPermission)) {
		return null;
	}
	return (
		<button type="submit" disabled={isSubmitting} className={styleClasses['kad-button']} {...other}>
			{label}
		</button>
	);
}
