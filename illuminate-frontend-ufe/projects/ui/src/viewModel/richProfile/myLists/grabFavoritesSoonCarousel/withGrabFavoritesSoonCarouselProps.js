import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import LoveActions from 'actions/LoveActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyLists/GrabFavoritesSoonCarousel/locales', 'GrabFavoritesSoonCarousel');

const localization = createStructuredSelector({
    getTheseBeforeGone: getTextFromResource(getText, 'getTheseBeforeGone'),
    items: getTextFromResource(getText, 'items'),
    item: getTextFromResource(getText, 'item')
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

const withGrabFavoritesSoonCarouselProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withGrabFavoritesSoonCarouselProps
};
