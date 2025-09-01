import createIRorNCR from 'services/api/selfReturn/createIRorNCR';
import updateAddress from 'services/api/selfReturn/updateAddress';
import shippingAddress from 'services/api/selfReturn/shippingAddress';
import confirmReturnOrder from 'services/api/selfReturn/confirmReturnOrder';
import addSamplesToReplacementOrder from 'services/api/selfReturn/addSamplesToReplacementOrder';
import deleteItemFromOrder from 'services/api/selfReturn/deleteItemFromOrder';

export default {
    confirmReturnOrder,
    createIRorNCR,
    updateAddress,
    shippingAddress,
    addSamplesToReplacementOrder,
    deleteItemFromOrder
};
