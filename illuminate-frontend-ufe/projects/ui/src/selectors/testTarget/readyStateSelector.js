import Empty from 'constants/empty';
import { createSelector } from 'reselect';
import testTargetSelector from 'selectors/testTarget/testTargetSelector';

const readyStateSelector = createSelector(testTargetSelector, testTarget => testTarget.readyState || Empty.String);

export default { readyStateSelector };
