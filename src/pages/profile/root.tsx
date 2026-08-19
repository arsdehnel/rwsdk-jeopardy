import type { RequestInfo } from 'rwsdk/worker';
import { DefaultLayout } from '@/layouts';

export default async function Pages__profile__root({ ctx }: RequestInfo): Promise<React.JSX.Element> {
	return (
		<DefaultLayout currentBasePage="profile" pageTitle="Profile" ctx={ctx}>
			<h2>Profile Info</h2>
			<ul>
				<li>ID: {ctx.user?.id}</li>
				<li>Username: {ctx.user?.username}</li>
				<li>Roles: {ctx.user?.role}</li>
				<li>Created: {ctx.user?.createdAt}</li>
			</ul>
		</DefaultLayout>
	);
}
