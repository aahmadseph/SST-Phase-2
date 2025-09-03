import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import basketSelector from 'selectors/basket/basketSelector';
import Empty from 'constants/empty';
import skuUtils from 'utils/Sku';
import AddToBasketActions from 'actions/AddToBasketActions';

import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ProductSamplesModal/Minidrawer/locales', 'Minidrawer');

const withMinidrawerProps = connect(
    createSelector(
        basketSelector,
        createStructuredSelector({
            samplesInBasket: getTextFromResource(getText, 'samplesInBasket'),
            showMore: getTextFromResource(getText, 'showMore'),
            showLess: getTextFromResource(getText, 'showLess'),
            done: getTextFromResource(getText, 'done')
        }),
        (basket, textResources) => {
            const items = basket?.items || Empty.Array;
            const productSamples = skuUtils.getProductPageSamples(items);

            return {
                productSamples,
                localization: textResources
            };
        }
    ),
    {
        removeProductFromBasket: AddToBasketActions.removeProductFromBasket
    }
);

export { withMinidrawerProps };
