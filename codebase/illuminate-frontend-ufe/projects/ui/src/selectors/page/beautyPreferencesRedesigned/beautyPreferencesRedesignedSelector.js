import { createSelector } from 'reselect';
import { pageSelector } from 'selectors/page/pageSelector';
import Empty from 'constants/empty';

const beautyPreferencesRedesignedSelector = createSelector(pageSelector, page => page.beautyPreferencesRedesigned || Empty.Object);

export default { beautyPreferencesRedesignedSelector };
