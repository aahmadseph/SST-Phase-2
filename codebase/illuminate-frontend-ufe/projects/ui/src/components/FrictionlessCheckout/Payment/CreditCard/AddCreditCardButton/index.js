import AddCreditCardButton from 'components/FrictionlessCheckout/Payment/CreditCard/AddCreditCardButton/AddCreditCardButton';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { connect } from 'react-redux';

const { wrapHOC } = FrameworkUtils;

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const localizationSelector = createStructuredSelector({
    addNewCreditCard: getTextFromResource(getText, 'addNewCreditCard'),
    debitCardDisclaimer: getTextFromResource(getText, 'debitCardDisclaimer')
});

const fields = createSelector(
    localizationSelector,
    (_ownState, ownProps) => ownProps.isZeroCheckout,
    localization => {
        const isCanada = LanguageLocaleUtils.isCanada();

        return {
            label: localization.addNewCreditCard,
            debitCardDisclaimer: localization.debitCardDisclaimer,
            isCanada
        };
    }
);

const withPaymentProps = wrapHOC(connect(fields, null));

export default withPaymentProps(AddCreditCardButton);
