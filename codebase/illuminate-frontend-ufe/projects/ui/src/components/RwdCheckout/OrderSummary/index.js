import OrderSummary from 'components/RwdCheckout/OrderSummary/OrderSummary';
import AddToBasketActions from 'actions/AddToBasketActions';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import Empty from 'constants/empty';
import itemsByBasketSelector from 'selectors/order/orderDetails/items/itemsByBasket/itemsByBasketSelector';
import { showCheckoutExpandOrderListSelector } from 'viewModel/selectors/testTarget/showCheckoutExpandOrderListSelector';
import localeUtils from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = localeUtils;

const {
    BASKET_TYPES: { SAMEDAY_BASKET }
} = AddToBasketActions;

const getText = getLocaleResourceFile('components/RwdCheckout/OrderSummary/locales', 'OrderSummary');

const textResources = createStructuredSelector({
    hideOrderSummary: getTextFromResource(getText, 'hideOrderSummary'),
    showOrderSummary: getTextFromResource(getText, 'showOrderSummary'),
    editBasket: getTextFromResource(getText, 'editBasket')
});

const withOrderSummaryProps = connect(
    createSelector(
        itemsByBasketSelector,
        showCheckoutExpandOrderListSelector,
        textResources,
        (itemsByBasket = [], showCheckoutExpandOrderList, { hideOrderSummary, showOrderSummary, editBasket }) => {
            const sddBasket = itemsByBasket.find(item => item.basketType === SAMEDAY_BASKET) || Empty.Object;
            const sddBasketHasItems = (sddBasket.items || []).length > 0;

            return {
                sddBasketHasItems,
                showCheckoutExpandOrderList,
                hideOrderSummary,
                showOrderSummary,
                editBasket
            };
        }
    )
);

export default withOrderSummaryProps(OrderSummary);
