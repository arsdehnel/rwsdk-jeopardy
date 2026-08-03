import { KADButton } from '@/components/design-system';
import type { Permission } from '@/types';
import { useFormContext } from './context';

export function SubmitButton({
	label,
	userPermissions,
	requiredPermission,
}: {
	label: string;
	userPermissions: Permission[];
	requiredPermission: Permission;
}): React.ReactNode {
	const form = useFormContext();
	return (
		<form.Subscribe selector={(state: { isSubmitting: boolean }): boolean => state.isSubmitting}>
			{(isSubmitting: boolean): React.ReactNode => (
				<KADButton
					isSubmitting={isSubmitting}
					label={label}
					userPermissions={userPermissions}
					requiredPermission={requiredPermission}
				/>
			)}
		</form.Subscribe>
	);
}
