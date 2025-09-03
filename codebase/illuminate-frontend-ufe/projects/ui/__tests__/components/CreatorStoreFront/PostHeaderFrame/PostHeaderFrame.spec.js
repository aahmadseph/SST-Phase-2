import React from 'react';
import { render, screen } from '../../../test-utils';
import PostHeaderFrame from 'components/CreatorStoreFront/PostHeaderFrame/PostHeaderFrame';

// Mock dependencies with complete LanguageLocale mock including CURRENCY_SYMBOLS
jest.mock('utils/LanguageLocale', () => ({
    CURRENCY_SYMBOLS: {
        US: '$'
    },
    getCurrentLanguageLocale: jest.fn().mockReturnValue('en-US'),
    getLocaleResourceFile: jest.fn().mockImplementation(() => {
        return (key, replacements) => {
            const texts = {
                collections: 'Collections',
                posts: 'Posts',
                item: '{0} item',
                items: '{0} items',
                numberOfItems: 'Showing {0} of {1} {2}',
                showMoreItems: 'Show more {0}'
            };

            let text = texts[key] || key;

            // Handle replacements if provided
            if (replacements && Array.isArray(replacements)) {
                replacements.forEach((value, index) => {
                    text = text.replace(`{${index}}`, value);
                });
            }

            return text;
        };
    }),
    isUS: jest.fn().mockReturnValue(true)
}));

jest.mock('components/CreatorStoreFront/ShareButton/ShareButton', () => ({ display, iconSize }) => (
    <div
        data-testid='mock-share-button'
        data-display={JSON.stringify(display)}
        data-icon-size={iconSize}
    >
        Share Button
    </div>
));

describe('PostHeaderFrame component', () => {
    const mockPostContent = {
        title: 'Test Post Title',
        caption: 'TestUser: This is a test caption for the post',
        creationDate: '2023-05-15T12:30:00Z'
    };

    const mockTextResources = {
        share: 'Share'
    };

    test('should render post title and formatted date', () => {
        render(
            <PostHeaderFrame
                postContent={mockPostContent}
                textResources={mockTextResources}
            />
        );

        expect(screen.getByText('Test Post Title')).toBeInTheDocument();

        // Check for formatted date (May 15, 2023)
        const dateElement = screen.getByText(/May 15, 2023/i);
        expect(dateElement).toBeInTheDocument();
    });

    test('should parse and display caption correctly', () => {
        render(
            <PostHeaderFrame
                postContent={mockPostContent}
                textResources={mockTextResources}
            />
        );

        // Should extract username from caption
        expect(screen.getByText('TestUser:')).toBeInTheDocument();

        // Should display the rest of the caption
        expect(screen.getByText('This is a test caption for the post')).toBeInTheDocument();
    });

    test('should handle caption without username prefix', () => {
        const noUsernameCaption = {
            ...mockPostContent,
            caption: 'This is just a regular caption without username'
        };

        render(
            <PostHeaderFrame
                postContent={noUsernameCaption}
                textResources={mockTextResources}
            />
        );

        // Should display the entire caption as is
        expect(screen.getByText('This is just a regular caption without username')).toBeInTheDocument();
    });

    test('should handle empty post content gracefully', () => {
        render(<PostHeaderFrame textResources={mockTextResources} />);

        // Should render basic structure without errors
        const shareButtons = screen.getAllByTestId('mock-share-button');
        expect(shareButtons.length).toBe(1);

        // Should not display any content that depends on postContent
        expect(screen.queryByText(/May 15/)).not.toBeInTheDocument();
    });
});
