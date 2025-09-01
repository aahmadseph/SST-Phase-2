import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LoveActions from 'actions/LoveActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyLists/FavouriteProductCard/locales', 'FavouriteProductCard');

const localization = createStructuredSelector({
    onlyAFewLeft: getTextFromResource(getText, 'onlyAFewLeft')
});

const fields = createSelector(localization, textResources => {
    return {
        localization: {
            ...textResources
        }
    };
});

const functions = dispatch => ({
    getLimitedLoveListItems: (callback, refreshCache) => {
        const action = LoveActions.getLimitedLoveListItems({ callback, force: refreshCache });
        dispatch(action);
    }
});

const withFavouriteProductCardProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withFavouriteProductCardProps
};
