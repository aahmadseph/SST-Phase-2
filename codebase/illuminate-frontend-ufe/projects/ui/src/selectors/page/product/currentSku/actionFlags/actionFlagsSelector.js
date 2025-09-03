import { createSelector } from 'reselect';
import { currentSkuSelector } from 'selectors/page/product/currentSku/currentSkuSelector';
import Empty from 'constants/empty';

const actionFlagsSelector = createSelector(currentSkuSelector, currentSku => currentSku.actionFlags || Empty.Object);

export { actionFlagsSelector };
