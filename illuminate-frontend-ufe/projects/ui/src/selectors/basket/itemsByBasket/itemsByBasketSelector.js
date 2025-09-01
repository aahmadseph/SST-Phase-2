import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import Empty from 'constants/empty';

const itemsByBasketSelector = createSelector(basketSelector, basket => basket.itemsByBasket || Empty.Array);

export default itemsByBasketSelector;
