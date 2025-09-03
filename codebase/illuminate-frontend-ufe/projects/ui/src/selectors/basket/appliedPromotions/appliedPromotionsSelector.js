import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

const appliedPromotionsSelector = createSelector(basketSelector, basket => basket.appliedPromotions);

export default appliedPromotionsSelector;
