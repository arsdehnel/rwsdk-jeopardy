import { EnterIcon, ExitIcon, HomeIcon, IconJarLogoIcon, InfoCircledIcon, MixIcon } from '@radix-ui/react-icons';
import type { NavItem, Permission } from '@/types';

export const navItems: Record<string, NavItem[]> = {
	main: [
		{ key: 'home', label: 'Home', href: '/', icon: HomeIcon, requiredPermission: '__controls:read' },
		{ key: 'about', label: 'About', href: '/about', icon: InfoCircledIcon, requiredPermission: '__controls:read' },
		{
			key: 'games',
			label: 'My Games',
			href: '/games/listing',
			icon: IconJarLogoIcon,
			requiredPermission: 'games:read',
		},
		{
			key: 'categories',
			label: 'Categories',
			href: '/admin/categories',
			icon: MixIcon,
			requiredPermission: 'categories:admin',
		},
		{
			key: 'login',
			label: 'Login',
			href: '/auth/login',
			icon: EnterIcon,
			requiredPermission: 'auth:login',
			basePage: 'auth',
		},
		{
			key: 'logout',
			label: 'Logout',
			href: '/auth/logout',
			icon: ExitIcon,
			requiredPermission: 'auth:logout',
			basePage: 'auth',
		},
	],
};

export function getNavItems(navType: keyof typeof navItems, userPerms: Permission[] = []): NavItem[] {
	const typeNavItems = navItems[navType];
	return typeNavItems.filter(i => {
		if (!userPerms?.includes(i.requiredPermission)) {
			return false;
		}
		return true;
	});
}
