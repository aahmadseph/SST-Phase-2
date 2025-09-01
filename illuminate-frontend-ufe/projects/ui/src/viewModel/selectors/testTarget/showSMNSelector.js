import { createSelector } from 'reselect';
import { showSMNSelectorTarget } from 'selectors/testTarget/offers/showSMN/showSMNSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const isShowSMNEnabledSelector = createSelector(isTestTargetReadySelector, showSMNSelectorTarget, (testReady, showSMNEnabled) => {
    if (testReady && showSMNEnabled.show === undefined) {
        return true;
    }

    return Boolean(testReady && showSMNEnabled.show);
});

export { isShowSMNEnabledSelector };
