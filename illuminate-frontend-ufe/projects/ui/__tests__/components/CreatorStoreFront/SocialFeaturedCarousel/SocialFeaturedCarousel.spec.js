import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import SocialFeaturedCarousel from 'components/CreatorStoreFront/SocialFeaturedCarousel';
// Note: Jest allows using variables with 'mock' prefix
import * as mockReact from 'react';

// Mock Carousel component with forwardRef to allow the ref to be passed
jest.mock('components/Carousel/Carousel', () => {
    return mockReact.forwardRef((props, ref) => {
        // Store the scrollTo function so tests can verify it's called
        mockReact.useImperativeHandle(ref, () => ({
            scrollTo: jest.fn()
        }));

        return (
            <div data-testid='carousel'>
                <div data-testid='carousel-items'>{props.items}</div>
                <button
                    data-testid='prev-button'
                    onClick={() => props.onPrevClick && props.onPrevClick()}
                >
                    Prev
                </button>
                <button
                    data-testid='next-button'
                    onClick={() => props.onNextClick && props.onNextClick()}
                >
                    Next
                </button>
            </div>
        );
    });
});

// Mock PostTile component
jest.mock('components/CreatorStoreFront/PostTile/PostTile', () => {
    return function MockPostTile(props) {
        return (
            <div
                data-testid='post-tile'
                data-item-id={props.item.id}
            >
                Post: {props.item.title || 'Untitled Post'}
            </div>
        );
    };
});

// Mock CollectionTile component
jest.mock('components/CreatorStoreFront/CollectionTile/CollectionTile', () => {
    return function MockCollectionTile(props) {
        return (
            <div
                data-testid='collection-tile'
                data-item-id={props.item.id}
            >
                Collection: {props.item.title || 'Untitled Collection'}
            </div>
        );
    };
});

// Mock Divider component so we can easily detect it in tests
jest.mock('components/ui', () => {
    const actual = jest.requireActual('components/ui');

    return {
        ...actual,
        Divider: props => (
            <div
                data-testid='divider-component'
                {...props}
            />
        )
    };
});

describe('SocialFeaturedCarousel component', () => {
    const mockHandle = 'testhandle';
    const mockHeaderText = 'Featured Content';
    const mockViewAllText = 'View All';
    const mockOnViewAll = jest.fn();

    const mockItems = [
        {
            id: 'post1',
            type: 'post',
            title: 'Test Post 1'
        },
        {
            id: 'post2',
            type: 'post',
            title: 'Test Post 2'
        },
        {
            id: 'collection1',
            type: 'collection',
            title: 'Test Collection 1'
        }
    ];

    const mockRegisterTile = jest.fn();

    const defaultProps = {
        handle: mockHandle,
        headerText: mockHeaderText,
        items: mockItems,
        onViewAll: mockOnViewAll,
        viewAllText: mockViewAllText,
        registerTile: mockRegisterTile
    };

    test('should render carousel with correct items', () => {
        render(<SocialFeaturedCarousel {...defaultProps} />, {
            redux: { creatorStoreFront: {} }
        });

        // Check header text
        expect(screen.getByText(mockHeaderText)).toBeInTheDocument();

        // Check View All link
        expect(screen.getByText(mockViewAllText)).toBeInTheDocument();

        // Check carousel items
        expect(screen.getByTestId('carousel')).toBeInTheDocument();

        // Check if posts and collections are rendered correctly
        const postTiles = screen.getAllByTestId('post-tile');
        expect(postTiles).toHaveLength(2);
        expect(postTiles[0]).toHaveTextContent('Post: Test Post 1');
        expect(postTiles[1]).toHaveTextContent('Post: Test Post 2');

        const collectionTiles = screen.getAllByTestId('collection-tile');
        expect(collectionTiles).toHaveLength(1);
        expect(collectionTiles[0]).toHaveTextContent('Collection: Test Collection 1');
    });

    test('should handle View All click', () => {
        render(<SocialFeaturedCarousel {...defaultProps} />, {
            redux: { creatorStoreFront: {} }
        });

        const viewAllLink = screen.getByText(mockViewAllText);
        fireEvent.click(viewAllLink);

        expect(mockOnViewAll).toHaveBeenCalled();
    });

    // test('should not show View All link when isFeaturedPage is true', () => {
    //     render(
    //         <SocialFeaturedCarousel
    //             {...defaultProps}
    //             isFeaturedPage={true}
    //         />,
    //         {
    //             redux: { creatorStoreFront: {} }
    //         }
    //     );

    //     expect(screen.queryByText(mockViewAllText)).not.toBeInTheDocument();
    // });

    test('should handle empty items array gracefully', () => {
        render(
            <SocialFeaturedCarousel
                {...defaultProps}
                items={[]}
            />,
            { redux: { creatorStoreFront: {} } }
        );

        // Header should still be shown
        expect(screen.getByText(mockHeaderText)).toBeInTheDocument();

        // The carousel should be empty but still rendered
        expect(screen.getByTestId('carousel')).toBeInTheDocument();
        expect(screen.queryByTestId('post-tile')).not.toBeInTheDocument();
        expect(screen.queryByTestId('collection-tile')).not.toBeInTheDocument();
    });

    // test('should render divider only when on featured page', () => {
    //     const { queryByTestId, rerender } = render(
    //         <SocialFeaturedCarousel
    //             {...defaultProps}
    //             isFeaturedPage={false}
    //         />,
    //         { redux: { creatorStoreFront: {} } }
    //     );

    //     // Divider should not be present
    //     expect(queryByTestId('divider-component')).not.toBeInTheDocument();

    //     // Re-render with isFeaturedPage true
    //     rerender(
    //         <SocialFeaturedCarousel
    //             {...defaultProps}
    //             isFeaturedPage={true}
    //         />,
    //         { redux: { creatorStoreFront: {} } }
    //     );

    //     // Divider should now be present
    //     expect(queryByTestId('divider-component')).toBeInTheDocument();
    // });
});
