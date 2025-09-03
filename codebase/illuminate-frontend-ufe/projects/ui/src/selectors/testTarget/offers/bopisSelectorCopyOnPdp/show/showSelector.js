import { createSelector } from 'reselect';
import { bopisSelectorCopyOnPdpSelector } from 'selectors/testTarget/offers/bopisSelectorCopyOnPdp/bopisSelectorCopyOnPdpSelector';

const showSelector = createSelector(bopisSelectorCopyOnPdpSelector, bopisSelectorCopyOnPdp => !!bopisSelectorCopyOnPdp.show);

export default { showSelector };
