import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { orderSelector } from 'selectors/order/orderSelector';

const { wrapHOC } = FrameworkUtils;
const fields = createStructuredSelector({
    user: userSelector,
    order: orderSelector
});

const functions = null;

const withAccessPointModalProps = wrapHOC(connect(fields, functions));

export {
    withAccessPointModalProps, fields, functions
};
