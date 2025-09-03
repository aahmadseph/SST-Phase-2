import FavouriteProductCard from 'components/RichProfile/MyLists/FavouriteProductCard/FavouriteProductCard';
import { withFavouriteProductCardProps } from 'viewModel/richProfile/myLists/favouriteProductCard/withFavouriteProductCardProps';

const ConnectedFavouriteProductCard = withFavouriteProductCardProps(FavouriteProductCard);

export default ConnectedFavouriteProductCard;
