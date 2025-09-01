import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import ShipOptionsForm from 'components/RwdCheckout/Sections/ShipOptions/ShipOptionsForm/ShipOptionsForm';
import confirmModal from 'Actions';
import OrderActions from 'actions/OrderActions';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import { withSplitEDDProps } from 'viewModel/sharedComponents/splitEDD/withSplitEDDProps';
const { wrapHOC } = FrameworkUtils;

const fields = createSelector(orderDetailsSelector, orderDetails => {
    return {
        orderDetails
    };
});

const functions = {
    sectionSaved: OrderActions.sectionSaved,
    updateWaiveShipping: OrderActions.updateWaiveShipping,
    confirmModal
};

const withShipOptionsForm = wrapHOC(connect(fields, functions));

export default withShipOptionsForm(withSplitEDDProps(ShipOptionsForm));
