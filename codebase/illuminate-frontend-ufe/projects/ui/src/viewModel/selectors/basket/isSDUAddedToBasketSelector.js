import { createSelector } from 'reselect';
import Empty from 'constants/empty';

import basketSelector from 'selectors/basket/basketSelector';

const isSDUAddedToBasketSelector = createSelector(basketSelector, basket => {
    const SDUProduct = basket?.SDUProduct || Empty.Object;
    const isSDUAddedToBasket = !!SDUProduct.isSDUAddedToBasket;

    return isSDUAddedToBasket;
});

export { isSDUAddedToBasketSelector };
