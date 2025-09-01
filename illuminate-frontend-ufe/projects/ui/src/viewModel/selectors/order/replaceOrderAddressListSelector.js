import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import addressListSelector from 'selectors/order/addressListSelector';
import { createSelector } from 'reselect';
import orderUtils from 'utils/Order';

const replaceOrderAddressListSelector = createSelector(orderDetailsSelector, addressListSelector, (orderDetails, addressList) => {
    const sortedAddresses = addressList.slice();
    const hardGoodShippingGroup = orderUtils.getHardGoodShippingGroup(orderDetails);
    const originalOrderAddress = { ...hardGoodShippingGroup?.address, _deletedFromAddressBook: false };
    const orderAddressIdx = addressList.findIndex(address => address.addressId === originalOrderAddress?.addressId);

    if (orderAddressIdx !== -1) {
        sortedAddresses.splice(orderAddressIdx, 1);
    } else {
        // Original order shipping address was removed from Address Book.
        // In order to edit this address, we should treat it as a new address.
        originalOrderAddress._deletedFromAddressBook = true;
    }

    // Always show original order shipping address to the top
    sortedAddresses.unshift(originalOrderAddress);

    return sortedAddresses;
});

export { replaceOrderAddressListSelector };
