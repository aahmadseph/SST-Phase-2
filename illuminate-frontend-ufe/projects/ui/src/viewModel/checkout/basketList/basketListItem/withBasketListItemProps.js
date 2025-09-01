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

import basketSelector from 'selectors/basket/basketSelector';
import { userSelector } from 'selectors/user/userSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Checkout/PromoSection/BasketList/locales', 'BasketList');

const fields = createSelector(
    basketSelector,
    userSelector,
    (_state, ownProps) => ownProps.item,
    (_state, ownProps) => ownProps.isUserSduTrialEligible,
    createStructuredSelector({
        free: getTextFromResource(getText, 'free'),
        sephoraSubscription: getTextFromResource(getText, 'sephoraSubscription')
    }),
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
    removeMsgPromosByCode: PromoActions.removeMsgPromosByCode
};

const withBasketListItemProps = wrapHOC(connect(fields, functions));

export {
    withBasketListItemProps, fields, functions
};

export default withBasketListItemProps;
