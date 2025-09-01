import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import ShipOptionsDisplay from 'components/RwdCheckout/Sections/ShipOptions/ShipOptionsDisplay/ShipOptionsDisplay';
import { orderSelector } from 'selectors/order/orderSelector';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(orderSelector, order => {
    return {
        order
    };
});

const functions = {
    showSignInModal: Actions.showSignInModal,
    showRegisterModal: Actions.showRegisterModal
};

const withShipOptionsDisplayProps = wrapHOC(connect(fields, functions));

export default withShipOptionsDisplayProps(ShipOptionsDisplay);
