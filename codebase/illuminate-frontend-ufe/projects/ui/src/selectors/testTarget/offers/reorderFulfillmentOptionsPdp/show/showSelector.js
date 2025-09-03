import { createSelector } from 'reselect';
import { reorderFulfillmentOptionsPdpSelector } from 'selectors/testTarget/offers/reorderFulfillmentOptionsPdp/reorderFulfillmentOptionsPdpSelector';

const showSelector = createSelector(reorderFulfillmentOptionsPdpSelector, reorderFulfillmentOptionsPdp => !!reorderFulfillmentOptionsPdp.show);

export { showSelector };
