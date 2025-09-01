import { createSelector } from 'reselect';
import ReadyStateSelector from 'selectors/testTarget/readyStateSelector';

const { readyStateSelector } = ReadyStateSelector;
const isTestTargetReadySelector = createSelector(readyStateSelector, readyState => readyState === 2);

export { isTestTargetReadySelector };
