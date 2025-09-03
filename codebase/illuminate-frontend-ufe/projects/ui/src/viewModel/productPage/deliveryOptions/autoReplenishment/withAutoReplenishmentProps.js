import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';

import basketSelector from 'selectors/basket/basketSelector';
import Actions from 'Actions';
import basketUtils from 'utils/Basket';
import DateUtil from 'utils/Date';
import DeliveryFrequencyUtils from 'utils/DeliveryFrequency';
import StringUtils from 'utils/String';

import LanguageLocaleUtils from 'utils/LanguageLocale';

const { formatSavingAmountString } = DeliveryFrequencyUtils;
const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions');

const fields = createSelector(
    basketSelector,
    (_state, ownProps) => ownProps.currentProduct,
    createStructuredSelector({
        autoReplenishTitle: getTextFromResource(getText, 'autoReplenishTitle'),
        deliveryEveryText: getTextFromResource(getText, 'deliveryEvery'),
        mostCommonText: getTextFromResource(getText, 'mostCommon'),
        autoReplenishLegalOptInText: getTextFromResource(getText, 'autoReplenishLegalOptIn'),
        subscriptionNotAvailableText: getTextFromResource(getText, 'subscriptionNotAvailable'),
        autoReplenishFirstTimeLegalShown: getTextFromResource(getText, 'autoReplenishFirstTimeLegalShown', ['{0}', '{1}', '{2}', '{3}']),
        autoReplenishFirstTimeLegalDetails: getTextFromResource(getText, 'autoReplenishFirstTimeLegalDetails'),
        autoReplenishFirstTimeLegalMoreDetails: getTextFromResource(getText, 'autoReplenishFirstTimeLegalMoreDetails', ['{0}', '{1}', '{2}', '{3}'])
    }),
    (basket, product, initialTextResources) => {
        const { currentSku = {} } = product;
        const { autoReplenishFirstTimeLegalShown, autoReplenishFirstTimeLegalMoreDetails, ...restOfTextResources } = initialTextResources;
        const isReplenishmentEligible = currentSku?.isReplenishmentEligible;
        const listPrice = parseFloat(basketUtils.removeCurrency(currentSku?.listPrice));
        const aboutAutoReplenish = getText('aboutAutoReplen');

        const { acceleratedPromotion } = currentSku;
        const { childOrderCount, promotionDuration, promotionExpirationDate, baseReplenishmentAdjuster } = acceleratedPromotion || {};

        const autoReplenishPromoDiscountFormatted = formatSavingAmountString(currentSku, null, true);
        const baseAutoReplenishPromoDiscountFormatted = `${Math.ceil(baseReplenishmentAdjuster)}%`;
        const autoReplenishPromoExpirationDateFormatted = DateUtil.getDateInMDYFormat(promotionExpirationDate);

        const autoReplenishPromoLegalCopyShown = StringUtils.format(
            autoReplenishFirstTimeLegalShown,
            autoReplenishPromoDiscountFormatted,
            childOrderCount,
            promotionDuration,
            autoReplenishPromoExpirationDateFormatted
        );

        const autoReplenishLegalMoreDetailsText = StringUtils.format(
            autoReplenishFirstTimeLegalMoreDetails,
            childOrderCount,
            autoReplenishPromoDiscountFormatted,
            promotionDuration,
            baseAutoReplenishPromoDiscountFormatted
        );

        const textResources = {
            ...restOfTextResources,
            aboutAutoReplenish,
            autoReplenishPromoLegalCopyShown,
            autoReplenishLegalMoreDetailsText
        };

        return {
            basket,
            isReplenishmentEligible,
            listPrice,
            textResources
        };
    }
);

const functions = {
    showSignInModal: Actions.showSignInModal
};

const withAutoReplenishmentProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withAutoReplenishmentProps
};
