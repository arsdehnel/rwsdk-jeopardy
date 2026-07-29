import type { Meta, StoryObj } from '@storybook/react';
import KADLink from './kad-link';

const meta: Meta<typeof KADLink> = {
	component: KADLink,
	parameters: {
		layout: 'centered',
	},
};

export default meta;

type Story = StoryObj<typeof KADLink>;

export const Visible: Story = {
	args: {
		href: '/games/new',
		label: 'New Game',
		requiredPermission: 'categories:read',
		userPermissions: ['categories:read'],
	},
};

export const Hidden: Story = {
	args: {
		href: '/games/new',
		label: 'Generate Category',
		requiredPermission: 'categories:generate',
		userPermissions: ['categories:read'],
	},
};

export const ExternalLink: Story = {
	args: {
		href: 'https://example.com/jeopardy-guide',
		label: 'How to Play Jeopardy',
		requiredPermission: '__controls:read',
		userPermissions: ['__controls:read'],
		target: '_blank',
		rel: 'noopener noreferrer',
	},
};

export const JSXLabel: Story = {
	args: {
		href: '/games/new',
		label: <strong>Browse Categories</strong>,
		requiredPermission: 'categories:read',
		userPermissions: ['categories:read'],
	},
};
