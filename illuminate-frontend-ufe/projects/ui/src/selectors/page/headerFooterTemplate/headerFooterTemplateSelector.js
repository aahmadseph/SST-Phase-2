import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const headerFooterTemplateSelector = createSelector(pageSelector, page => page.headerFooterTemplate || Empty.Object);

export { headerFooterTemplateSelector };
