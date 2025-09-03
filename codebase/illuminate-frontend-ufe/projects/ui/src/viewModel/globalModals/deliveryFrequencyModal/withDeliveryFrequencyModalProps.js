import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import dateUtils from 'utils/Date';
import StringUtils from 'utils/String';
import { userSelector } from 'selectors/user/userSelector';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';

const { formatLegalCopy } = DeliveryFrequencyUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/DeliveryFrequencyModal/locales', 'DeliveryFrequencyModal');

const fields = createSelector(
    (_state, ownProps) => ownProps.currentProduct,
    (_state, ownProps) => ownProps.isManageSubscription,
    userSelector,
    createStructuredSelector({
        lastDeliveryLeft: getTextFromResource(getText, 'lastDeliveryLeft', ['{0}']),
        deliveriesLeft: getTextFromResource(getText, 'deliveriesLeft', ['{0}']),
        discountValidUntil: getTextFromResource(getText, 'discountValidUntil', ['{0}']),
        discountsValidUntil: getTextFromResource(getText, 'discountsValidUntil', ['{0}'])
    }),
    (currentProduct, isManageSubscription, user, textResources) => {
        const { deliveriesLeft, lastDeliveryLeft, discountValidUntil, discountsValidUntil } = textResources;
        const { acceleratedPromotion } = currentProduct?.currentSku || currentProduct?.sku;

        const acceleratedPromotionData = {};

        if (acceleratedPromotion) {
            const { promoExpirationDate, remainingOrderCount, discountAmount } = acceleratedPromotion;

            if (isManageSubscription) {
                const promoExpiryDate = dateUtils.formatDateMDY(promoExpirationDate, true, false, true);

                acceleratedPromotionData.discountDeliveriesLeft = StringUtils.format(
                    remainingOrderCount > 1 ? deliveriesLeft : lastDeliveryLeft,
                    Math.ceil(discountAmount)
                );

                acceleratedPromotionData.discountsValidUntilMessage = StringUtils.format(
                    remainingOrderCount > 1 ? discountsValidUntil : discountValidUntil,
                    promoExpiryDate
                );
            } else {
                acceleratedPromotionData.legalCopy = formatLegalCopy(
                    (currentProduct?.currentSku || currentProduct?.sku)?.replenishmentAdjuster,
                    acceleratedPromotion.childOrderCount
                );
            }
        }

        return {
            ...acceleratedPromotionData,
            user
        };
    }
);

const withDeliveryFrequencyModalProps = wrapHOC(connect(fields));

export {
    withDeliveryFrequencyModalProps, fields
};
