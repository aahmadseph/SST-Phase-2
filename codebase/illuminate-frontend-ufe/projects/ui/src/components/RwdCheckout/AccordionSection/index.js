import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import AccordionSection from 'components/RwdCheckout/AccordionSection/AccordionSection';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/AccordionSection/locales', 'AccordionSection');

const localization = createStructuredSelector({
    secure: getTextFromResource(getText, 'secure'),
    edit: getTextFromResource(getText, 'edit'),
    shippingTo: getTextFromResource(getText, 'shippingTo'),
    pickupOrderContactInfo: getTextFromResource(getText, 'pickUpOrderContactInfo'),
    pickUpOrderLocationInfo: getTextFromResource(getText, 'pickUpOrderLocationInfo'),
    giftCardShippingAddress: getTextFromResource(getText, 'giftCardShippingAddress'),
    giftCardDeliveryMessage: getTextFromResource(getText, 'giftCardDeliveryMessage'),
    shippingAddress: getTextFromResource(getText, 'shippingAddress'),
    deliveryGiftOptions: getTextFromResource(getText, 'deliveryGiftOptions'),
    deliveryAutoReplenish: getTextFromResource(getText, 'deliveryAutoReplenish'),
    paymentMethod: getTextFromResource(getText, 'paymentMethod'),
    accountCreation: getTextFromResource(getText, 'accountCreation'),
    reviewPlaceOrder: getTextFromResource(getText, 'reviewPlaceOrder'),
    shippingDelivery: getTextFromResource(getText, 'shippingDelivery'),
    shippingToFedex: getTextFromResource(getText, 'shippingToFedex'),
    shipToPickupLocation: getTextFromResource(getText, 'shipToPickupLocation'),
    reviewSubmitEditsTitle: getTextFromResource(getText, 'reviewSubmitEditsTitle'),
    reviewSubmitSubscribeTitle: getTextFromResource(getText, 'reviewSubmitSubscribeTitle'),
    updatedBadge: getTextFromResource(getText, 'updatedBadge'),
    deliverTo: getTextFromResource(getText, 'deliverTo'),
    deliverToNote: getTextFromResource(getText, 'deliverToNote'),
    deliverToNoteAutoReplenish: getTextFromResource(getText, 'deliverToNoteAutoReplenish'),
    somePaymentCannotUsed: getTextFromResource(getText, 'somePaymentCannotUsed'),
    giftMessage: getTextFromResource(getText, 'giftMessage'),
    freeReturns: getTextFromResource(getText, 'freeReturns'),
    onAllPurchases: getTextFromResource(getText, 'onAllPurchases')
});

const fields = createStructuredSelector({
    localization
});

const withComponentProps = wrapHOC(connect(fields, null));

export default withComponentProps(AccordionSection);
