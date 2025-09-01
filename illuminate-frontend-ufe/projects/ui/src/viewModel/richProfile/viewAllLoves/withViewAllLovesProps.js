import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { isSLSTestEnabledSelector } from 'viewModel/selectors/slsApi/isSLSTestEnabledSelector';
import { lovesSelector } from 'selectors/loves/lovesSelector';

const { wrapHOC } = FrameworkUtils;

const fields = createSelector(isSLSTestEnabledSelector, lovesSelector, (isSLSTestEnabled, loves) => ({ isSLSTestEnabled, loves }));
const functions = {};
const withViewAllLovesProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withViewAllLovesProps
};
