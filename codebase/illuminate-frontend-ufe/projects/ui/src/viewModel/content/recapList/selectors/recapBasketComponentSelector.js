import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';

import Empty from 'constants/empty';

import basketUtils from 'utils/Basket';

const recapBasketComponentSelector = createSelector(basketSelector, ({ itemCount, items, pickupBasket, isInitialized }) => {
    let totalItems = Empty.Array;
    let uniqueSkus = Empty.Array;

    const totalItemCount = pickupBasket?.itemCount ? pickupBasket.itemCount + itemCount : itemCount;
    const hasBopisBasketOnlySamplesRewards = basketUtils.isOnlySamplesRewardsInBasket(false, true);
    const hasDCBasketOnlySamplesRewards = basketUtils.isOnlySamplesRewardsInBasket();
    const onlyRewardsOrSamples = hasBopisBasketOnlySamplesRewards && hasDCBasketOnlySamplesRewards;
    const shouldRenderCarouselBasket = !onlyRewardsOrSamples && totalItemCount > 0;

    if (shouldRenderCarouselBasket) {
        totalItems = !!pickupBasket?.items && pickupBasket.items.length > 0 ? items.concat(pickupBasket.items) : items;
        uniqueSkus = basketUtils.getOnlySellableSkus(totalItems);
    }

    return {
        shouldRenderCarouselBasket,
        totalItemCount,
        uniqueSkus,
        isInitialized
    };
});

export default recapBasketComponentSelector;
