import Button from 'components/Button';

export default {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered'
    },
    argTypes: {
        children: {
            control: { type: 'text' },
            description: 'Button text'
        },
        variant: {
            control: { type: 'select' },
            options: ['primary', 'secondary', 'special', 'inverted', 'white', 'link'],
            description: 'Variant style',
            table: {
                category: 'Component Props',
                defaultValue: { summary: 'primary' }
            }
        },
        size: {
            control: { type: 'select' },
            options: ['xs', 'sm', 'md'],
            description: 'Size',
            table: {
                category: 'Component Props',
                defaultValue: { summary: 'md' }
            }
        },
        block: {
            control: 'boolean',
            description: 'Full width, expands to container',
            table: {
                category: 'Component Props',
                defaultValue: { summary: 'false' }
            }
        },
        hasMinWidth: {
            control: 'boolean',
            description: 'Apply minimum width',
            table: {
                category: 'Component Props',
                defaultValue: { summary: 'false' }
            }
        },
        disabled: {
            control: 'boolean',
            description: 'Disabled',
            table: {
                category: 'Element State'
            }
        }
    },
    args: {
        variant: 'primary',
        block: false,
        size: 'md',
        hasMinWidth: true,
        disabled: false
    }
};

export const Primary = {
    args: {
        children: 'Primary Button'
    }
};

export const Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button'
    }
};

export const Special = {
    args: {
        variant: 'special',
        children: 'Special Button'
    }
};

export const Inverted = {
    args: {
        variant: 'inverted',
        children: 'Inverted Button'
    },
    parameters: {
        theme: 'dark'
    }
};

export const White = {
    args: {
        variant: 'white',
        children: 'White Button'
    },
    parameters: {
        theme: 'dark'
    }
};

export const Link = {
    args: {
        variant: 'link',
        children: 'Link Button'
    }
};
