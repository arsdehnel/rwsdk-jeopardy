import type { Permission } from '@/types';

export function HostRegistration({
	registerAsHost,
	userPermissions,
}: {
	registerAsHost: () => void;
	userPermissions: Permission[];
}): React.ReactNode {
	if (!userPermissions.includes('games:host')) {
		return <p>If you want to register as the host please log in first</p>;
	}
	return (
		<>
			<p>Host registration</p>
			<button
				className="registration-button"
				type="button"
				onClick={(): void => {
					registerAsHost();
				}}
			>
				Register this device as the host
			</button>
		</>
	);
}
