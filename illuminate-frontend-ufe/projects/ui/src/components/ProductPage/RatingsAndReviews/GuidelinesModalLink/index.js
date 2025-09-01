import GuidelinesModalLink from 'components/ProductPage/RatingsAndReviews/GuidelinesModalLink/GuidelinesModalLink';
import { withGuidelinesModalLinkProps } from 'viewModel/productPage/ratingsAndReviews/guidelinesModalLink/withGuidelinesModalLinkProps';
import withGlobalModals from 'hocs/withGlobalModals';

const ConnectedGuidelinesModalLink = withGlobalModals(withGuidelinesModalLinkProps(GuidelinesModalLink));

export default ConnectedGuidelinesModalLink;
