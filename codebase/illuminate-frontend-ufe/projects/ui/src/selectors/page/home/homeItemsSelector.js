import { createSelector } from 'reselect';
import { homeSelector } from 'selectors/page/home/homeSelector';
import Empty from 'constants/empty';

const homeItemsSelector = createSelector(homeSelector, home => home.items || Empty.Array);

export { homeItemsSelector };
