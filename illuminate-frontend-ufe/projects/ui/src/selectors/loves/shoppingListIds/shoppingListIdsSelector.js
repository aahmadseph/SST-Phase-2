import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';

const shoppingListIdsSelector = createSelector(lovesSelector, loves => loves.shoppingListIds);

export default { shoppingListIdsSelector };
