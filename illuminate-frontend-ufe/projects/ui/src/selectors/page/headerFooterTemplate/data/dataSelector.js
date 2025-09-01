import { createSelector } from 'reselect';
import { headerFooterTemplateSelector } from 'selectors/page/headerFooterTemplate/headerFooterTemplateSelector';
import Empty from 'constants/empty';

const dataSelector = createSelector(headerFooterTemplateSelector, headerFooterTemplate => headerFooterTemplate.data || Empty.Object);

export { dataSelector };
