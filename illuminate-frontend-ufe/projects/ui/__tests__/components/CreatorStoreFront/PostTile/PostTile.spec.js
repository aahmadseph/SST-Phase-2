import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import PostTile from 'components/CreatorStoreFront/PostTile/PostTile';
import * as csfNavigation from 'components/CreatorStoreFront/helpers/csfNavigation';

// Mock the navigation helper
jest.mock('components/CreatorStoreFront/helpers/csfNavigation', () => ({
    useNavigateTo: jest.fn()
}));

describe('PostTile component', () => {
    const mockNavigateTo = jest.fn();

    const mockItem = {
        postId: 'post123',
        title: 'Test Post Title',
        media: {
            thumbnailUrl: '/test-thumbnail.jpg',
            type: 'image'
        },
        socialMedia: 'instagram',
        taggedProductCount: 3
    };

    const mockVideoItem = {
        ...mockItem,
        media: {
            ...mockItem.media,
            type: 'video'
        }
    };

    beforeEach(() => {
        csfNavigation.useNavigateTo.mockReturnValue({
            navigateTo: mockNavigateTo
        });
    });

    test('should render post tile with correct information', () => {
        render(
            <PostTile
                handle='testhandle'
                item={mockItem}
                isSmallTile={true}
            />,
            {
                redux: { creatorStoreFront: {} } // Provide Redux store context
            }
        );

        // Check if image is rendered with correct src and alt
        const image = screen.getByAltText('Test Post Title');
        expect(image).toBeInTheDocument();
        expect(image.getAttribute('src')).toContain('/test-thumbnail.jpg');

        // Check if social media icon is present
        const socialIcon = screen.getByAltText('instagram icon');
        expect(socialIcon).toBeInTheDocument();

        // Check if product count is displayed
        expect(screen.getByText('3')).toBeInTheDocument();

        // Check if title is displayed
        expect(screen.getByText('Test Post Title')).toBeInTheDocument();
    });

    test('should render play icon for video posts', () => {
        render(
            <PostTile
                handle='testhandle'
                item={mockVideoItem}
                isSmallTile={true}
            />,
            {
                redux: { creatorStoreFront: {} } // Provide Redux store context
            }
        );

        const playIcon = screen.getByAltText('play icon');
        expect(playIcon).toBeInTheDocument();
    });

    test('should navigate to post details page when clicked', () => {
        render(
            <PostTile
                handle='testhandle'
                item={mockItem}
                isSmallTile={true}
            />,
            {
                redux: { creatorStoreFront: {} } // Provide Redux store context
            }
        );

        // The component renders as a button, so query for the button role
        const postTileElement = screen.getByRole('button');
        fireEvent.click(postTileElement);

        expect(mockNavigateTo).toHaveBeenCalledWith('/creators/testhandle/posts/post123', false, true);
    });

    test('should handle image loading error', () => {
        const { getByAltText } = render(
            <PostTile
                handle='testhandle'
                item={mockItem}
                isSmallTile={true}
            />,
            { redux: { creatorStoreFront: {} } } // Provide Redux store context
        );

        const image = getByAltText('Test Post Title');
        const originalSrc = image.src;

        // Simulate image error
        fireEvent.error(image);

        // Verify the default image is used after error
        expect(image.src).not.toBe(originalSrc);
        expect(image.src).toContain('/img/ufe/image-error.svg');
    });
});
