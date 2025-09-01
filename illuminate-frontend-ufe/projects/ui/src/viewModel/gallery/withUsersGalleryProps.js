import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import pathSelector from 'selectors/historyLocation/pathSelector';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import GallerySelector from 'selectors/gallery/gallerySelector';

const { wrapHOC } = FrameworkUtils;
const { gallerySelector } = GallerySelector;
const { setGalleryGridItems } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/UsersGallery/locales', 'UsersGallery');

const gridGalleryDataSelector = createSelector(gallerySelector, galleryData => galleryData.gridGalleryData);

const fields = createStructuredSelector({
    locale: createStructuredSelector({
        gallery: getTextFromResource(getText, 'gallery'),
        title: getTextFromResource(getText, 'title'),
        titleCTA: getTextFromResource(getText, 'titleCTA'),
        photosVideos: getTextFromResource(getText, 'photosVideos'),
        gridTitle: getTextFromResource(getText, 'gridTitle'),
        gridTitleCTA: getTextFromResource(getText, 'gridTitleCTA'),
        myGalleryNoPhotosTitle: getTextFromResource(getText, 'myGalleryNoPhotosTitle'),
        myGalleryNoPhotosText: getTextFromResource(getText, 'myGalleryNoPhotosText'),
        publicUserGalleryNoPhotosText: getTextFromResource(getText, 'publicUserGalleryNoPhotosText'),
        myGalleryNoPhotosCTA: getTextFromResource(getText, 'myGalleryNoPhotosCTA'),
        publicUserGalleryNoPhotosCTA: getTextFromResource(getText, 'publicUserGalleryNoPhotosCTA'),
        uploadedGalleryCount: getTextFromResource(getText, 'uploadedGalleryCount')
    }),
    user: userSelector,
    path: pathSelector,
    galleryItems: gridGalleryDataSelector
});

const functions = {
    setGalleryGridItems
};
const withUsersGalleryProps = wrapHOC(connect(fields, functions));

export {
    withUsersGalleryProps, fields
};
