import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import promoErrorSelector from 'selectors/promo/promoError/promoErrorSelector';
import promotionSelector from 'selectors/order/orderDetails/promotion/promotionSelector';
import basketSelector from 'selectors/basket/basketSelector';
import { orderSelector } from 'selectors/order/orderSelector';

import addToBasketActions from 'actions/AddToBasketActions';
import Actions from 'Actions';

export default connect(
    createStructuredSelector({
        error: promoErrorSelector,
        promotion: promotionSelector,
        basket: basketSelector,
        order: orderSelector
    }),
    {
        refreshBasket: addToBasketActions.refreshBasket,
        showBccModal: Actions.showBccModal,
        showContentModal: Actions.showContentModal
    }
);
