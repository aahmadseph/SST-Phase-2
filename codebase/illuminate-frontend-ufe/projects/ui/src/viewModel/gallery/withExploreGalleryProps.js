import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import Actions from 'Actions';
import GallerySelector from 'selectors/gallery/gallerySelector';

const { wrapHOC } = FrameworkUtils;
const { gallerySelector } = GallerySelector;
const { setGalleryGridItems } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/ExploreGallery/locales', 'ExploreGallery');
const exploreGalleryDataSelector = createSelector(gallerySelector, galleryData => galleryData.gridGalleryData);

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        searchTitle: getTextFromResource(getText, 'searchTitle'),
        explore: getTextFromResource(getText, 'explore'),
        uploadToGallery: getTextFromResource(getText, 'uploadToGallery'),
        cancel: getTextFromResource(getText, 'cancel'),
        resultsFor: getTextFromResource(getText, 'resultsFor'),
        clearAll: getTextFromResource(getText, 'clearAll')
    }),
    galleryItems: exploreGalleryDataSelector
});

const functions = {
    setGalleryGridItems,
    showSignInModal: Actions.showSignInModal
};

const withExploreGalleryProps = wrapHOC(connect(fields, functions));

export {
    withExploreGalleryProps, fields, functions
};
