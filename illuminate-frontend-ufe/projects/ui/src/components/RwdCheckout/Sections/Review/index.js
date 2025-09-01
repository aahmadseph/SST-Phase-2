import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import ReviewText from 'components/RwdCheckout/Sections/Review/ReviewText';
import localeUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Review/locales', 'ReviewText');

const textResources = createStructuredSelector({
    pleaseReviewOrderInfoText: getTextFromResource(getText, 'pleaseReviewOrderInfoText'),
    byPlacingOrderCaText: getTextFromResource(getText, 'byPlacingOrderCaText'),
    termsOfPurchase: getTextFromResource(getText, 'termsOfPurchase'),
    termsOfUse: getTextFromResource(getText, 'termsOfUse'),
    andText: getTextFromResource(getText, 'andText'),
    privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
    verifyCVVeFulfilledOrder: getTextFromResource(getText, 'verifyCVVeFulfilledOrder'),
    verifyCVV: getTextFromResource(getText, 'verifyCVV'),
    noShippingAddressRequired: getTextFromResource(getText, 'noShippingAddressRequired'),
    noPaymentRequired: getTextFromResource(getText, 'noPaymentRequired')
});

const connectedPlaceOrderButton = connect(
    createSelector(textResources, texts => {
        const isCanada = localeUtils.isCanada();

        return { ...texts, isCanada };
    })
);

const withPlaceOrderButtonProps = wrapHOC(connectedPlaceOrderButton);

export default withPlaceOrderButtonProps(ReviewText);
