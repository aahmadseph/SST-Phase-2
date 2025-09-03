import Card from 'components/Card';

export default {
    title: 'Components/Card',
    component: Card,
    parameters: {
        layout: 'centered'
    },
    tags: ['autodocs'],
    argTypes: {
        title: {
            control: 'text',
            description: 'Card title'
        },
        titleIsHighlighted: {
            control: 'boolean',
            description: 'Highlight the title with bold text'
        },
        isMixed: {
            control: 'boolean',
            description: 'Mixed content layout'
        }
    }
};

export const Default = {
    args: {
        title: 'Card Title',
        children: 'This is the card content area where you can place any content.'
    }
};

export const Highlighted = {
    args: {
        title: 'Highlighted Card Title',
        titleIsHighlighted: true,
        children: 'This card has a highlighted title with bold text.'
    }
};

export const Mixed = {
    args: {
        title: 'Mixed Content Card',
        isMixed: true,
        children: 'This card uses mixed content layout with different spacing.'
    }
};

export const WithoutTitle = {
    args: {
        children: 'This card has no title, just content.'
    }
};
