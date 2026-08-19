import { StrictMode } from 'react';
import type { DefaultAppContext } from 'rwsdk/worker';
import { KADAvatar } from '@/components/design-system';

export function RegisterLayout({
	children,
	ctx,
	pageTitle,
}: {
	children: React.ReactNode;
	ctx: DefaultAppContext;
	currentBasePage: string | undefined;
	pageTitle: string;
}): React.ReactNode {
	return (
		<StrictMode>
			<header className="register-header">
				<h1 className="welcome-title">RWSDK Jeopardy</h1>
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
