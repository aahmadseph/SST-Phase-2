import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import OrderUtils from 'utils/Order';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import checkoutApi from 'services/api/checkout';
import { SMS_NOTIFICATION_STATUS } from 'constants/orderStatus';
import actions from 'Actions';

const { getOrderId, getStoreDetails } = OrderUtils;
const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/OrderConfirmation/locales', 'OrderConfirmation');

const fields = createStructuredSelector({
    seeFAQ: getTextFromResource(getText, 'seeFAQ'),
    seeCurbsideConciergeLocation: getTextFromResource(getText, 'seeCurbsideConciergeLocation'),
    trackYourOrder: getTextFromResource(getText, 'trackYourOrder'),
    canceledItemsText: getTextFromResource(getText, 'canceledItems'),
    storeDetailsText: getTextFromResource(getText, 'storeDetails'),
    curbsidePickUpFirstLine: getTextFromResource(getText, 'curbsidePickUpFirstLine'),
    curbsidePickUpParagraphPrefix: getTextFromResource(getText, 'curbsidePickUpParagraphPrefix'),
    seeBelow: getTextFromResource(getText, 'seeBelow'),
    curbsidePickUpParagraphSufix: getTextFromResource(getText, 'curbsidePickUpParagraphSufix'),
    curbsideConciergeInstructionsTitle: getTextFromResource(getText, 'curbsideConciergeInstructionsTitle'),
    conciergePickupPrefix: getTextFromResource(getText, 'conciergePickupPrefix'),
    describedBelow: getTextFromResource(getText, 'describedBelow'),
    conciergePickupSuffix: getTextFromResource(getText, 'conciergePickupSuffix'),
    curbsidePickup: getTextFromResource(getText, 'curbsidePickup'),
    curbsideConciergePickupRequirement: getTextFromResource(getText, 'curbsideConciergePickupRequirement'),
    callStore: getTextFromResource(getText, 'callStore'),
    pickupBarcodeMsg: getTextFromResource(getText, 'pickupBarcodeMsg')
});

const functions = dispatch => ({
    getSmsNotificationFlag: callback => {
        checkoutApi
            .getOrderHeader(getOrderId())
            .then(res => {
                callback && callback(res.smsNotificationFlag);
            })
            .catch(() => {
                callback && callback(SMS_NOTIFICATION_STATUS.NOT_AVAILABLE);
            });
    },
    openInStoreAddressLinkModal: () => {
        const action = actions.showFindInStoreMapModal({
            isOpen: true,
            currentProduct: null,
            selectedStore: getStoreDetails()
        });

        return dispatch(action);
    }
});

const withOrderStatusProgressionDetailProps = wrapHOC(connect(fields, functions));

export {
    withOrderStatusProgressionDetailProps, fields, functions
};
