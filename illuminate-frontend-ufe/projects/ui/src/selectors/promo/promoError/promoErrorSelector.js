import { createSelector } from 'reselect';
import promoSelector from 'selectors/promo/promoSelector';

export default createSelector(promoSelector, promo => promo.promoError);
