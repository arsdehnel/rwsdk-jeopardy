import { StrictMode } from 'react';
import type { DefaultAppContext } from 'rwsdk/worker';
import { KADAvatar } from '@/components/design-system';

export default function SetupLayout({
	children,
	pageTitle,
	ctx,
}: {
	children: React.ReactNode;
	pageTitle: string;
	ctx: DefaultAppContext;
}): React.ReactNode {
	return (
		<StrictMode>
			<header className="setup-header">
				<h1 className="welcome-title">RWSDK Jeopardy</h1>
				<nav className="main-nav"></nav>
				<KADAvatar user={ctx.user} classNameRoot="header-avatar" />
			</header>
			<main>
				<h2 className="page-title">{pageTitle}</h2>
				<div className="app-layout-inner">
					<div className="app-layout-content">{children}</div>
				</div>
			</main>
		</StrictMode>
	);
}
