import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import superChatActions from 'ai/actions/superChatActions';
import ShoppingListIdsSelector from 'selectors/loves/shoppingListIds/shoppingListIdsSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { shoppingListIdsSelector } = ShoppingListIdsSelector;
const getText = getLocaleResourceFile('ai/components/SuperChat/locales', 'SuperChat');

const localization = createStructuredSelector({
    new: getTextFromResource(getText, 'new'),
    size: getTextFromResource(getText, 'size'),
    addToBasket: getTextFromResource(getText, 'addToBasket')
});

const functions = {
    addToBasket: superChatActions.addToBasket,
    addToLovesList: superChatActions.addToLovesList
};

const fields = createSelector(localization, shoppingListIdsSelector, (locales, shoppingListIds) => {
    return {
        localization: locales,
        shoppingListIds
    };
});

const withProductRecommendationProps = wrapHOC(connect(fields, functions));

export {
    withProductRecommendationProps, fields, functions
};
