import { withPromotionItemProps } from 'viewModel/content/promotionList/promotionItem/withPromotionItemProps';
import PromotionItem from 'components/Content/PromotionList/PromotionItem/PromotionItem';
import withPersonalizedPlacement from 'components/PersonalizedPreviewPlacements/withPersonalizedPlacement';

const PromotionItemWithPersonalizedPlacement = withPersonalizedPlacement(PromotionItem);

export default withPromotionItemProps(PromotionItemWithPersonalizedPlacement);
