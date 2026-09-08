import type { KADTableColumn } from '@/types';
import KADTable from '../kad-table';

const data = [
	{ id: '1', title: 'Pasta Carbonara', status: 'published' },
	{ id: '2', title: 'Beef Bourguignon', status: 'draft' },
];

// Wrapper needed because function props can't cross the Playwright CT serialization boundary.
// Defining the render function inside a component means it executes in browser context directly.
export function KADTableWithRender() {
	const columns: KADTableColumn[] = [
		{ key: 'title', label: 'Title' },
		{ key: 'status', label: 'Status', render: val => val.toUpperCase() },
	];
	return <KADTable userPermissions={['__controls:read']} columns={columns} data={data} />;
}
