import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import Empty from 'constants/empty';

const loveListNameSelector = createSelector(lovesSelector, loves => loves.loveListName || Empty.String);

export default { loveListNameSelector };
