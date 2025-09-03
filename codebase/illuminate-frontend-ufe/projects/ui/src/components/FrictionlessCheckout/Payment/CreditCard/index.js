import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import CreditCard from 'components/FrictionlessCheckout/Payment/CreditCard/CreditCard';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/CreditCard/locales', 'CreditCard');

const localization = createStructuredSelector({
    defaultCard: getTextFromResource(getText, 'defaultCard'),
    exp: getTextFromResource(getText, 'exp')
});

const fields = createSelector(localization, locales => {
    return {
        locales
    };
});

const withCreditCardProps = wrapHOC(connect(fields, null));

export default withCreditCardProps(CreditCard);
