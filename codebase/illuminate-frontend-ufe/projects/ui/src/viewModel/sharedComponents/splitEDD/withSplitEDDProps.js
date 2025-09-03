import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { isSplitEDDEnabledSelector } from 'viewModel/selectors/checkout/isSplitEDDEnabled/isSplitEDDEnabledSelector';

const fields = createStructuredSelector({
    isSplitEDDEnabled: isSplitEDDEnabledSelector
});

const withSplitEDDProps = wrapHOC(connect(fields));

export {
    fields, withSplitEDDProps
};
