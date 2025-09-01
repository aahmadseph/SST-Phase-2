import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import ProductActions from 'actions/ProductActions';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import skuUtil from 'utils/Sku';
import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { fireProductViewableImpressionTracking } = ProductActions;
import { createStructuredSelector, createSelector } from 'reselect';
const { openRewardsBazaarModal } = RwdBasketActions;
import LanguageLocaleUtils from 'utils/LanguageLocale';
import itemLevelBasketErrors from 'selectors/basket/itemLevelBasketErrors';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Product/ProductCard/locales', 'ProductCard');

const localization = createStructuredSelector({
    free: getTextFromResource(getText, 'free'),
    value: getTextFromResource(getText, 'value'),
    onlyAFewLeft: getTextFromResource(getText, 'onlyAFewLeft'),
    size: getTextFromResource(getText, 'size'),
    color: getTextFromResource(getText, 'color'),
    type: getTextFromResource(getText, 'type'),
    scent: getTextFromResource(getText, 'scent')
});

const fields = createSelector(
    (_state, ownProps) => ownProps.sku || {},
    (_state, ownProps) => ownProps.showVariationTypeAndValue || false,
    localization,
    itemLevelBasketErrors,
    (sku, showVariationTypeAndValue, textResources, basketErrors) => {
        const variationType = sku.variationType
            ? skuUtil.isFragrance(sku)
                ? textResources.size || Empty.String
                : textResources[sku.variationType.toLowerCase()] || Empty.String
            : Empty.String;

        const variationString = sku.variationType && sku.variationValue ? `${variationType}: ${sku.variationValue}` : Empty.String;

        return {
            localization: textResources,
            itemLevelBasketErrors: basketErrors,
            variationString: showVariationTypeAndValue ? variationString : Empty.String
        };
    }
);

const functions = {
    fireProductViewableImpressionTracking,
    openRewardsBazaarModal
};

const withProductCardProps = wrapHOC(connect(fields, functions));

export {
    functions, withProductCardProps
};
