export function HostRegistration({ registerAsHost }: { registerAsHost: () => void }): React.ReactNode {
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
