import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import testTargetSelector from 'selectors/testTarget/testTargetSelector';

const showForcedSignInTooltipSelector = createSelector(testTargetSelector, testTarget => testTarget.showForcedSignInTooltip || Empty.String);

export default { showForcedSignInTooltipSelector };
