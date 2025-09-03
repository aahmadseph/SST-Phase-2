import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import itemsByBasketSelector from 'selectors/order/orderDetails/items/itemsByBasket/itemsByBasketSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import ShippingMethods from 'components/FrictionlessCheckout/ShippingMethods/ShippingMethods';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import orderUtils from 'utils/Order';
import Actions from 'Actions';
import Empty from 'constants/empty';
import OrderActions from 'actions/OrderActions';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import { withSplitEDDProps } from 'viewModel/sharedComponents/splitEDD/withSplitEDDProps';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const {
    SHIPPING_GROUPS: { SAME_DAY, GIFT }
} = orderUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/ShippingMethods/locales', 'ShippingMethods');

const localization = createStructuredSelector({
    free: getTextFromResource(getText, 'free'),
    getItShipped: getTextFromResource(getText, 'getItShipped'),
    items: getTextFromResource(getText, 'items'),
    title: getTextFromResource(getText, 'title'),
    shipping: getTextFromResource(getText, 'shipping'),
    autoReplenish: getTextFromResource(getText, 'autoReplenish'),
    deliveryFrequency: getTextFromResource(getText, 'deliveryFrequency'),
    chooseThisShippingSpeed: getTextFromResource(getText, 'chooseThisShippingSpeed'),
    shippingMethodType: getTextFromResource(getText, 'shippingMethodType'),
    expeditedText: getTextFromResource(getText, 'expeditedText'),
    changeShippingMethod: getTextFromResource(getText, 'changeShippingMethod'),
    waived: getTextFromResource(getText, 'waived'),
    waiveShippingHandling: getTextFromResource(getText, 'waiveShippingHandling')
});

function calculateItemsQuantity(items, excludeGifCard = false) {
    if (excludeGifCard) {
        return items.filter(item => item.sku.type !== 'Gift Card').reduce((acc, item) => acc + item.qty, 0);
    }

    return items.reduce((acc, item) => acc + item.qty, 0);
}

const functions = {
    showContentModal: Actions.showContentModal,
    showAutoReplenishProductsModal: Actions.showAutoReplenishProductsModal,
    updateWaiveShipping: OrderActions.updateWaiveShipping,
    refreshCheckout,
    setActiveSection: OrderActions.setCheckoutActiveSection
};

const fields = createSelector(
    orderSelector,
    orderDetailsSelector,
    localization,
    itemsByBasketSelector,
    (_ownState, ownProps) => ownProps.isSdd,
    (_ownState, ownProps) => ownProps.isPhysicalGiftCard,
    (order, orderDetails, locales, itemsByBasket = [], isSdd, isPhysicalGiftCard) => {
        const isSDDAndGiftCardOnly =
            orderDetails?.shippingGroups?.shippingGroupsEntries?.filter(
                group => group.shippingGroupType !== SAME_DAY && group.shippingGroupType !== GIFT
            )?.length === 0;
        let shippingGroup;
        let isElectronicShippingGroup = false;

        if (isSDDAndGiftCardOnly) {
            shippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(orderDetails);
        } else {
            shippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
        }

        if (isSdd && !shippingGroup) {
            shippingGroup = orderUtils.getElectronicsShippingGroup(orderDetails);
            isElectronicShippingGroup = true;
        }

        const allItemsAreReplen = orderUtils.allItemsInBasketAreReplen(orderDetails);
        const orderHasReplen = orderUtils.hasAutoReplenishItems(orderDetails);

        const standardBasket = itemsByBasket?.find(item => item.basketType === 'ShipToHome') || {};

        const standardItems = standardBasket.items.filter(item => !item.isReplenishment);
        const autoReplenishItems = standardBasket.items.filter(item => item.isReplenishment);
        const orderShippingMethods = order.orderShippingMethods || Empty.Array;
        const shippingMethods = orderShippingMethods[shippingGroup?.shippingGroupId];
        const shippingMethodSelected = shippingGroup?.shippingMethod?.shippingFee
            ? shippingGroup?.shippingMethod
            : shippingMethods?.reduce((min, method) => {
                const minShippingFee = parseFloat(min.shippingFee?.substring(1));
                const methodShippingFee = parseFloat(method.shippingFee?.substring(1));

                return methodShippingFee < minShippingFee ? method : min, shippingMethods[0];
            }, []);

        const standardItemsQuantity = calculateItemsQuantity(standardItems, !!isPhysicalGiftCard && !isSdd);
        const sectionLevelError =
            order.sectionErrors?.[SECTION_NAMES.SHIPPING_METHOD]?.length && order.sectionErrors?.[SECTION_NAMES.SHIPPING_METHOD];

        return {
            shippingGroup,
            allItemsAreReplen,
            orderHasReplen,
            standardBasket,
            locales,
            standardItemsQuantity,
            shippingMethods,
            shippingMethodSelected,
            orderId: orderDetails?.header?.orderId,
            orderDetails,
            sectionLevelError,
            ...(orderHasReplen && { replenishItemsQuantity: calculateItemsQuantity(autoReplenishItems), isReplenOnly: standardItemsQuantity === 0 }),
            sectionName: SECTION_NAMES.SHIPPING_METHOD,
            isElectronicShippingGroup,
            isSDDAndGiftCardOnly
        };
    }
);

const withShippingMethodProps = wrapHOC(connect(fields, functions));

export default withShippingMethodProps(withSplitEDDProps(ShippingMethods));
