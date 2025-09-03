import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { getImageAltText } from 'utils/Accessibility';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';

const { formatSavingAmountString } = DeliveryFrequencyUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/SkipAutoReplenModal/locales', 'SkipAutoReplenModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.subscription,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        mainHeader: getTextFromResource(getText, 'mainHeader'),
        skip: getTextFromResource(getText, 'skip'),
        cancel: getTextFromResource(getText, 'cancel'),
        itemText: getTextFromResource(getText, 'item'),
        qtyText: getTextFromResource(getText, 'qty'),
        notRated: getTextFromResource(getText, 'notRated'),
        oneReview: getTextFromResource(getText, 'oneReview'),
        yearlySavings: getTextFromResource(getText, 'yearlySavings'),
        nextShipmentBy: getTextFromResource(getText, 'nextShipmentBy'),
        skipRememberMessage: getTextFromResource(getText, 'skipRememberMessage'),
        skipRememberMessageLastRemaining: getTextFromResource(getText, 'skipRememberMessageLastRemaining', ['{0}']),
        skipRememberMessageNonLastRemaining: getTextFromResource(getText, 'skipRememberMessageNonLastRemaining', ['{0}', '{1}']),
        firstYearSavings: getTextFromResource(getText, 'firstYearSavings'),
        lastDeliveryLeft: getTextFromResource(getText, 'lastDeliveryLeft', ['{0}']),
        deliveriesLeft: getTextFromResource(getText, 'deliveriesLeft', ['{0}']),
        discountValidUntil: getTextFromResource(getText, 'discountValidUntil', ['{0}']),
        discountsValidUntil: getTextFromResource(getText, 'discountsValidUntil', ['{0}']),
        rateOf: getTextFromResource(getText, 'rateOf'),
        percentageOff: getTextFromResource(getText, 'percentageOff', ['{0}']),
        disruptsScheduleMessage: getTextFromResource(getText, 'disruptsScheduleMessage', ['{0}']),
        disruptsScheduleMessageNonLast: getTextFromResource(getText, 'disruptsScheduleMessageNonLast', ['{0}', '{1}']),
        disruptsScheduleMessageLast: getTextFromResource(getText, 'disruptsScheduleMessageLast', ['{0}'])
    }),
    (subscription, textResources) => {
        const item = subscription?.items[0];
        const {
            skipRememberMessage,
            skipRememberMessageLastRemaining,
            skipRememberMessageNonLastRemaining,
            deliveriesLeft,
            lastDeliveryLeft,
            discountValidUntil,
            discountsValidUntil,
            percentageOff,
            disruptsScheduleMessage,
            disruptsScheduleMessageNonLast,
            disruptsScheduleMessageLast,
            ...restTextResources
        } = textResources;
        const { acceleratedPromotion, basePromotion } = item;
        const imageAltText = item && getImageAltText(item);
        const skipDeliveryDate = dateUtils.getPromiseDate(`${subscription.nextScheduleRunDate}T00:00`);
        const nextDeliveryDate = dateUtils.getPromiseDate(`${subscription.nextToNextScheduledRunDate}T00:00`);
        const discountPrice = `${formatSavingAmountString({
            replenishmentAdjuster: item?.discountAmount,
            replenishmentAdjusterPrice: item?.discountedPrice,
            replenishmentAdjusterType: item?.discountType
        })}${acceleratedPromotion ? '*' : ''}`;

        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount, skippingLeadsToLossOfDiscount } = acceleratedPromotion;
            const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, false, true);
            const promoExpiryDateFull = dateUtils.formatDateMDY(promoExpirationDate, true, true, true);

            const transformedSkipMessageLastRemaining = StringUtils.format(skipRememberMessageLastRemaining, Math.ceil(discountAmount));
            const transformedSkipMessageNonLastRemaining = StringUtils.format(
                skipRememberMessageNonLastRemaining,
                remainingOrderCount,
                Math.ceil(discountAmount)
            );
            const skipRemainingMessageFinal = remainingOrderCount > 1 ? transformedSkipMessageNonLastRemaining : transformedSkipMessageLastRemaining;

            const transformedDiruptsScheduleNonLastRemaining = StringUtils.format(
                disruptsScheduleMessageNonLast,
                remainingOrderCount,
                Math.ceil(discountAmount)
            );
            const transformedDiruptsScheduleLastRemaining = StringUtils.format(disruptsScheduleMessageLast, Math.ceil(discountAmount));
            const disruptsScheduleMessageFinal =
                remainingOrderCount > 1 ? transformedDiruptsScheduleNonLastRemaining : transformedDiruptsScheduleLastRemaining;

            if (skippingLeadsToLossOfDiscount) {
                const disruptsScheduleMessageWithDate = StringUtils.format(disruptsScheduleMessage, promoExpiryDateFull);
                acceleratedPromotionData.skipWarningMessage = `${disruptsScheduleMessageWithDate} ${disruptsScheduleMessageFinal}.`;
            } else {
                acceleratedPromotionData.skipWarningMessage = `${skipRememberMessage} ${promoExpiryDateFull}${
                    remainingOrderCount === 1 ? ',' : ''
                } ${skipRemainingMessageFinal}`;
            }

            acceleratedPromotionData.discountDeliveriesLeft = StringUtils.format(
                remainingOrderCount > 1 ? deliveriesLeft : lastDeliveryLeft,
                Math.ceil(discountAmount)
            );

            acceleratedPromotionData.discountsValidUntilMessage = StringUtils.format(
                remainingOrderCount > 1 ? discountsValidUntil : discountValidUntil,
                promoExpiryDate
            );

            acceleratedPromotionData.percentageOffMessage = StringUtils.format(percentageOff, Math.ceil(basePromotion.discountAmount));
        }

        return {
            ...restTextResources,
            ...acceleratedPromotionData,
            item,
            skipDeliveryDate,
            nextDeliveryDate,
            imageAltText,
            discountPrice
        };
    }
);

const withSkipAutoReplenModalProps = wrapHOC(connect(fields));

export { withSkipAutoReplenModalProps };
