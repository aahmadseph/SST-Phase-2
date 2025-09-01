import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import AddToBasketActions from 'actions/AddToBasketActions';
import LoveActions from 'actions/LoveActions';
import Actions from 'Actions';
import ProductSpecificActions from 'actions/ProductSpecificActions';
import PromoActions from 'actions/PromoActions';
import dateUtils from 'utils/Date';
import skuUtils from 'utils/Sku';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import BasketListItem from 'components/RwdCheckout/PromoSection/BasketList/BasketListItem/BasketListItem';

import basketSelector from 'selectors/basket/basketSelector';
import { userSelector } from 'selectors/user/userSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/rwdCheckout/PromoSection/BasketList/locales', 'BasketList');

const localization = createStructuredSelector({
    getIsSooner: getTextFromResource(getText, 'getIsSooner'),
    changeMethod: getTextFromResource(getText, 'changeMethod'),
    shippingRestrictionPopoverText: getTextFromResource(getText, 'shippingRestrictionPopoverText'),
    shippingRestrictions: getTextFromResource(getText, 'shippingRestrictions'),
    soldOut: getTextFromResource(getText, 'soldOut'),
    outOfStockAtStore: getTextFromResource(getText, 'outOfStockAtStore'),
    outOfStock: getTextFromResource(getText, 'outOfStock'),
    rewardCardText: getTextFromResource(getText, 'rewardCardText'),
    moveToLoves: getTextFromResource(getText, 'moveToLoves'),
    loved: getTextFromResource(getText, 'loved'),
    remove: getTextFromResource(getText, 'remove'),
    sephoraSubscription: getTextFromResource(getText, 'sephoraSubscription')
});

const fields = createSelector(
    basketSelector,
    userSelector,
    (_state, ownProps) => ownProps.item,
    (_state, ownProps) => ownProps.isUserSduTrialEligible,
    localization,
    (basket, user, item, isUserSduTrialEligible, textResources) => {
        const isItemSDU = item.sku.type === 'SDU';
        const isReplenishment = item.isReplenishment;
        const hasUserSDUTrial = isItemSDU && isUserSduTrialEligible;
        const sduLogo = '/img/ufe/icons/same-day-unlimited.svg';
        const SDUFormattedDate = dateUtils.formatDateMDY(item?.replenishmentPaymentDate, true);
        const sduListPrice = item.sku.listPrice;
        const { free, ...restTextResources } = textResources;
        const sduRenewalPrice = hasUserSDUTrial ? `${free}*` : `${sduListPrice}*`;
        const isQuantityChangeable = isItemSDU || isReplenishment ? true : !skuUtils.isChangeableQuantity(item.sku);
        const displayLovesIcon =
            item.sku.actionFlags && !skuUtils.isSample(item.sku) && item.sku.actionFlags.myListStatus !== 'notApplicable' && !isItemSDU;

        return {
            ...restTextResources,
            localization: textResources,
            basket,
            user,
            isItemSDU,
            hasUserSDUTrial,
            sduLogo,
            SDUFormattedDate,
            sduListPrice,
            sduRenewalPrice,
            isQuantityChangeable,
            displayLovesIcon
        };
    }
);

const functions = {
    removeItemFromBasket: AddToBasketActions.removeItemFromBasket,
    refreshBasket: AddToBasketActions.refreshBasket,
    showQuickLookModal: Actions.showQuickLookModal,
    addLove: LoveActions.addLove,
    fetchProductSpecificDetails: ProductSpecificActions.fetchProductSpecificDetails,
    updateQuickLookContent: Actions.updateQuickLookContent,
    removeMsgPromosByCode: PromoActions.removeMsgPromosByCode,
    toggleChangeMethodModal: Actions.toggleChangeMethodModal,
    toggleChangeDeliveryFrequencyModal: Actions.toggleChangeDeliveryFrequencyModal,
    updateCurrentItem: Actions.updateCurrentItem
};

const withBasketListItemProps = wrapHOC(connect(fields, functions));

export default withBasketListItemProps(BasketListItem);
