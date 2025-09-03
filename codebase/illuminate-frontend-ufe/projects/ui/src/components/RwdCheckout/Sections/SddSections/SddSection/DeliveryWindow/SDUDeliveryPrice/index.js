import SDUDeliveryPrice from 'components/RwdCheckout/Sections/SddSections/SddSection/DeliveryWindow/SDUDeliveryPrice/SDUDeliveryPrice';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;

const getText = getLocaleResourceFile(
    'components/RwdCheckout/Sections/SddSections/SddSection/DeliveryWindow/SDUDeliveryPrice/locales',
    'SDUDeliveryPrice'
);

const textResources = createStructuredSelector({
    sduMemberFeeCA: getTextFromResource(getText, 'sduMemberFeeCA'),
    sduMemberFeeUS: getTextFromResource(getText, 'sduMemberFeeUS'),
    sduScheduledFeeCA: getTextFromResource(getText, 'sduScheduledFeeCA'),
    sduScheduledFeeUS: getTextFromResource(getText, 'sduScheduledFeeUS')
});

const connectedSDUDeliveryPrice = connect(
    createSelector(textResources, texts => {
        const sduMemberFee = isCanada() ? texts.sduMemberFeeCA : texts.sduMemberFeeUS;
        const sduScheduledFee = isCanada() ? texts.sduScheduledFeeCA : texts.sduScheduledFeeUS;

        return {
            sduMemberFee,
            sduScheduledFee
        };
    })
);

const withSDUDeliveryPriceProps = wrapHOC(connectedSDUDeliveryPrice);

export default withSDUDeliveryPriceProps(SDUDeliveryPrice);
