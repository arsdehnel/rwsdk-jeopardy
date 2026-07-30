import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { KADDate } from './kad-date';

const meta: Meta<typeof KADDate> = {
	component: KADDate,
	parameters: {
		layout: 'centered',
	},
};

export default meta;

type Story = StoryObj<typeof KADDate>;

export const Empty: Story = {
	args: {
		name: 'harvest_date',
		value: '',
		onBlur: fn(),
		onChange: fn(),
	},
};

export const WithValue: Story = {
	args: {
		name: 'harvest_date',
		value: '2024-06-15',
		onBlur: fn(),
		onChange: fn(),
	},
};
