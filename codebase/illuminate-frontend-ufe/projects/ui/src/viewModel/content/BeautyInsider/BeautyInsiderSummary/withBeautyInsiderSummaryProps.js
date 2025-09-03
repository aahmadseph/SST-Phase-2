import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import ProfileActions from 'actions/ProfileActions';
import { customerLimitSelector } from 'viewModel/selectors/profile/customerLimitSelector';

const { wrapHOC } = FrameworkUtils;
const fields = customerLimitSelector;

const functions = {
    fetchCustomerLimit: ProfileActions.fetchCustomerLimit
};

// Wrap the component with `fields` and `functions`
const withBeautyInsiderSummaryProps = wrapHOC(connect(fields, functions));

export {
    withBeautyInsiderSummaryProps, fields, functions
};
