import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Design System/Utility Classes',
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj;

export const TextStyles: Story = {
    render: () => (
        <div className="space-y-4 p-6 bg-surface text-text-primary">
            <h1 className="text-heading">This is a .text-heading</h1>
            <h2 className="text-title">This is a .text-title</h2>
            <p className="text-body">This is a .text-body paragraph with secondary text.</p>
            <p className="text-gradient text-2xl font-bold">This is .text-gradient</p>
            <div className="text-truncate w-48 border border-border-light">
                This is a very long line that should be truncated if it overflows the box.
            </div>
        </div>
    ),
};

export const Borders: Story = {
    render: () => (
        <div className="flex flex-col gap-4 p-6 bg-surface text-text-primary">
            <div className="border-base p-4">This box uses `.border-base`</div>
            <div className="border-light p-4">This box uses `.border-light`</div>
        </div>
    ),
};

export const ErrorMessageExample: Story = {
    render: () => (
        <div className="p-6 bg-surface text-text-primary">
            <label htmlFor="input">Email</label>
            <input
                type="email"
                id="input"
                className="block mt-2 p-2 border border-border-light bg-surface-light text-text-primary w-full"
                placeholder="example@email.com"
            />
            <span className="errorMessage">This field is required</span>
        </div>
    ),
};

export const VisuallyHiddenExample: Story = {
    render: () => (
        <div className="relative p-6 bg-surface text-text-primary">
            <button>
                <span className="visually-hidden">Close modal</span>
                ✕
            </button>
        </div>
    ),
};
