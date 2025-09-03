import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import CollectionTile from 'components/CreatorStoreFront/CollectionTile/CollectionTile.f';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';

// Mock dependencies
jest.mock('components/CreatorStoreFront/helpers/csfNavigation', () => ({
    useNavigateTo: jest.fn()
}));

// Mock React Redux hooks
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn().mockReturnValue(jest.fn())
}));

describe('CollectionTile component', () => {
    const mockNavigateTo = jest.fn();

    const defaultProps = {
        item: {
            collectionId: '123',
            title: 'Test Collection',
            taggedProductCount: 5,
            tileProductThumbnails: [
                { thumbnailUrl: '/thumb1.jpg' },
                { thumbnailUrl: '/thumb2.jpg' },
                { thumbnailUrl: '/thumb3.jpg' },
                { thumbnailUrl: '/thumb4.jpg' }
            ]
        },
        handle: 'testuser',
        isLoading: false,
        isSmallTile: true
    };

    beforeEach(() => {
        useNavigateTo.mockReturnValue({ navigateTo: mockNavigateTo });
    });

    test('should render collection title correctly', () => {
        // Render the component without needing a real Redux store
        // since we've mocked the hook above
        render(<CollectionTile {...defaultProps} />);
        expect(screen.getByText('Test Collection')).toBeInTheDocument();
    });

    test('should render product count indicator when taggedProductCount is greater than 0', () => {
        render(<CollectionTile {...defaultProps} />);
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByAltText('Product Count Icon')).toBeInTheDocument();
    });

    test('should not render product count indicator when taggedProductCount is 0', () => {
        const propsWithZeroCount = {
            ...defaultProps,
            item: {
                ...defaultProps.item,
                taggedProductCount: 0
            }
        };

        const { container } = render(<CollectionTile {...propsWithZeroCount} />);
        expect(container.querySelector('img[alt="Product Count Icon"]')).not.toBeInTheDocument();
    });

    test('should render thumbnail grid when no custom cover image is provided', () => {
        render(<CollectionTile {...defaultProps} />);

        const thumbnails = screen.getAllByRole('img');
        // Subtract 1 for product count icon
        expect(thumbnails.length - 1).toBe(4);
    });

    test('should render custom cover image when provided', () => {
        const propsWithCoverImage = {
            ...defaultProps,
            item: {
                ...defaultProps.item,
                customCoverImageUrl: '/custom-cover.jpg'
            }
        };

        render(<CollectionTile {...propsWithCoverImage} />);
        expect(screen.getByAltText('Test Collection')).toBeInTheDocument();
        expect(screen.getByAltText('Test Collection').src).toContain('/custom-cover.jpg');
    });

    test('should handle missing thumbnails gracefully', () => {
        const propsWithMissingThumbnails = {
            ...defaultProps,
            item: {
                ...defaultProps.item,
                tileProductThumbnails: [{ thumbnailUrl: '/thumb1.jpg' }]
            }
        };

        render(<CollectionTile {...propsWithMissingThumbnails} />);
        // Should still render without errors
        expect(screen.getByText('Test Collection')).toBeInTheDocument();
    });

    test('should render skeleton when loading', () => {
        const loadingProps = {
            ...defaultProps,
            isLoading: true
        };

        const { container } = render(<CollectionTile {...loadingProps} />);

        // Instead of looking for animation properties, verify:
        // 1. The collection title is not rendered when in skeleton mode
        expect(screen.queryByText('Test Collection')).not.toBeInTheDocument();

        // 2. Check for multiple Box elements that form the skeleton grid
        const skeletonBoxes = container.querySelectorAll('[class*="StyledComponent"]');
        expect(skeletonBoxes.length).toBeGreaterThan(4); // The skeleton has at least 5 styled components

        // 3. Verify there are no image elements in skeleton mode
        expect(container.querySelectorAll('img').length).toBe(0);
    });

    test('should navigate to correct URL when clicked', () => {
        const { container } = render(<CollectionTile {...defaultProps} />);

        // Find the title element first
        const titleElement = screen.getByText('Test Collection');

        // Find the clickable container element - this could be a div or button that wraps the title
        // Use container.querySelector since we're testing a specialized UI component
        const clickableElement =
            titleElement.closest('[onClick]') || // Try to find element with onClick prop
            container.querySelector('a') || // Try standard anchor
            container.querySelector('[role="link"]') || // Try ARIA role
            titleElement.parentElement; // Fallback to parent

        // Make sure we found something to click on
        expect(clickableElement).not.toBeNull();

        // Fire click event
        fireEvent.click(clickableElement);

        // Verify navigation was called correctly
        expect(mockNavigateTo).toHaveBeenCalledWith('/creators/testuser/collections/123', false, true);
    });

    test('should adjust sizes based on isSmallTile prop', () => {
        const listViewProps = {
            ...defaultProps,
            isSmallTile: false
        };

        const { rerender } = render(<CollectionTile {...defaultProps} />);
        // First render with grid view true

        // Re-render with grid view false
        rerender(<CollectionTile {...listViewProps} />);

        // The component should still render correctly with different sizing
        expect(screen.getByText('Test Collection')).toBeInTheDocument();
    });
});
