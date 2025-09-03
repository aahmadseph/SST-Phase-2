import { compose } from 'redux';
import PromotionList from 'components/Content/PromotionList/PromotionList';
import { withPromotionListProps } from 'viewModel/content/promotionList/withPromotionListProps';
import { withPromotionListFeaturedOffersHandlerProps } from 'viewModel/content/promotionList/promotionListFeaturedOffersHandler/withPromotionListFeaturedOffersHandlerProps';

const hoc = compose(withPromotionListProps, withPromotionListFeaturedOffersHandlerProps);

export default hoc(PromotionList);
