import React from 'react';
import { render, screen, act } from '../../../test-utils';
import Collections from 'components/CreatorStoreFront/views/Collections';
import { useSkeletonLoading } from 'components/CreatorStoreFront/helpers/csfSkeleton';

// Mock the skeleton loading hook
jest.mock('components/CreatorStoreFront/helpers/csfSkeleton', () => ({
    useSkeletonLoading: jest.fn(),
    SKELETON_CONFIG: {
        GRID_DURATION: 500
    }
}));

// Mock CSFCommonGrid component
jest.mock('components/CreatorStoreFront/CSFCommonGrid/CSFCommonGrid', () => {
    return function MockCSFCommonGrid(props) {
        return (
            <div data-testid='csf-common-grid'>
                <div data-testid='grid-items'>{props.items?.length || 0} collections</div>
                <div data-testid='grid-total'>{props.totalItems} total</div>
                <div data-testid='grid-loading'>{props.isLoading ? 'Loading' : 'Loaded'}</div>
                <div data-testid='grid-skeleton-count'>{props.skeletonCount || 0} skeletons</div>
            </div>
        );
    };
});

describe('Collections component', () => {
    const mockCollections = [
        { collectionId: 'coll1', title: 'Collection 1' },
        { collectionId: 'coll2', title: 'Collection 2' }
    ];

    const defaultProps = {
        handle: 'testhandle',
        pageType: 'collections',
        collections: mockCollections,
        totalCollections: 5
    };

    test('should render collections grid with correct props', () => {
        // Mock the hook to return loaded state
        useSkeletonLoading.mockReturnValue({
            shouldShowLoading: false,
            skeletonCount: 5
        });

        render(<Collections {...defaultProps} />);

        expect(screen.getByTestId('csf-common-grid')).toBeInTheDocument();
        expect(screen.getByText('2 collections')).toBeInTheDocument();
        expect(screen.getByText('5 total')).toBeInTheDocument();
        expect(screen.getByText('Loaded')).toBeInTheDocument();
    });

    test('should show loading state initially and then loaded state when collections are available', async () => {
        // Start with loading state
        useSkeletonLoading.mockReturnValue({
            shouldShowLoading: true,
            skeletonCount: 8
        });

        const { rerender } = render(
            <Collections
                {...defaultProps}
                collections={[]}
            />
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.getByText('8 skeletons')).toBeInTheDocument();

        // Mock the hook to return loaded state
        useSkeletonLoading.mockReturnValue({
            shouldShowLoading: false,
            skeletonCount: 5
        });

        // Rerender with collections to test loaded state
        await act(async () => {
            rerender(
                <Collections
                    {...defaultProps}
                    collections={mockCollections}
                />
            );
        });

        expect(screen.getByText('Loaded')).toBeInTheDocument();
        expect(screen.getByText('5 skeletons')).toBeInTheDocument();
    });

    test('should use correct skeleton count based on total collections', () => {
        // Mock the hook to return specific skeleton count
        useSkeletonLoading.mockReturnValue({
            shouldShowLoading: true,
            skeletonCount: 12 // Capped at max
        });

        render(
            <Collections
                {...defaultProps}
                totalCollections={15}
                collections={null}
            />
        );

        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(screen.getByText('12 skeletons')).toBeInTheDocument();
    });

    test('should call useSkeletonLoading with correct parameters', () => {
        useSkeletonLoading.mockReturnValue({
            shouldShowLoading: false,
            skeletonCount: 5
        });

        render(<Collections {...defaultProps} />);

        expect(useSkeletonLoading).toHaveBeenCalledWith(
            mockCollections,
            500, // SKELETON_CONFIG.GRID_DURATION
            5 // totalCollections
        );
    });
});
