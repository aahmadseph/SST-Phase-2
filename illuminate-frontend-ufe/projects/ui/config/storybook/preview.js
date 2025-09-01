import '@emotion/react';

/** @type { import('@storybook/react').Preview } */
const preview = {
    parameters: {
        actions: { argTypesRegex: '^on[A-Z].*' },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/
            }
        },
        docs: {
            source: {
                type: 'code'
            }
        }
    },
    decorators: [
        (Story, { parameters }) => {
            const { theme = 'light' } = parameters;

            return (
                <div style={theme === 'light' ? { backgroundColor: 'none', padding: '3rem' } : { backgroundColor: 'black', padding: '3rem' }}>
                    <Story />
                </div>
            );
        }
    ]
};

export default preview;
