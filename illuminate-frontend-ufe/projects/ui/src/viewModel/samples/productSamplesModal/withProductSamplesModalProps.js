import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import Empty from 'constants/empty';
import skuUtils from 'utils/Sku';

const withProductSamplesModalProps = connect(
    createSelector(basketSelector, basket => {
        const items = basket?.items || Empty.Array;
        const productSamplesInBasket = skuUtils.getProductPageSamples(items);

        return {
            productSamplesInBasket
        };
    })
);

export { withProductSamplesModalProps };
