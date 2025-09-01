import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import ShipAddressForm from 'components/RwdCheckout/Sections/ShipAddress/ShipAddressForm/ShipAddressForm';
import checkoutApi from 'services/api/checkout';
import selfReturnApi from 'services/api/selfReturn';
import OrderActions from 'actions/OrderActions';
import ReplacementOrderActions from 'actions/ReplacementOrderActions';
import updatePreferredZipCode from 'services/api/profile/updatePreferredZipCode';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/ShipAddress/locales', 'ShipAddress');

const localization = createStructuredSelector({
    setAsDefaultCheckbox: getTextFromResource(getText, 'setAsDefaultCheckbox'),
    editShipAddress: getTextFromResource(getText, 'editShipAddress'),
    addNewShipAddress: getTextFromResource(getText, 'addNewShipAddress'),
    cancelButton: getTextFromResource(getText, 'cancelButton'),
    saveContinueButton: getTextFromResource(getText, 'saveContinueButton')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    togglePlaceOrderDisabled: OrderActions.togglePlaceOrderDisabled,
    showScheduledDeliveryUnavailable: OrderActions.showScheduledDeliveryUnavailable,
    sectionSaved: OrderActions.sectionSaved,
    validateAddress: OrderActions.validateAddress,
    setLastUsedShippingAddressId: OrderActions.setLastUsedShippingAddressId,
    showSessionExpiredModal: ReplacementOrderActions.showSessionExpiredModal
};

const connectedShipAddress = connect(
    createSelector(fields, texts => {
        return {
            ...texts,
            updateShippingAddress: checkoutApi.updateShippingAddress,
            createShippingAddress: checkoutApi.createShippingAddress,
            updateAddress: selfReturnApi.updateAddress,
            shippingAddress: selfReturnApi.shippingAddress,
            updatePreferredZipCode,
            addOrUpdateAddress: (data, method) => {
                return decorators.withInterstice(method, INTERSTICE_DELAY_MS)(data);
            }
        };
    }),
    functions
);

const withComponentProps = wrapHOC(connectedShipAddress);

export default withComponentProps(ShipAddressForm);
