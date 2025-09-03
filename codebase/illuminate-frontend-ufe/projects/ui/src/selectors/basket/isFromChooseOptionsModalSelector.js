import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

const fromChooseOptionsModalSelector = createSelector(basketSelector, basket => basket.fromChooseOptionsModal || false);

export default fromChooseOptionsModalSelector;
