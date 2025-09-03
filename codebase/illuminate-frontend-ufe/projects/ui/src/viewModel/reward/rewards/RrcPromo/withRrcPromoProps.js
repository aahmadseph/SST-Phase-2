import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import promoSelector from 'selectors/promo/promoSelector';
import availableRrcCouponsSelector from 'selectors/availableRrcCoupons/availableRrcCouponsSelector';

const withRrcPromoProps = compose(
    connect(
        createStructuredSelector({
            basket: basketSelector,
            promo: promoSelector,
            availableRrcCoupons: availableRrcCouponsSelector
        })
    ),
    WrappedComponent => {
        const RrcPromoWrapper = ({ basket, promo, availableRrcCoupons, ...restProps }) => {
            if (!availableRrcCoupons?.coupons || availableRrcCoupons.coupons.length === 0) {
                return null;
            }

            const propsToRender = {
                ...restProps,
                appliedPromotions: basket.appliedPromotions,
                promo,
                availableRrcCoupons
            };

            return <WrappedComponent {...propsToRender} />;
        };

        RrcPromoWrapper.displayName = `RrcPromoWrapper(${WrappedComponent.displayName})`;

        return RrcPromoWrapper;
    }
);

export default withRrcPromoProps;
