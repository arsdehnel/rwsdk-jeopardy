import type { Meta, StoryObj } from '@storybook/react';
import KADButton from './kad-button';

const meta: Meta<typeof KADButton> = {
	component: KADButton,
	parameters: {
		layout: 'centered',
	},
};

export default meta;

type Story = StoryObj<typeof KADButton>;

export const Default: Story = {
	args: {
		isSubmitting: false,
		label: 'Save Category',
	},
};

export const Submitting: Story = {
	args: {
		isSubmitting: true,
		label: 'Save Category',
	},
};

export const LongLabel: Story = {
	args: {
		isSubmitting: false,
		label: 'Save changes to this category and update all related clues and point values',
	},
};
