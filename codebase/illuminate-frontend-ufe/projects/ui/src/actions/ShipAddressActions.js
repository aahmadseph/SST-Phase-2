import store from 'Store';
import decorators from 'utils/decorators';
import checkoutApi from 'services/api/checkout';
import userUtils from 'utils/User';
import OrderActions from 'actions/OrderActions';
import UtilActions from 'utils/redux/Actions';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

export default {
    getAddressBook: function (isReshipOrder = false) {
        const profileId = userUtils.getProfileId();
        const shipCountry = userUtils.getShippingCountry().countryCode;

        return decorators
            .withInterstice(checkoutApi.getAddressBook, INTERSTICE_DELAY_MS)(profileId, shipCountry, isReshipOrder)
            .then(data => {
                store.dispatch(UtilActions.merge('order', 'addressList', data.addressList));

                return data;
            });
    },

    updateShippingAddress: function (addressData) {
        return decorators.withInterstice(checkoutApi.updateShippingAddress, INTERSTICE_DELAY_MS)(addressData);
    },

    getOrderDetails: function (orderId) {
        return decorators
            .withInterstice(
                checkoutApi.getOrderDetails,
                INTERSTICE_DELAY_MS
            )(orderId)
            .then(newOrderDetails => {
                store.dispatch(OrderActions.updateOrder(newOrderDetails));
            });
    },

    removeOrderShippingAddress: function (orderId, shippingGroupId, addressId) {
        return decorators.withInterstice(checkoutApi.removeOrderShippingAddress, INTERSTICE_DELAY_MS)(orderId, shippingGroupId, addressId);
    }
};
