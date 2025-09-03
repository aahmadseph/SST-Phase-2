import React from 'react';
import {
    render, screen, fireEvent, waitFor
} from '../../../test-utils';
import CSFProductGrid from 'components/CreatorStoreFront/CSFProductGrid/CSFProductGrid.ctrlr';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';

// Mock dependencies
jest.mock('components/Catalog/ProductGrid/ProductTile', () => {
    return function MockProductTile({ product, isSkeleton }) {
        return (
            <div data-testid={isSkeleton ? 'skeleton-tile' : 'product-tile'}>
                {product?.productId && <span>{product.productId}</span>}
                {product?.displayName && <span>{product.displayName}</span>}
            </div>
        );
    };
});

jest.mock('components/LazyLoad', () => {
    return function MockLazyLoad(props) {
        const { component: Component, ...restProps } = props;

        return <Component {...restProps} />;
    };
});

describe('CSFProductGrid component', () => {
    const mockProducts = [
        { productId: 'p1', displayName: 'Product 1', currentSku: { skuId: 's1' } },
        { productId: 'p2', displayName: 'Product 2', currentSku: { skuId: 's2' } },
        { productId: 'p3', displayName: 'Product 3', currentSku: { skuId: 's3' } }
    ];

    const defaultProps = {
        products: mockProducts,
        totalProductCount: 10,
        marketingTiles: [],
        increaseImageSizeGrid: true,
        source: 'csp',
        handle: 'testuser',
        pageType: CSF_PAGE_TYPES.PRODUCTS,
        fetchProductData: jest.fn().mockResolvedValue({}),
        textResources: {
            allProducts: 'All Products',
            addToBasket: 'Add to Basket'
        }
    };

    test('should render product tiles correctly', () => {
        render(<CSFProductGrid {...defaultProps} />);

        expect(screen.getByText('All Products')).toBeInTheDocument();
        expect(screen.getByText('3 of 10 products')).toBeInTheDocument();
        expect(screen.getAllByTestId('product-tile').length).toBe(3);
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    test('should show correct total items count', () => {
        render(<CSFProductGrid {...defaultProps} />);
        expect(screen.getByText('10 items')).toBeInTheDocument();
    });

    test('should show singular "item" text when there is only one product', () => {
        const singleProductProps = {
            ...defaultProps,
            products: [mockProducts[0]],
            totalProductCount: 1
        };

        render(<CSFProductGrid {...singleProductProps} />);
        expect(screen.getByText('1 item')).toBeInTheDocument();
    });

    test('should not show heading and total count when in collection details view', () => {
        const collectionViewProps = {
            ...defaultProps,
            pageType: CSF_PAGE_TYPES.COLLECTION
        };

        render(<CSFProductGrid {...collectionViewProps} />);

        expect(screen.queryByText('All Products')).not.toBeInTheDocument();
        expect(screen.queryByText('10 items')).not.toBeInTheDocument();
    });

    test('should handle load more button click', async () => {
        render(<CSFProductGrid {...defaultProps} />);

        // Use regex for case-insensitive matching
        const loadMoreButton = screen.getByText(/show more products/i);
        expect(loadMoreButton).toBeInTheDocument();

        fireEvent.click(loadMoreButton);

        expect(defaultProps.fetchProductData).toHaveBeenCalledWith('testuser', 2);

        await waitFor(() => {
            expect(defaultProps.fetchProductData).toHaveBeenCalledTimes(1);
        });
    });

    test('should handle load more in collection view', async () => {
        const collectionProps = {
            ...defaultProps,
            pageType: CSF_PAGE_TYPES.COLLECTION,
            collectionId: 'coll123'
        };

        render(<CSFProductGrid {...collectionProps} />);

        // Use regex for case-insensitive matching
        const loadMoreButton = screen.getByText(/show more products/i);
        expect(loadMoreButton).toBeInTheDocument();

        fireEvent.click(loadMoreButton);

        expect(collectionProps.fetchProductData).toHaveBeenCalledWith('coll123', 'testuser', 2);

        await waitFor(() => {
            expect(collectionProps.fetchProductData).toHaveBeenCalledTimes(1);
        });
    });

    test('should render empty state when no products', () => {
        const noProductsProps = {
            ...defaultProps,
            products: []
        };

        render(<CSFProductGrid {...noProductsProps} />);

        expect(screen.queryByTestId('product-tile')).not.toBeInTheDocument();
        // Update to match the actual text shown in the empty state
        expect(screen.getByText(/Sorry, there are no products that match your filter choices/i)).toBeInTheDocument();
        expect(screen.getByText(/Try changing some of your filters to see product results/i)).toBeInTheDocument();
    });
});
