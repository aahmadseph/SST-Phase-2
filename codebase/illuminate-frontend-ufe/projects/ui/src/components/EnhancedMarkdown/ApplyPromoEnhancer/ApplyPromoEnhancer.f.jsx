import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';
import promoUtils from 'utils/Promos';

const ApplyPromoEnhancer = ({ appliedPromotions, children, args }) => {
    if (!args || args.length === 0) {
        return null;
    }

    const couponCode = args[0];
    const isApplied = appliedPromotions?.some(x => x.couponCode?.toLowerCase() === couponCode?.toLowerCase());

    return isApplied ? null : (
        <Link
            children={children}
            onClick={() => promoUtils.applyPromo(couponCode.toLowerCase(), null, null)}
        />
    );
};

ApplyPromoEnhancer.defaultProps = { children: null };

ApplyPromoEnhancer.propTypes = {
    appliedPromotions: PropTypes.array.isRequired,
    children: PropTypes.element,
    args: PropTypes.array.isRequired
};

export default wrapFunctionalComponent(ApplyPromoEnhancer, 'ApplyPromoEnhancer');
