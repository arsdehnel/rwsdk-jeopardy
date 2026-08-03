import type { KADLink } from './kad-link';

export type KADTableColumn = {
	label: string;
	key: string;
	actions?: ({
		type: 'link' | 'button';
		hrefProp?: string;
		handler?: (val: string, record: Record<string, unknown>) => void;
	} & Omit<KADLink, 'userPermissions' | 'href'>)[];
	render?: (val: string, record: Record<string, unknown>) => React.ReactNode | string;
};
