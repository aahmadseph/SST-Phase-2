import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import GallerySelector from 'selectors/gallery/gallerySelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { gallerySelector } = GallerySelector;
const { setCarouselGallery } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/TrendingSection/locales', 'TrendingSection');

const fields = createSelector(
    createStructuredSelector({
        trending: getTextFromResource(getText, 'trending'),
        uploadPhotoOrVideo1: getTextFromResource(getText, 'uploadPhotoOrVideo1'),
        uploadPhotoOrVideo2: getTextFromResource(getText, 'uploadPhotoOrVideo2')
    }),
    gallerySelector,
    (localization, gallery) => {
        return {
            localization,
            galleryItems: gallery.carouselGalleryData
        };
    }
);

const functions = {
    setCarouselGallery
};

const withTrendingSectionProps = wrapHOC(connect(fields, functions));

export {
    withTrendingSectionProps, fields, functions
};
