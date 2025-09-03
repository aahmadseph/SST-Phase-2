import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import basketSelector from 'selectors/basket/basketSelector';
import promoSelector from 'selectors/promo/promoSelector';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;

const fields = createStructuredSelector({
    basket: basketSelector,
    promo: promoSelector
});

const withLoyaltyPromoProps = wrapHOC(connect(fields));

export {
    fields, withLoyaltyPromoProps
};
