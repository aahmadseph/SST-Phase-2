import React from 'react';
import { render, screen } from '../../../test-utils';
import Featured from 'components/CreatorStoreFront/views/Featured';

// Mock dependencies
jest.mock('components/CreatorStoreFront/SocialFeaturedCarousel', () => {
    return function MockSocialFeaturedCarousel(props) {
        return (
            <div data-testid='social-carousel'>
                <h2>{props.headerText}</h2>
                <div>{props.items?.length || 0} featured items</div>
            </div>
        );
    };
});

jest.mock('components/CreatorStoreFront/CSFProductGrid/CSFProductGrid', () => {
    const MockCSFProductGrid = props => (
        <div data-testid='product-grid'>
            <div>{props.products?.length || 0} products</div>
            <div>Total: {props.totalProductCount}</div>
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

describe('Featured component', () => {
    const mockFeaturedItems = [
        { id: 'f1', title: 'Featured 1' },
        { id: 'f2', title: 'Featured 2' }
    ];

    const mockProducts = [
        { productId: 'p1', title: 'Product 1' },
        { productId: 'p2', title: 'Product 2' }
    ];

    const defaultProps = {
        contextId: 'ctx123',
        featuredSection: {
            featuredItems: mockFeaturedItems
        },
        productSection: {
            products: mockProducts,
            totalProductCount: 10
        },
        textResources: {
            featuredHeader: 'Featured Posts'
        },
        handle: 'testhandle',
        fetchProductData: jest.fn()
    };

    test('should render social carousel and product grid', () => {
        render(<Featured {...defaultProps} />);

        // Check social carousel
        expect(screen.getByTestId('social-carousel')).toBeInTheDocument();
        expect(screen.getByText('Featured Posts')).toBeInTheDocument();
        expect(screen.getByText('2 featured items')).toBeInTheDocument();

        // Check product grid
        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
        expect(screen.getByText('2 products')).toBeInTheDocument();
        expect(screen.getByText('Total: 10')).toBeInTheDocument();
    });

    test('should handle empty data gracefully', () => {
        const emptyProps = {
            ...defaultProps,
            featuredSection: { featuredItems: [] },
            productSection: { products: [], totalProductCount: 0 }
        };

        render(<Featured {...emptyProps} />);

        // Should still render the product grid
        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
        expect(screen.getByText('0 products')).toBeInTheDocument();
    });
});
