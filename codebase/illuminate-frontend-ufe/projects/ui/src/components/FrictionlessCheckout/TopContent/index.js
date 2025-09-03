import TopContent from 'components/FrictionlessCheckout/TopContent/TopContent';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
const getText = getLocaleResourceFile('components/FrictionlessCheckout/TopContent/locales', 'TopContent');
const { wrapHOC } = FrameworkUtils;

const localization = createStructuredSelector({
    freeReturns: getTextFromResource(getText, 'freeReturns'),
    verifyCVVeFulfilledOrder: getTextFromResource(getText, 'verifyCVVeFulfilledOrder'),
    verifyCVV: getTextFromResource(getText, 'verifyCVV'),
    noPaymentRequired: getTextFromResource(getText, 'noPaymentRequired')
});

const fields = createSelector(localization, locale => {
    return {
        localization: locale
    };
});

const withTopContentProps = wrapHOC(connect(fields, null));

export default withTopContentProps(TopContent);
