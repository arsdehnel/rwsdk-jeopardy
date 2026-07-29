import type { RequestInfo } from 'rwsdk/worker';
import SetupLayout from '@/layouts/setup';

export default async function Pages__profile__root({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	return (
		<SetupLayout currentBasePage="profile" pageTitle="Profile" ctx={ctx}>
			<h2>Profile Info</h2>
			<ul>
				<li>ID: {ctx.user?.id}</li>
				<li>Username: {ctx.user?.username}</li>
				<li>Roles: {ctx.user?.role}</li>
				<li>Created: {ctx.user?.createdAt}</li>
			</ul>
		</SetupLayout>
	);
}
