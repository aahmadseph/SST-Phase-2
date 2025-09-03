import ProductTile from 'components/Catalog/ProductGrid/ProductTile/ProductTile';
import { withProductTileProps } from 'viewModel/catalog/productGrid/productTile/withProductTileProps';

const ConnectedProductTile = withProductTileProps(ProductTile);

export default ConnectedProductTile;
