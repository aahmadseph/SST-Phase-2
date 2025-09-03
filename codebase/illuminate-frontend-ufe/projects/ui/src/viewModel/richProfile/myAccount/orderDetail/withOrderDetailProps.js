import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { isSplitEDDEnabledSelector } from 'viewModel/selectors/checkout/isSplitEDDEnabled/isSplitEDDEnabledSelector';
import { orderSelector } from 'selectors/order/orderSelector';

const fields = createSelector(isSplitEDDEnabledSelector, orderSelector, (isSplitEDDEnabled, order) => {
    return {
        isSplitEDDEnabled,
        splitEDDExperienceDisplayed: order.splitEDDExperienceDisplayed
    };
});

const withOrderDetailProps = wrapHOC(connect(fields));

export {
    fields, withOrderDetailProps
};
