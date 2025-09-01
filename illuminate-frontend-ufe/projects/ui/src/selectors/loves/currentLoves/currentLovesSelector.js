import { createSelector } from 'reselect';
import { lovesSelector } from 'selectors/loves/lovesSelector';
import Empty from 'constants/empty';

const currentLovesSelector = createSelector(lovesSelector, loves => loves.currentLoves || Empty.Array);

export default { currentLovesSelector };
