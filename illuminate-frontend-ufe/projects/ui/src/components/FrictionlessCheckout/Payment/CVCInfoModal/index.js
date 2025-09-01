import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import CVCInfoModal from 'components/FrictionlessCheckout/Payment/CVCInfoModal/CVCInfoModal';
import OrderActions from 'actions/OrderActions';
import RwdCheckoutActions from 'actions/RwdCheckoutActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/CVCInfoModal/locales', 'CVCInfoModal');

const localization = createStructuredSelector({
    cvcInfoTitle: getTextFromResource(getText, 'cvcInfoTitle'),
    visaCardCustomers: getTextFromResource(getText, 'visaCardCustomers'),
    yourSecurityCodeMsg: getTextFromResource(getText, 'yourSecurityCodeMsg'),
    backOfCard: getTextFromResource(getText, 'backOfCard'),
    amexCustomers: getTextFromResource(getText, 'amexCustomers'),
    yourCodeAmexMsg: getTextFromResource(getText, 'yourCodeAmexMsg'),
    frontOfAmexCard: getTextFromResource(getText, 'frontOfAmexCard'),
    visaCardAltText: getTextFromResource(getText, 'visaCardAltText'),
    amexCardAltText: getTextFromResource(getText, 'amexCardAltText')
});

const fields = createSelector(localization, locales => {
    return {
        locales
    };
});

const functions = {
    showCVCInfoModal: OrderActions.showCVCInfoModal,
    toggleCVCInfoModal: RwdCheckoutActions.toggleCVCInfoModal
};

const withCVCInfoModalProps = wrapHOC(connect(fields, functions));

export default withCVCInfoModalProps(CVCInfoModal);
