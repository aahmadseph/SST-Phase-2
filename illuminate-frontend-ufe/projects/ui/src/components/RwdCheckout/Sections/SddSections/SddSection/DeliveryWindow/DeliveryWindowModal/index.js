import DeliveryWindowModal from 'components/RwdCheckout/Sections/SddSections/SddSection/DeliveryWindow/DeliveryWindowModal/DeliveryWindowModal';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/SddSections/SddSection/locales', 'SddSection');

const textResources = createStructuredSelector({
    cancelLinkText: getTextFromResource(getText, 'cancelLinkText'),
    confirm: getTextFromResource(getText, 'confirm')
});

const connectedDeliveryWindowModal = connect(
    createSelector(textResources, texts => {
        return texts;
    })
);

const withDeliveryWindowModalProps = wrapHOC(connectedDeliveryWindowModal);

export default withDeliveryWindowModalProps(DeliveryWindowModal);
