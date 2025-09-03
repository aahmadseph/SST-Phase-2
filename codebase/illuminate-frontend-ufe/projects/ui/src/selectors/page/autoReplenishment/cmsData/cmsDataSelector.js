import { createSelector } from 'reselect';
import autoReplenishmentSelector from 'selectors/page/autoReplenishment/autoReplenishmentSelector';

const cmsDataSelector = createSelector(autoReplenishmentSelector, autoReplenishment => autoReplenishment.cmsData);

export default cmsDataSelector;
