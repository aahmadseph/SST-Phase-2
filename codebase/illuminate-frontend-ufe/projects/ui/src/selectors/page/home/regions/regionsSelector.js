import { createSelector } from 'reselect';
import { homeSelector } from 'selectors/page/home/homeSelector';
import Empty from 'constants/empty';

const regionsSelector = createSelector(homeSelector, home => home.regions || Empty.Object);

export default { regionsSelector };
