import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import CVCInfoModal from 'components/RwdCheckout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';
import OrderActions from 'actions/OrderActions';
import RwdCheckoutActions from 'actions/RwdCheckoutActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const localization = createStructuredSelector({
    cvcInfoTitle: getTextFromResource(getText, 'cvcInfoTitle'),
    visaCardCustomers: getTextFromResource(getText, 'visaCardCustomers'),
    yourSecurityCodeMsg: getTextFromResource(getText, 'yourSecurityCodeMsg'),
    backOfCard: getTextFromResource(getText, 'backOfCard'),
    amexCustomers: getTextFromResource(getText, 'amexCustomers'),
    yourCodeAmexMsg: getTextFromResource(getText, 'yourCodeAmexMsg'),
    frontOfAmexCard: getTextFromResource(getText, 'frontOfAmexCard')
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
