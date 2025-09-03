import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

const basketItemCountSelector = createSelector(basketSelector, basket => basket.itemCount);

export default basketItemCountSelector;
