import { createSelector } from 'reselect';
import { actionFlagsSelector } from 'selectors/page/product/currentSku/actionFlags/actionFlagsSelector';
import Empty from 'constants/empty';

const sameDayAvailabilityStatusSelector = createSelector(actionFlagsSelector, actionFlags => actionFlags.sameDayAvailabilityStatus || Empty.String);

export default { sameDayAvailabilityStatusSelector };
