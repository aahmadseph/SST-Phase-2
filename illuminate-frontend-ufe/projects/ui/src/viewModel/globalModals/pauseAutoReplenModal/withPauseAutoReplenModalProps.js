import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { getImageAltText } from 'utils/Accessibility';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';

const { formatSavingAmountString } = DeliveryFrequencyUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/PauseAutoReplenModal/locales', 'PauseAutoReplenModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.subscription,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        mainHeader: getTextFromResource(getText, 'mainHeader'),
        pause: getTextFromResource(getText, 'pause'),
        cancel: getTextFromResource(getText, 'cancel'),
        itemText: getTextFromResource(getText, 'item'),
        qtyText: getTextFromResource(getText, 'qty'),
        notRated: getTextFromResource(getText, 'notRated'),
        oneReview: getTextFromResource(getText, 'oneReview'),
        yearlySavings: getTextFromResource(getText, 'yearlySavings'),
        rememberMessage: getTextFromResource(getText, 'rememberMessage', ['{0}', '{1}', '{2}']),
        last: getTextFromResource(getText, 'last'),
        discount: getTextFromResource(getText, 'discount'),
        discounts: getTextFromResource(getText, 'discounts'),
        firstYearSavings: getTextFromResource(getText, 'firstYearSavings'),
        lastDeliveryLeft: getTextFromResource(getText, 'lastDeliveryLeft', ['{0}']),
        deliveriesLeft: getTextFromResource(getText, 'deliveriesLeft', ['{0}']),
        discountValidUntil: getTextFromResource(getText, 'discountValidUntil', ['{0}']),
        discountsValidUntil: getTextFromResource(getText, 'discountsValidUntil', ['{0}'])
    }),
    (subscription, textResources) => {
        const item = subscription?.items[0];
        const imageAltText = item && getImageAltText(item);
        const discountPrice = formatSavingAmountString({
            replenishmentAdjuster: item?.discountAmount,
            replenishmentAdjusterPrice: item?.discountedPrice,
            replenishmentAdjusterType: item?.discountType
        });
        const {
            rememberMessage,
            last,
            discount,
            discounts,
            deliveriesLeft,
            lastDeliveryLeft,
            discountValidUntil,
            discountsValidUntil,
            ...restTextResources
        } = textResources;
        const { acceleratedPromotion } = item;
        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount } = acceleratedPromotion;
            const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, false, true);
            const promoExpiryDateFull = dateUtils.formatDateMDY(promoExpirationDate, true, true, true);
            const remainingCountCopy = remainingOrderCount > 1 ? remainingOrderCount : last;
            const discountCopy = remainingOrderCount > 1 ? discounts : discount;

            acceleratedPromotionData.rememberMessageCopy = `${StringUtils.format(
                rememberMessage,
                promoExpiryDateFull,
                remainingCountCopy,
                Math.ceil(discountAmount)
            )} ${discountCopy}.`;

            acceleratedPromotionData.discountDeliveriesLeft = StringUtils.format(
                remainingOrderCount > 1 ? deliveriesLeft : lastDeliveryLeft,
                Math.ceil(discountAmount)
            );

            acceleratedPromotionData.discountsValidUntilMessage = StringUtils.format(
                remainingOrderCount > 1 ? discountsValidUntil : discountValidUntil,
                promoExpiryDate
            );
        }

        return {
            ...restTextResources,
            ...acceleratedPromotionData,
            item,
            imageAltText,
            discountPrice
        };
    }
);

const functions = (_dispatch, ownProps) => ({
    onModalClose: () => {
        AutoReplenishmentBindings.pauseClose(ownProps.subscription);
        ownProps.onDismiss();
    }
});

const withPauseAutoReplenModalProps = wrapHOC(connect(fields, functions));

export {
    withPauseAutoReplenModalProps, functions
};
