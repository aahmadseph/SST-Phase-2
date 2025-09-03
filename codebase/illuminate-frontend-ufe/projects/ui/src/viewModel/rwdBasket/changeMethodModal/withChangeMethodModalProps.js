import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import RewardFulfillmentMethodModalBindings from 'analytics/bindingMethods/components/globalModals/rewardFulfillmentMethodModal/RewardFulfillmentMethodModalBindings';

const functions = {
    pageLoadAnalytics: RewardFulfillmentMethodModalBindings.pageLoad
};

const withChangeMethodModalProps = wrapHOC(connect(null, functions));

export {
    functions, withChangeMethodModalProps
};
