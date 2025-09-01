import { createSelector } from 'reselect';
import autoReplenishmentSelector from 'selectors/page/autoReplenishment/autoReplenishmentSelector';
import Empty from 'constants/empty';

const creditCardsSelector = createSelector(autoReplenishmentSelector, autoReplenishment => autoReplenishment.creditCards || Empty.Array);

export default { creditCardsSelector };
