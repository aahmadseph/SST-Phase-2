import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
/**
 *
 * @param {*} state
 * @returns
 *
 * This selector gets the `fromBazaar` field from the state which helps
 * determine if a child component's action is downstream from a Bazaar parent component.
 * i.e. adding an item to a basket specifically from the Bazaar modal on the Basket page
 */
const fromBazaarStateSelector = createSelector(basketSelector, basket => basket.fromBazaar || false);

export default fromBazaarStateSelector;
