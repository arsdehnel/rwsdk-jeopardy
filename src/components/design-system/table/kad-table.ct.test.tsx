import { expect, test } from '@playwright/experimental-ct-react';
import type { KADTableColumn } from '@/types';
import KADTable from './kad-table';

const columns: KADTableColumn[] = [
	{ key: 'title', label: 'Title' },
	{ key: 'status', label: 'Status' },
];

const data = [
	{ id: '1', title: 'Pasta Carbonara', status: 'published' },
	{ id: '2', title: 'Beef Bourguignon', status: 'draft' },
];

test('renders column headers and rows', async ({ mount }) => {
	const component = await mount(<KADTable userPermissions={['__controls:read']} columns={columns} data={data} />);
	await expect(component).toHaveScreenshot();
});

test('renders empty state with no rows', async ({ mount }) => {
	const component = await mount(<KADTable userPermissions={['__controls:read']} columns={columns} data={[]} />);
	await expect(component).toHaveScreenshot();
});

test('renders custom cell via render function', async ({ mount }) => {
	const columnsWithRender: KADTableColumn[] = [
		{ key: 'title', label: 'Title' },
		{
			key: 'status',
			label: 'Status',
			render: val => val.toUpperCase(),
		},
	];
	const component = await mount(<KADTable userPermissions={['__controls:read']} columns={columnsWithRender} data={data} />);
	await expect(component).toHaveScreenshot();
});
