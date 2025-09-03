import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ConfirmResumeAutoReplenModal/locales', 'ConfirmResumeAutoReplenModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.item,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        mainHeader: getTextFromResource(getText, 'mainHeader'),
        subHeader: getTextFromResource(getText, 'subHeader'),
        itemText: getTextFromResource(getText, 'item'),
        qty: getTextFromResource(getText, 'qty'),
        notRated: getTextFromResource(getText, 'notRated'),
        oneReview: getTextFromResource(getText, 'oneReview'),
        yearlySavings: getTextFromResource(getText, 'yearlySavings'),
        done: getTextFromResource(getText, 'done'),
        firstYearSavings: getTextFromResource(getText, 'firstYearSavings'),
        lastDeliveryLeft: getTextFromResource(getText, 'lastDeliveryLeft', ['{0}']),
        deliveriesLeft: getTextFromResource(getText, 'deliveriesLeft', ['{0}']),
        discountValidUntil: getTextFromResource(getText, 'discountValidUntil', ['{0}']),
        discountsValidUntil: getTextFromResource(getText, 'discountsValidUntil', ['{0}'])
    }),
    (item, textResources) => {
        const {
            deliveriesLeft, lastDeliveryLeft, discountValidUntil, discountsValidUntil, ...restTextResources
        } = textResources;
        const { acceleratedPromotion } = item;

        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount } = acceleratedPromotion;
            const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, false, true);

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
            ...acceleratedPromotionData
        };
    }
);

const withConfirmResumeAutoReplenModalProps = wrapHOC(connect(fields));

export {
    withConfirmResumeAutoReplenModalProps, fields
};
