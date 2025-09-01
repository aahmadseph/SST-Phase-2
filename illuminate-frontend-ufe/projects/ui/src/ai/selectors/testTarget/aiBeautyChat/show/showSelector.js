import { createSelector } from 'reselect';
import { aiBeautyChatSelector } from 'ai/selectors/testTarget/aiBeautyChat/aiBeautyChatSelector';

const showSelector = createSelector(aiBeautyChatSelector, aiBeautyChat => !!aiBeautyChat.show);

export { showSelector };
