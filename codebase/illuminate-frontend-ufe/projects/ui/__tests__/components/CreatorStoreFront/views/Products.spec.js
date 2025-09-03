import React from 'react';
import { render, screen } from '../../../test-utils';
import Products from 'components/CreatorStoreFront/views/Products';
import { useSelector } from 'react-redux';

// Mock dependencies
jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

jest.mock('selectors/creatorStoreFront/productPageDataSelector', () => ({
    getProductPageViewModelSelector: jest.fn()
}));

jest.mock('components/CreatorStoreFront/CSFProductGrid/CSFProductGrid', () => {
    const MockCSFProductGrid = props => (
        <div data-testid='product-grid'>
            <div>{props.products?.length || 0} products</div>
            <div>Total: {props.totalProductCount}</div>
            <div>Handle: {props.handle}</div>
            <div>PageType: {props.pageType}</div>
        </div>
    );

    return {
        __esModule: true,
        default: MockCSFProductGrid
    };
});

// Mock HOC
jest.mock('viewModel/catalog/upperFunnel/withUpperFunnelProps', () => ({
    withUpperFunnelProps: Component => Component
}));

describe('Products component', () => {
    const mockProducts = [
        { productId: 'p1', title: 'Product 1' },
        { productId: 'p2', title: 'Product 2' }
    ];

    const mockState = {
        products: mockProducts,
        contextId: 'ctx123',
        textResources: {
            allProducts: 'All Products',
            addToBasket: 'Add to Basket'
        },
        pageType: 'products',
        totalProductCount: 10
    };
    const handle = 'testhandle';

    beforeEach(() => {
        useSelector.mockImplementation(_selector => mockState);
    });

    test('should render product grid with correct props from state', () => {
        const mockFetchProductData = jest.fn();
        render(
            <Products
                fetchProductData={mockFetchProductData}
                handle={handle}
            />
        );

        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
        expect(screen.getByText('2 products')).toBeInTheDocument();
        expect(screen.getByText('Total: 10')).toBeInTheDocument();
        expect(screen.getByText('Handle: testhandle')).toBeInTheDocument();
        expect(screen.getByText('PageType: products')).toBeInTheDocument();
    });

    test('should handle empty products data', () => {
        useSelector.mockImplementation(_selector => ({
            ...mockState,
            products: [],
            totalProductCount: 0
        }));

        const mockFetchProductData = jest.fn();
        render(
            <Products
                fetchProductData={mockFetchProductData}
                handle={handle}
            />
        );

        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
        expect(screen.getByText('0 products')).toBeInTheDocument();
        expect(screen.getByText('Total: 0')).toBeInTheDocument();
    });
});
