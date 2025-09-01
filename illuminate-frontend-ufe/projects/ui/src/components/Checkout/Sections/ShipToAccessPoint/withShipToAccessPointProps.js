import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { userSelector } from 'selectors/user/userSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import OrderActions from 'actions/OrderActions';
import AddressActions from 'actions/AddressActions';

const withShipToAccessPointProps = connect(
    createStructuredSelector({
        user: userSelector,
        order: orderSelector
    }),
    {
        sectionSaved: OrderActions.sectionSaved,
        updateCurrentHalAddress: OrderActions.updateCurrentHalAddress,
        getStateList: AddressActions.getStateList
    }
);

export default withShipToAccessPointProps;
