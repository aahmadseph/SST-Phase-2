import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import GallerySelector from 'selectors/gallery/gallerySelector';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';

const { wrapHOC } = FrameworkUtils;
const { gallerySelector } = GallerySelector;
const { setCarouselGallery } = CommunityGalleryActions;
const fields = createSelector(gallerySelector, gallery => {
    return {
        galleryItems: gallery.carouselGalleryData
    };
});

const functions = {
    setCarouselGallery
};

const withGalleryCardCarouselProps = wrapHOC(connect(fields, functions));

export {
    withGalleryCardCarouselProps, fields, functions
};
