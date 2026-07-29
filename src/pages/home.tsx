import type { RequestInfo } from 'rwsdk/worker';
import SetupLayout from '@/layouts/setup';

export default async function Pages__Home({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	return (
		<SetupLayout pageTitle="Welcome" ctx={ctx} currentBasePage="home">
			<p>
				This started as just a way for me to mess around with <a href="https://rwsdk.com/">RedwoodSDK</a> and their sweet{' '}
				<a href="https://docs.rwsdk.com/experimental/realtime/">
					<code>useSyncedState</code>
				</a>{' '}
				realtime hook. But it's grown into a pretty nice setup for playing a Jeopardy-style game in a group setting with
				contestants each on their own devices.
			</p>
		</SetupLayout>
	);
}
