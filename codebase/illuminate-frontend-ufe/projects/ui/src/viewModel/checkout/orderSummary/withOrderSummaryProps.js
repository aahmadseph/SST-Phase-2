import AddToBasketActions from 'actions/AddToBasketActions';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import itemsByBasketSelector from 'selectors/order/orderDetails/items/itemsByBasket/itemsByBasketSelector';
import { showCheckoutExpandOrderListSelector } from 'viewModel/selectors/testTarget/showCheckoutExpandOrderListSelector';

const {
    BASKET_TYPES: { SAMEDAY_BASKET }
} = AddToBasketActions;

const withOrderSummaryProps = connect(
    createSelector(itemsByBasketSelector, showCheckoutExpandOrderListSelector, (itemsByBasket = [], showCheckoutExpandOrderList) => {
        const sddBasket = itemsByBasket.find(item => item.basketType === SAMEDAY_BASKET) || Empty.Object;
        const sddBasketHasItems = (sddBasket.items || []).length > 0;

        return {
            sddBasketHasItems,
            showCheckoutExpandOrderList
        };
    })
);

export default withOrderSummaryProps;
