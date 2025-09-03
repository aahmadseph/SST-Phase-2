import { createSelector } from 'reselect';
import { currentSkuSelector } from 'selectors/page/product/currentSku/currentSkuSelector';
import Empty from 'constants/empty';

const sameDayDeliveryMessageSelector = createSelector(currentSkuSelector, currentSku => currentSku.sameDayDeliveryMessage || Empty.String);

export default { sameDayDeliveryMessageSelector };
