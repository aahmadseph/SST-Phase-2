import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import checkoutApi from 'services/api/checkout';
import ErrorsUtils from 'utils/Errors';
import UtilActions from 'utils/redux/Actions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import locationUtils from 'utils/Location';
import orderUtils from 'utils/Order';
import profileApi from 'services/api/profile';

let isShippingRequestInProgress = false;
let getShippingMethodPromise = false;
const getShippingMethods = (orderId, shippingGroupId) => {
    if (!isShippingRequestInProgress) {
        isShippingRequestInProgress = true;
        getShippingMethodPromise = checkoutApi
            .getAvailableShippingMethods(orderId, shippingGroupId)
            .then(shippingData => {
                store.dispatch(OrderActions.updateShippingMethods(shippingData.shippingMethods, shippingGroupId));
                isShippingRequestInProgress = false;
            })
            .catch(errorData => {
                ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
                isShippingRequestInProgress = false;
            });
    }

    return getShippingMethodPromise;
};

const getAddressList = (profileId, shipCountry) => {
    return checkoutApi
        .getAddressBook(profileId, shipCountry)
        .then(addressBook => {
            store.dispatch(UtilActions.merge('order', 'addressList', addressBook.addressList));
            store.dispatch(OrderActions.updateAddressListWithHalAddress());
        })
        .catch(errorData => {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
        });
};

const getOrderPayments = orderId => {
    return checkoutApi
        .getCreditCards(orderId)
        .then(payments => {
            store.dispatch(UtilActions.merge('order', 'paymentOptions', payments));
        })
        .catch(errorData => {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, this);
        });
};

const getCapElibility = comp => {
    profileApi
        .getCapEligibility()
        .then(response => {
            store.dispatch(UtilActions.merge('order', 'isCAPAvailable', response.isCAPAvailable));
        })
        .catch(errorData => {
            ErrorsUtils.collectAndValidateBackEndErrors(errorData, comp);
        });
};

const refreshCheckout = ({ isUpdateOrder = true } = {}) => {
    let getOrderDetails;
    let updateShippingMethods = false;

    if (isUpdateOrder) {
        getOrderDetails = () => {
            return decorators
                .withInterstice(
                    checkoutApi.getOrderDetails,
                    INTERSTICE_DELAY_MS
                )(orderUtils.getOrderId())
                .then(newOrderDetails => {
                    const isZeroCheckout = orderUtils.isZeroCheckout();
                    const isSDUOnlyOrder = orderUtils.isSDUOnlyOrder(newOrderDetails);
                    const hasRRC = orderUtils.hasRRC(newOrderDetails);
                    const { isBopisOrder } = newOrderDetails.header;

                    //UC-388 We do not have to update Shipping methods if the order belongs to any of these cases.
                    if ((!isZeroCheckout || (isZeroCheckout && hasRRC)) && !isBopisOrder) {
                        updateShippingMethods = true;
                    }

                    if (updateShippingMethods) {
                        const shippingGroupEntries = newOrderDetails.shippingGroups.shippingGroupsEntries;
                        let shippingGroup;

                        if (locationUtils.isCheckoutGiftCardShipping()) {
                            const physicalGiftCardShippingGroup = orderUtils.getPhysicalGiftCardShippingGroup(newOrderDetails);
                            shippingGroup = physicalGiftCardShippingGroup ?? shippingGroupEntries[0].shippingGroup;
                        } else {
                            shippingGroup = shippingGroupEntries[0].shippingGroup;
                        }

                        if (!isSDUOnlyOrder) {
                            getShippingMethods(newOrderDetails.header.orderId, shippingGroup.shippingGroupId);
                        }
                    }

                    store.dispatch(OrderActions.updateOrder(newOrderDetails));
                });
        };
    } else {
        getOrderDetails = () => Promise.resolve();
    }

    return getOrderDetails;
};

export {
    refreshCheckout, getAddressList, getOrderPayments, getCapElibility, getShippingMethods
};
