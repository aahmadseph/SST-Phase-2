import { withProductGridProps } from 'viewModel/catalog/productGrid/withProductGridProps';

import ProductGrid from 'components/Catalog/ProductGrid/ProductGrid';
const ConnectedProductGrid = withProductGridProps(ProductGrid);

export default ConnectedProductGrid;
