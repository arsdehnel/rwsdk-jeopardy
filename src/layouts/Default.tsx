import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { StrictMode } from 'react';
import type { DefaultAppContext } from 'rwsdk/worker';
import { KADAvatar } from '@/components/design-system';
import { getNavItems } from '@/data/navigation';

export function DefaultLayout({
	children,
	ctx,
	currentBasePage,
	pageTitle,
}: {
	children: React.ReactNode;
	ctx: DefaultAppContext;
	currentBasePage: string | undefined;
	pageTitle: string;
}): React.ReactNode {
	const userPerms = ctx.permissions;

	const mainNavItems = getNavItems('main', userPerms);

	return (
		<StrictMode>
			<header className="default-header">
				<h1 className="welcome-title">RWSDK Jeopardy</h1>
				<KADAvatar user={ctx.user} classNameRoot="header-avatar" />
				<nav className="main-nav">
					{mainNavItems.map(item => {
						const Icon = item.icon || QuestionMarkCircledIcon;
						return (
							<a
								key={item.key}
								className={classNames({
									'nav-item': true,
									'nav-item-active': currentBasePage === item.key,
								})}
								href={item.href}
							>
								<span className="nav-item-icon">
									<Icon />
								</span>
								<span className="nav-item-label">{item.label}</span>
							</a>
						);
					})}
				</nav>
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
