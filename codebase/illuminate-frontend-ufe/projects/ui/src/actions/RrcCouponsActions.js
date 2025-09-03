import availableRrcCouponsReducer from 'reducers/availableRrcCoupons';
const { ACTION_TYPES: TYPES } = availableRrcCouponsReducer;

const updateRrcCoupons = data => ({
    type: TYPES.UPDATE_RRC_COUPONS,
    data: data
});

export default {
    TYPES,
    updateRrcCoupons
};
