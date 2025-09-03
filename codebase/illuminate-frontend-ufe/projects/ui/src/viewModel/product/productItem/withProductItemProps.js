import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector, createStructuredSelector } from 'reselect';
import { testTargetOffersSelector } from 'selectors/testTarget/offers/testTargetOffersSelector';
import Actions from 'actions/Actions';
import localeUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = localeUtils;
const getText = getLocaleResourceFile('components/Product/ProductItem/locales', 'ProductItem');

const fields = createSelector(
    testTargetOffersSelector,
    createStructuredSelector({
        viewSimilarProductsText: getTextFromResource(getText, 'viewSimilarProductsText'),
        writeReviewText: getTextFromResource(getText, 'writeReviewText'),
        moreColor: getTextFromResource(getText, 'moreColor'),
        moreColors: getTextFromResource(getText, 'moreColors'),
        itemShip: getTextFromResource(getText, 'itemShip'),
        canada: getTextFromResource(getText, 'canada'),
        us: getTextFromResource(getText, 'us'),
        color: getTextFromResource(getText, 'color')
    }),
    (testTargetOffers, textResources) => {
        const toggleMwebQuickLookIsHidden = testTargetOffers.toggleMwebQuickLook?.result?.isHidden;
        const basketQuickLookModalShow = testTargetOffers.basketQuickLookModal?.show;
        const { canada, us, ...restTextResources } = textResources;
        const isCanada = localeUtils.isCanada();
        const country = isCanada ? canada : us;

        return {
            toggleMwebQuickLookIsHidden,
            basketQuickLookModalShow,
            country,
            ...restTextResources
        };
    }
);

const functions = {
    showSimilarProductsModal: Actions.showSimilarProductsModal
};

const withProductItemProps = wrapHOC(connect(fields, functions));

export {
    withProductItemProps, fields, functions
};
