import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import PickupInfoCard from 'components/FrictionlessCheckout/BopisSection/PickupInfoCard/PickupInfoCard';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import orderErrorsSelector from 'selectors/order/orderErrorsSelector';
import Actions from 'Actions';
import anaConsts from 'analytics/constants';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/BopisSection/locales', 'BopisSection');

const localization = createStructuredSelector({
    pickupCardTitle: getTextFromResource(getText, 'pickupCardTitle'),
    pickupStore: getTextFromResource(getText, 'pickupStore'),
    pickupPerson: getTextFromResource(getText, 'pickupPerson'),
    altPickupPerson: getTextFromResource(getText, 'altPickupPerson'),
    confirmationDetails: getTextFromResource(getText, 'confirmationDetails'),
    addAltPickupPerson: getTextFromResource(getText, 'addAltPickupPerson'),
    usuallyReady: getTextFromResource(getText, 'usuallyReady'),
    inStorePickup: getTextFromResource(getText, 'inStorePickup'),
    curbsidePickup: getTextFromResource(getText, 'curbsidePickup'),
    modalMessage: getTextFromResource(getText, 'modalMessage'),
    gotIt: getTextFromResource(getText, 'gotIt'),
    edit: getTextFromResource(getText, 'edit'),
    information: getTextFromResource(getText, 'information'),
    forThisOrderText: getTextFromResource(getText, 'forThisOrderText'),
    pickupConfirmationDetails: getTextFromResource(getText, 'pickupConfirmationDetails'),
    itemsToBePickedUp: getTextFromResource(getText, 'itemsToBePickedUp')
});

export const fields = createSelector(orderDetailsSelector, orderErrorsSelector, localization, (orderDetails, sectionErrors, locale) => {
    const sectionLevelError = sectionErrors?.[SECTION_NAMES.BOPIS_PICKUP_INFO]?.length && sectionErrors?.[SECTION_NAMES.BOPIS_PICKUP_INFO];

    return {
        localization: locale,
        pickupDetails: orderDetails.pickup,
        sectionLevelError
    };
});

export const functions = {
    showInfoModal: Actions.showInfoModal,
    showAlternatePickupPersonModal: (...args) => {
        const { alternatePickupData = {}, isOpen = null } = args[0] || [];

        if (Object.keys(alternatePickupData).length > 0 && isOpen) {
            // Edit
            FrictionlessCheckoutBindings.setAlternatePickupAnalytics(anaConsts.ALT_PICKUP.EDIT, anaConsts.ASYNC_PAGE_LOAD);
        } else if (Object.keys(alternatePickupData).length === 0 && isOpen) {
            // Add
            FrictionlessCheckoutBindings.setAlternatePickupAnalytics(anaConsts.ALT_PICKUP.ADD, anaConsts.ASYNC_PAGE_LOAD);
        }

        return Actions.showAlternatePickupPersonModal(...args);
    }
};

const withComponentProps = wrapHOC(connect(fields, functions));

export default withComponentProps(PickupInfoCard);
