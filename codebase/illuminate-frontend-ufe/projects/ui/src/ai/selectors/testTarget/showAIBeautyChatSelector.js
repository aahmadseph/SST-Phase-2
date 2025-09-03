import { createSelector } from 'reselect';
import { showSelector } from 'ai/selectors/testTarget/aiBeautyChat/show/showSelector';
import { isTestTargetReadySelector } from 'viewModel/selectors/testTarget/isTestTargetReadySelector';

const showAIBeautyChatSelector = createSelector(isTestTargetReadySelector, showSelector, (testReady, show) => testReady && show);

export { showAIBeautyChatSelector };
