import { createSelector } from 'reselect';
import historyLocationSelector from 'selectors/historyLocation/historyLocationSelector';

const pathSelector = createSelector(historyLocationSelector, historyLocation => historyLocation.path);

export default pathSelector;
