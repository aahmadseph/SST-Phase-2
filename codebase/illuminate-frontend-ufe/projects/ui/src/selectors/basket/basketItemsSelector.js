import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

const basketItemsSelector = createSelector(basketSelector, basket => basket.items);

export default basketItemsSelector;
