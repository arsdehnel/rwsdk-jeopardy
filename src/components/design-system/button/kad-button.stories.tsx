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
		label: 'Save Recipe',
	},
};

export const Submitting: Story = {
	args: {
		isSubmitting: true,
		label: 'Save Recipe',
	},
};

export const LongLabel: Story = {
	args: {
		isSubmitting: false,
		label: 'Save changes to this recipe and update all related seasonal ingredients',
	},
};
