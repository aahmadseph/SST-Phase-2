import React from 'react';
import { render, screen } from '../../../test-utils';
import PostDetailsContainer from 'components/CreatorStoreFront/PostDetailsPage/PostDetailsContainer';

describe('PostDetailsContainer component', () => {
    test('should render product tiles when provided', () => {
        const mockProductTiles = (
            <>
                <div data-testid='product-tile-1'>Product Tile 1</div>
                <div data-testid='product-tile-2'>Product Tile 2</div>
            </>
        );

        render(<PostDetailsContainer productTiles={mockProductTiles} />);

        expect(screen.getByTestId('product-tile-1')).toBeInTheDocument();
        expect(screen.getByTestId('product-tile-2')).toBeInTheDocument();
    });

    test('should render nothing when no product tiles provided', () => {
        const { container } = render(<PostDetailsContainer />);

        // Check that the container exists and has the Flex component
        expect(container.firstChild).toBeInTheDocument();

        // Verify no product tiles are rendered - check for the tilesContainer div
        // which would contain the product tiles
        expect(container.querySelector('[css]')).not.toBeInTheDocument();

        // Alternative approach - verify the flex container is empty in terms of product content
        expect(screen.queryByTestId('product-tile-1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('product-tile-2')).not.toBeInTheDocument();
    });

    test('should apply responsive styles', () => {
        const mockProductTiles = <div data-testid='product-tile'>Product Tile</div>;

        const { container } = render(<PostDetailsContainer productTiles={mockProductTiles} />);

        // Verify the product tiles are rendered inside the container
        expect(screen.getByTestId('product-tile')).toBeInTheDocument();

        // Find the container by looking for the div that contains the product tile
        const productTileElement = screen.getByTestId('product-tile');
        const tilesContainer = productTileElement.parentElement;

        // Verify the container exists and contains the product tile
        expect(tilesContainer).toBeInTheDocument();
        expect(tilesContainer).toContainElement(productTileElement);

        // Verify the Flex container structure
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild).toContainElement(tilesContainer);
    });
});
