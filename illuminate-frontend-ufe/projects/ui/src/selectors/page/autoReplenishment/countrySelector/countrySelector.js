import { createSelector } from 'reselect';
import autoReplenishmentSelector from 'selectors/page/autoReplenishment/autoReplenishmentSelector';
import Empty from 'constants/empty';

const countrySelector = createSelector(autoReplenishmentSelector, autoReplenishment => autoReplenishment.countries || Empty.Array);

export default countrySelector;
