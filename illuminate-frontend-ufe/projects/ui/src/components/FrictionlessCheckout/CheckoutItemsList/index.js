import BasketConstants from 'constants/Basket';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import CheckoutItemsList from 'components/FrictionlessCheckout/CheckoutItemsList/CheckoutItemsList';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { BasketType } = BasketConstants;
const { wrapHOC } = FrameworkUtils;
const emptyBasket = [];

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/CheckoutItemsList/locales', 'CheckoutItemsList');

const localization = createStructuredSelector({
    items: getTextFromResource(getText, 'items'),
    item: getTextFromResource(getText, 'item'),
    substitution: getTextFromResource(getText, 'substitution'),
    itemsInOrder: getTextFromResource(getText, 'itemsInOrder'),
    substituteWith: getTextFromResource(getText, 'substituteWith'),
    doNotsubstitute: getTextFromResource(getText, 'doNotsubstitute'),
    size: getTextFromResource(getText, 'size')
});

const fields = createSelector(
    itemsByBasketSelector,
    orderDetailsSelector,
    (_state, ownProps) => ({
        basketType: ownProps.basketType,
        isCanada: ownProps.isCanada,
        isUS: ownProps.isUS,
        isSDUOnlyOrder: ownProps.isSDUOnlyOrder
    }),
    (_state, ownProps) => ownProps.showAutoReplenishItems,
    (_state, ownProps) => ownProps.standardOnly,
    (_state, ownProps) => ownProps.giftCardsOnly,
    (_state, ownProps) => ownProps.splitEddItems,
    (_state, ownProps) => ownProps.showSplitEDD,
    localization,
    (
        itemsByBasket = [],
        orderDetails,
        { basketType, isCanada, isUS, isSDUOnlyOrder },
        showAutoReplenishItems,
        standardOnly,
        giftCardsOnly,
        splitEddItems,
        showSplitEDD,
        locales
    ) => {
        let items = emptyBasket;
        let itemsCount = 0;
        let sddTitle = '';
        let hasItemsSustitutions = false;

        if (basketType === BasketType.SameDay) {
            const sddBasket = itemsByBasket.find(item => item.basketType === 'SameDay') || {};
            sddTitle = sddBasket.sameDayTitle;

            if ((sddBasket.items || []).length > 0) {
                items = sddBasket.items;
                itemsCount = sddBasket.itemsCount;
            }
        } else if (basketType === BasketType.BOPIS) {
            items = orderDetails?.items?.items;
            itemsCount = orderDetails?.items?.itemCount;
        } else if (showSplitEDD) {
            items = splitEddItems;
        } else {
            const standardBasket = itemsByBasket.find(item => item.basketType === 'ShipToHome') || {};

            if ((standardBasket.items || []).length > 0) {
                if (giftCardsOnly) {
                    items = standardBasket.items.filter(item => item.sku.type === 'Gift Card');
                    itemsCount = items.length;
                } else {
                    items = standardOnly
                        ? standardBasket.items.filter(item => !item.isReplenishment).filter(item => item.sku.type !== 'Gift Card')
                        : showAutoReplenishItems
                            ? standardBasket.items.filter(item => item.isReplenishment)
                            : standardBasket.items;
                    itemsCount = standardBasket.itemsCount;
                }
            }
        }

        const itemsText = items.length > 1 || isSDUOnlyOrder || giftCardsOnly || basketType === BasketType.BOPIS ? locales.items : locales.item;
        const title = `${itemsText} (${itemsCount})`;
        hasItemsSustitutions = !!items.find(item => item.substituteSku);

        return {
            isCanada,
            isUS,
            items,
            title,
            sddTitle,
            hasItemsSustitutions,
            itemsCount,
            listCount: items.length,
            giftCardsOnly,
            locales
        };
    }
);

const functions = {};

const withCheckoutItemsListProps = wrapHOC(connect(fields, functions));

export default withCheckoutItemsListProps(CheckoutItemsList);
