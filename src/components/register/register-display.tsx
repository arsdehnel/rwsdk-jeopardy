export function RegisterDisplay({ registerAsDisplay }: { registerAsDisplay: () => void }): React.ReactNode {
	return (
		<>
			<p>
				No devices are registered yet. The first device to register will be the display. If you want another device to act as the
				display please start the game on that one.
			</p>
			<button
				type="button"
				onClick={(): void => {
					registerAsDisplay();
				}}
			>
				Register this device as the display
			</button>
		</>
	);
}
