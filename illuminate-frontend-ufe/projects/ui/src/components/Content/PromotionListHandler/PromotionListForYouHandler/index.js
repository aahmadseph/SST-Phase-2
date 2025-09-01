import { compose } from 'redux';
import PromotionListForYouHandler from 'components/Content/PromotionListHandler/PromotionListForYouHandler/PromotionListForYouHandler';
import { withPromotionListProps } from 'viewModel/content/promotionList/withPromotionListProps';
import { withPromotionListForYouHandlerProps } from 'viewModel/content/promotionList/promotionListForYouHandler/withPromotionListForYouHandlerProps';

const hoc = compose(withPromotionListProps, withPromotionListForYouHandlerProps);

export default hoc(PromotionListForYouHandler);
