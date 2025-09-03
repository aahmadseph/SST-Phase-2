import ProductCard from 'components/Product/ProductCard/ProductCard';
import { withProductCardProps } from 'viewModel/product/productCard/withProductCardProps';

const ConnectedProductCard = withProductCardProps(ProductCard);

export default ConnectedProductCard;
