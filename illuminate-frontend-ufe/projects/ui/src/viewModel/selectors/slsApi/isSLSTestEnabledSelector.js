import { createSelector } from 'reselect';
import { slsServiceEnabledSelector } from 'selectors/testTarget/offers/slsServiceEnabled/slsServiceEnabledSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const isSLSTestEnabledSelector = createSelector(isTestTargetReadySelector, slsServiceEnabledSelector, (testReady, slsServiceEnabled) => {
    const isSLSServiceEnabled = testReady && slsServiceEnabled;

    return isSLSServiceEnabled;
});

export { isSLSTestEnabledSelector };
