import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import promoErrorSelector from 'selectors/promo/promoError/promoErrorSelector';
import promotionSelector from 'selectors/order/orderDetails/promotion/promotionSelector';
import basketSelector from 'selectors/basket/basketSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import Actions from 'Actions';

import addToBasketActions from 'actions/AddToBasketActions';

const { wrapHOC } = FrameworkUtils;

const { showContentModal, showBccModal } = Actions;

const fields = createSelector(promoErrorSelector, promotionSelector, basketSelector, orderSelector, (error, promotion, basket, order) => {
    return {
        error,
        promotion,
        basket,
        order
    };
});

const functions = {
    refreshBasket: addToBasketActions.refreshBasket,
    showBccModal,
    showContentModal
};

const withFeaturedOffersProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withFeaturedOffersProps
};
