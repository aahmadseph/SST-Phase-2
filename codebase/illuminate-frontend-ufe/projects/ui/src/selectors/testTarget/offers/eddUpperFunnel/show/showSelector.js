import { createSelector } from 'reselect';
import { eddUpperFunnelSelector } from 'selectors/testTarget/offers/eddUpperFunnel/eddUpperFunnelSelector';

const showSelector = createSelector(eddUpperFunnelSelector, eddUpperFunnel => !!eddUpperFunnel.show);

export default { showSelector };
