import { createSelector } from 'reselect';
import { megaNavSelector } from 'selectors/page/headerFooterTemplate/data/megaNav/megaNavSelector';
import Empty from 'constants/empty';

const itemsSelector = createSelector(megaNavSelector, megaNav => megaNav.items || Empty.Array);

export { itemsSelector };
