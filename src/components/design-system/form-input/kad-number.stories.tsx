import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { KADNumber } from './kad-number';

const meta: Meta<typeof KADNumber> = {
	component: KADNumber,
	parameters: {
		layout: 'centered',
	},
};

export default meta;

type Story = StoryObj<typeof KADNumber>;

export const Empty: Story = {
	args: {
		name: 'quantity',
		value: '',
		onBlur: fn(),
		onChange: fn(),
	},
};

export const WithValue: Story = {
	args: {
		name: 'quantity',
		value: '4',
		onBlur: fn(),
		onChange: fn(),
	},
};

export const NegativeValue: Story = {
	args: {
		name: 'temperature_adjustment',
		value: '-10',
		onBlur: fn(),
		onChange: fn(),
	},
};
