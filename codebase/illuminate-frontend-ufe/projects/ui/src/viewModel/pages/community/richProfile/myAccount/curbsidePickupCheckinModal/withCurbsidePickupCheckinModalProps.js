import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import actions from 'Actions';
import { orderDetailsPickupStoreDetailsSelector } from 'selectors/order/orderDetails/pickup/storeDetails/orderDetailsPickupStoreDetailsSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createStructuredSelector({ storeDetails: orderDetailsPickupStoreDetailsSelector });

const functions = { showCurbsidePickupCheckinModal: actions.showCurbsidePickupCheckinModal };

const withCurbsidePickupCheckinModalProps = wrapHOC(connect(fields, functions));

export {
    withCurbsidePickupCheckinModalProps, fields, functions
};
