import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

export default createSelector(basketSelector, basket => basket.error);
