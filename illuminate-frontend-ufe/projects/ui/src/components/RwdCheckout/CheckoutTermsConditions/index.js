import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import CheckoutTermsConditions from 'components/RwdCheckout/CheckoutTermsConditions/CheckoutTermsConditions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Review/locales', 'ReviewText');

const localization = createStructuredSelector({
    pleaseReviewOrderInfoText: getTextFromResource(getText, 'pleaseReviewOrderInfoText'),
    byPlacingOrderCaText: getTextFromResource(getText, 'byPlacingOrderCaText'),
    termsOfPurchase: getTextFromResource(getText, 'termsOfPurchase'),
    termsOfUse: getTextFromResource(getText, 'termsOfUse'),
    privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
    andText: getTextFromResource(getText, 'andText')
});

const fields = createStructuredSelector({
    localization
});

const withComponentProps = wrapHOC(connect(fields, null));

export default withComponentProps(CheckoutTermsConditions);
