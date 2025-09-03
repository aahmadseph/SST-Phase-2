import { createSelector } from 'reselect';
import { showSplitEDDAbTestSelector } from 'viewModel/selectors/testTarget/showSplitEDDAbTestSelector';

const isSplitEDDEnabledSelector = createSelector(showSplitEDDAbTestSelector, showSplitEDDAbTest => {
    const globalKillswitch = !!Sephora.configurationSettings?.splitEDDConfiguration?.isSplitEDDEnabled;
    const isSplitEDDEnabled = globalKillswitch && showSplitEDDAbTest;

    return isSplitEDDEnabled;
});

export { isSplitEDDEnabledSelector };
