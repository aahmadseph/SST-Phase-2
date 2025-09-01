import { createSelector } from 'reselect';
import historyLocationSelector from 'selectors/historyLocation/historyLocationSelector';

const queryParamsSelector = createSelector(historyLocationSelector, historyLocation => historyLocation.queryParams);

export default queryParamsSelector;
