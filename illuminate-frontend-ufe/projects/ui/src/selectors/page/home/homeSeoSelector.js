import { createSelector } from 'reselect';
import { homeSelector } from 'selectors/page/home/homeSelector';
import Empty from 'constants/empty';

const homeSeoSelector = createSelector(homeSelector, home => home.seo || Empty.Object);

export { homeSeoSelector };
