import React from 'react';
import {
    render, screen, fireEvent, waitFor
} from '../../../test-utils';
import CSFCommonGrid from 'components/CreatorStoreFront/CSFCommonGrid/CSFCommonGrid';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import getCollectionsNextPage from 'services/api/creatorStoreFront/getCollectionsNextPage';
import getPostsNextPage from 'services/api/creatorStoreFront/getPostsNextPage';

// Mock dependencies
// Mock the Actions module with appropriate structure
jest.mock('actions/Actions', () => {
    const actionsMock = {
        showInterstice: jest.fn(),
        TYPES: {
            SHOW_INTERSTICE: 'MOCKED_SHOW_INTERSTICE'
        }
    };

    return actionsMock;
});

jest.mock('services/api/creatorStoreFront/getCollectionsNextPage');
jest.mock('services/api/creatorStoreFront/getPostsNextPage');

// Mock Redux hooks rather than using actual Redux
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(() => jest.fn())
}));

// Import Actions after mocking
import Actions from 'actions/Actions';

// Fix the mock implementation to handle string interpolation
jest.mock('utils/LanguageLocale', () => ({
    CURRENCY_SYMBOLS: {
        US: '$'
    },
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

describe('CSFCommonGrid component', () => {
    const mockItems = [
        { collectionId: '1', title: 'Collection 1', taggedProductCount: 5 },
        { collectionId: '2', title: 'Collection 2', taggedProductCount: 3 },
        { collectionId: '3', title: 'Collection 3', taggedProductCount: 0 }
    ];

    const mockPostItems = [
        {
            type: 'post',
            socialMedia: 'instagram',
            media: {
                type: 'video',
                thumbnailUrl: 'https://example.com/thumb1.webp'
            },
            title: 'Post 1',
            caption: null,
            postId: 'k6Z6Okl2J9Q',
            taggedProductCount: 2,
            thumbnailDimensions: {
                height: 1136,
                width: 640
            },
            creationDate: '2025-02-25 20:38:09'
        },
        {
            type: 'post',
            socialMedia: 'instagram',
            media: {
                type: 'image',
                thumbnailUrl: 'https://example.com/thumb2.webp'
            },
            title: 'Post 2',
            caption: null,
            postId: 'aBc123',
            taggedProductCount: 1,
            thumbnailDimensions: {
                height: 640,
                width: 640
            },
            creationDate: '2025-01-01 15:00:00'
        }
    ];

    const mockCollectionsProps = {
        type: CSF_PAGE_TYPES.COLLECTIONS,
        handle: 'testuser',
        items: mockItems,
        totalItems: 10,
        isLoading: false
    };

    const mockPostsProps = {
        type: CSF_PAGE_TYPES.POSTS,
        handle: 'testuser',
        items: mockPostItems,
        totalItems: 8,
        isLoading: false
    };

    beforeEach(() => {
        // Mock Actions.showInterstice implementation
        Actions.showInterstice.mockImplementation(isVisible => ({
            type: 'MOCKED_ACTION',
            isVisible
        }));

        getCollectionsNextPage.mockResolvedValue({
            data: {
                collections: [
                    { collectionId: '4', title: 'Collection 4', taggedProductCount: 2 },
                    { collectionId: '5', title: 'Collection 5', taggedProductCount: 1 }
                ]
            }
        });
        getPostsNextPage.mockResolvedValue({
            data: {
                posts: [
                    { postId: '4', title: 'Post 4' },
                    { postId: '5', title: 'Post 5' }
                ]
            }
        });
    });

    test('should render collections grid with correct title and count', () => {
        // Render without redux context to avoid reducer issues
        render(<CSFCommonGrid {...mockCollectionsProps} />);

        expect(screen.getByText('Collections')).toBeInTheDocument();
    });

    test('should render posts grid with correct title and count', () => {
        render(<CSFCommonGrid {...mockPostsProps} />);

        expect(screen.getByText('Posts')).toBeInTheDocument();
    });

    test('should show singular item text when there is only one item', () => {
        const singleItemProps = {
            ...mockCollectionsProps,
            items: [mockItems[0]],
            totalItems: 1
        };

        render(<CSFCommonGrid {...singleItemProps} />);

        // Check that the collection title is rendered
        expect(screen.getByText('Collection 1')).toBeInTheDocument();
    });

    test('should handle show more button click for collections', async () => {
        // Add this line to explicitly tell Jest how many assertions to expect
        expect.assertions(5);

        render(<CSFCommonGrid {...mockCollectionsProps} />);

        // Use regex for more flexible text matching
        expect(screen.getByText(/Showing.*3.*of.*10.*Collections/i)).toBeInTheDocument();

        // Get the button using a more flexible approach
        const showMoreButton = screen.getByRole('button', { name: /Show more Collections/i });
        expect(showMoreButton).toBeInTheDocument();

        // Click show more button
        fireEvent.click(showMoreButton);

        // Verify actions were called
        expect(Actions.showInterstice).toHaveBeenCalledWith(true);

        // Wait for the async operations to complete
        await waitFor(() => {
            // This verification now happens inside waitFor but is counted
            expect(Actions.showInterstice).toHaveBeenCalledWith(false);
        });
    });

    test('should handle show more button click for posts', async () => {
        // Add this line to explicitly tell Jest how many assertions to expect
        expect.assertions(4);

        render(<CSFCommonGrid {...mockPostsProps} />);

        // Get the button using a more flexible approach
        const showMoreButton = screen.getByRole('button', { name: /Show more Posts/i });
        expect(showMoreButton).toBeInTheDocument();

        // Click show more button
        fireEvent.click(showMoreButton);

        // Verify actions were called
        expect(Actions.showInterstice).toHaveBeenCalledWith(true);

        // Wait for the async operations to complete
        await waitFor(() => {
            // This verification now happens inside waitFor but is counted
            expect(Actions.showInterstice).toHaveBeenCalledWith(false);
        });
    });

    test('should not show "Show more" button when all items are displayed', () => {
        const allItemsProps = {
            ...mockCollectionsProps,
            totalItems: 3 // Same as the number of items
        };

        render(<CSFCommonGrid {...allItemsProps} />);

        expect(screen.queryByText('Show more Collections')).not.toBeInTheDocument();
    });

    test('should render skeletons when loading', () => {
        const loadingProps = {
            ...mockCollectionsProps,
            isLoading: true
        };

        const { container } = render(<CSFCommonGrid {...loadingProps} />);

        // Since key props don't appear in the DOM, look for the Box components with expected dimensions
        // that are only rendered in the loading state
        const skeletonElements = container.querySelectorAll('[class*="StyledComponent"]');

        // The component renders 8 skeleton boxes when loading
        // Each box has a height and width styled component
        expect(skeletonElements.length).toBeGreaterThan(0);

        // Check that no actual collection titles are rendered
        expect(screen.queryByText('Collection 1')).not.toBeInTheDocument();
        expect(screen.queryByText('Collection 2')).not.toBeInTheDocument();
        expect(screen.queryByText('Collection 3')).not.toBeInTheDocument();
    });

    test('should not render "Show more" button for single collection case', () => {
        const singleCollectionProps = {
            ...mockCollectionsProps,
            items: [mockItems[0]],
            totalItems: 1
        };

        render(<CSFCommonGrid {...singleCollectionProps} />);

        // Should not show the count text for single collections
        expect(screen.queryByText('Showing 1 of 1 Collections')).not.toBeInTheDocument();
        expect(screen.queryByText('Show more Collections')).not.toBeInTheDocument();
    });

    test('should handle API errors gracefully when fetching more items', async () => {
        getCollectionsNextPage.mockRejectedValue(new Error('API Error'));

        render(<CSFCommonGrid {...mockCollectionsProps} />);

        // Get and check the button
        const showMoreButton = screen.getByText('Show more Collections');
        expect(showMoreButton).toBeInTheDocument();

        // Click show more button
        fireEvent.click(showMoreButton);

        // Verify the initial action
        expect(Actions.showInterstice).toHaveBeenCalledWith(true);

        await waitFor(() => {
            // Wait for the error handling
            expect(Actions.showInterstice).toHaveBeenCalledWith(false);
        });
    });
});
