import { createSelector } from 'reselect';
import { sephoraMLSelector } from 'selectors/sephoraML/sephoraMLSelector';

const bestSellersMLSelector = createSelector(sephoraMLSelector, sephoraML => sephoraML.bestSellers);

export { bestSellersMLSelector };
