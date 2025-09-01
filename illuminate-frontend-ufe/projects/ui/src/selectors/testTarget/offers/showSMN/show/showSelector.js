import { createSelector } from 'reselect';
import { showSMNSelectorTarget } from 'selectors/testTarget/offers/showSMN/showSMNSelector';

const showSMNSelector = createSelector(showSMNSelectorTarget, showSMN => !!showSMN.show);

export { showSMNSelector };
