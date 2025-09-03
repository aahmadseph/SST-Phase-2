import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import ShipAddressSection from 'components/FrictionlessCheckout/DeliverTo/ShipAddress/Section/ShipAddressSection';
import OrderActions from 'actions/OrderActions';
import store from 'store/Store';
import Location from 'utils/Location';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import checkoutUtils from 'utils/Checkout';

const saveAddress = (comp, clearErrors) => {
    store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname, comp, false));
    refreshCheckout({ clearErrors })().then(() => {
        comp.props.setAccessPoint(false);
        checkoutUtils.changeCheckoutUrlBasedOnOrderCompleteness(false, false, false);
        checkoutUtils.checkAndOrderCreditCardsUpdate();
    });
};

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/FrictionlessCheckout/DeliverTo/ShipAddress/locales', 'ShipAddress');

const textResources = createStructuredSelector({
    removeAddressLabel: getTextFromResource(getText, 'removeAddressLabel'),
    remove: getTextFromResource(getText, 'remove'),
    editAddressLabel: getTextFromResource(getText, 'editAddressLabel'),
    edit: getTextFromResource(getText, 'edit'),
    addShippingAddress: getTextFromResource(getText, 'addShippingAddress'),
    showMoreAddresses: getTextFromResource(getText, 'showMoreAddresses'),
    showLessAddresses: getTextFromResource(getText, 'showLessAddresses'),
    deliveryMethod: getTextFromResource(getText, 'deliveryMethod'),
    setAsDefaultCheckbox: getTextFromResource(getText, 'setAsDefaultCheckbox'),
    editShipAddress: getTextFromResource(getText, 'editShipAddress'),
    addNewShipAddress: getTextFromResource(getText, 'addNewShipAddress'),
    cancelButton: getTextFromResource(getText, 'cancelButton'),
    saveContinueButton: getTextFromResource(getText, 'saveContinueButton'),
    continueButton: getTextFromResource(getText, 'continueButton'),
    areYouSureMessage: getTextFromResource(getText, 'areYouSureMessage'),
    taxExemptAddressLabel: getTextFromResource(getText, 'taxExemptAddressLabel'),
    shippingMessage: getTextFromResource(getText, 'shippingMessage')
});

const functions = {
    setCheckoutSectionErrors: OrderActions.setCheckoutSectionErrors,
    clearNamedSectionErrors: OrderActions.clearNamedSectionErrors
};

const connectedShipAddress = connect(
    createSelector(textResources, texts => {
        return {
            ...texts,
            getText,
            saveAddress
        };
    }),
    functions
);

const withComponentProps = wrapHOC(connectedShipAddress);

export default withComponentProps(ShipAddressSection);
