const STORE_PICKUP_METHOD_ID = '0';

function isInStorePickup(pickupMethods = []) {
    return pickupMethods.find(({ pickupMethodId, isSelected }) => pickupMethodId === STORE_PICKUP_METHOD_ID && isSelected);
}

export default {
    isInStorePickup
};
