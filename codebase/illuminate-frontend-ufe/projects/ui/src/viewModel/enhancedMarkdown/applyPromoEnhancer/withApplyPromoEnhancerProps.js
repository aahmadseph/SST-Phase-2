import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import appliedPromotionsSelector from 'selectors/basket/appliedPromotions/appliedPromotionsSelector';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const fields = createStructuredSelector({
    appliedPromotions: appliedPromotionsSelector
});

const withApplyPromoEnhancerProps = wrapHOC(connect(fields));

export {
    fields, withApplyPromoEnhancerProps
};
