import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/UnsubscribeAutoReplenModal/locales', 'UnsubscribeAutoReplenModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.subscription,
    userSelector,
    createStructuredSelector({
        firstYearSavings: getTextFromResource(getText, 'firstYearSavings'),
        lastDeliveryLeft: getTextFromResource(getText, 'lastDeliveryLeft', ['{0}']),
        deliveriesLeft: getTextFromResource(getText, 'deliveriesLeft', ['{0}']),
        discountValidUntil: getTextFromResource(getText, 'discountValidUntil', ['{0}']),
        discountsValidUntil: getTextFromResource(getText, 'discountsValidUntil', ['{0}']),
        cancellingWillForfeit: getTextFromResource(getText, 'cancellingWillForfeit'),
        last: getTextFromResource(getText, 'last'),
        limitedTime: getTextFromResource(getText, 'limitedTime'),
        percentageOff: getTextFromResource(getText, 'percentageOff', ['{0}']),
        discount: getTextFromResource(getText, 'discount'),
        discounts: getTextFromResource(getText, 'discounts'),
        futureSubscriptions: getTextFromResource(getText, 'futureSubscriptions', ['{0}'])
    }),
    (subscription, user, textResources) => {
        const item = subscription?.items[0];
        const {
            deliveriesLeft,
            lastDeliveryLeft,
            discountValidUntil,
            discountsValidUntil,
            last,
            percentageOff,
            discount,
            discounts,
            futureSubscriptions,
            ...restTextResources
        } = textResources;
        const { acceleratedPromotion, basePromotion } = item;

        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount } = acceleratedPromotion;
            const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, true, true);

            acceleratedPromotionData.discountDeliveriesLeft = StringUtils.format(
                remainingOrderCount > 1 ? deliveriesLeft : lastDeliveryLeft,
                Math.ceil(discountAmount)
            );

            acceleratedPromotionData.discountsValidUntilMessage = StringUtils.format(
                remainingOrderCount > 1 ? discountsValidUntil : discountValidUntil,
                promoExpiryDate
            );

            acceleratedPromotionData.remainingOrder = remainingOrderCount > 1 ? remainingOrderCount : last;
            acceleratedPromotionData.offMessage = StringUtils.format(percentageOff, Math.ceil(discountAmount));
            const deliveryMessage = remainingOrderCount > 1 ? discounts : discount;
            const futureSubs = StringUtils.format(futureSubscriptions, Math.ceil(basePromotion.discountAmount));
            acceleratedPromotionData.futureSubscriptionsMessage = ` ${deliveryMessage}. ${futureSubs}.`;
        }

        return {
            ...restTextResources,
            ...acceleratedPromotionData,
            user
        };
    }
);

const withUnsubscribeAutoReplenModalProps = wrapHOC(connect(fields));

export {
    fields, withUnsubscribeAutoReplenModalProps
};
