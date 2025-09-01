import { createSelector } from 'reselect';
import { dataSelector } from 'selectors/page/headerFooterTemplate/data/dataSelector';
import Empty from 'constants/empty';

const bottomNavigationSelector = createSelector(dataSelector, data => data.bottomNavigation || Empty.Object);

export { bottomNavigationSelector };
