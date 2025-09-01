import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import Empty from 'constants/empty';

const limitedLoveListItemsSelector = createSelector(lovesSelector, loves => loves.limitedLoveListItems || Empty.Array);

export default { limitedLoveListItemsSelector };
