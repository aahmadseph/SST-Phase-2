/* eslint-disable no-console */
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector } from 'reselect';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import GallerySelector from 'selectors/gallery/gallerySelector';

const { wrapHOC } = FrameworkUtils;
const { gallerySelector } = GallerySelector;
const { toggleGalleryLightBox, showItemZoomModal } = CommunityGalleryActions;
const fields = createSelector(
    gallerySelector,
    (_state, ownProps) => ownProps,
    (gallery, ownProps) => {
        const { isGalleryCarousel } = ownProps;

        let activeGallery;

        if (isGalleryCarousel) {
            activeGallery = gallery.carouselGalleryData;
        } else {
            activeGallery = gallery.gridGalleryData;
        }

        return {
            activeGallery,
            activeIndex: gallery.activeGalleryItemIndex
        };
    }
);

const functions = {
    toggleGalleryLightBox,
    showItemZoomModal
};

const withGalleryLightBoxModalProps = wrapHOC(connect(fields, functions));

export {
    withGalleryLightBoxModalProps, fields, functions
};
