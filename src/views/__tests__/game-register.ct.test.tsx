import { expect, test } from '@playwright/experimental-ct-react';
import RegisterShell from '../__shells__/_register-shell';

test('registration page — no one registered', async ({ mount }) => {
	const component = await mount(
		<RegisterShell
			hasHost={false}
			hasDisplay={false}
			contestants={[]}
			userPermissions={['games:host']}
			gameRegistrationUrl="https://example.com/games/mock-id/register"
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('registration page — host slot already taken', async ({ mount }) => {
	const component = await mount(
		<RegisterShell
			hasHost={true}
			hasDisplay={false}
			contestants={[]}
			userPermissions={['games:host']}
			gameRegistrationUrl="https://example.com/games/mock-id/register"
		/>,
	);
	await expect(component).toHaveScreenshot();
});

test('registration page — display slot already taken', async ({ mount }) => {
	const component = await mount(
		<RegisterShell
			hasHost={false}
			hasDisplay={true}
			contestants={[]}
			userPermissions={['games:host']}
			gameRegistrationUrl="https://example.com/games/mock-id/register"
		/>,
	);
	await expect(component).toHaveScreenshot();
});
