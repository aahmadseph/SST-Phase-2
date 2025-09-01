import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const enhancedContentSelector = createSelector(pageSelector, page => page.enhancedContent || Empty.Object);

export default { enhancedContentSelector };
