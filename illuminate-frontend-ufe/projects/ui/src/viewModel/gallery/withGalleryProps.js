import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import { createSelector } from 'reselect';
import { gallerySelector } from 'selectors/page/gallery/gallerySelector';

const { wrapHOC } = FrameworkUtils;
const { toggleGalleryLightBox } = CommunityGalleryActions;

const fields = createSelector(gallerySelector, gallery => {
    return {
        banner: gallery.banner?.contentZone?.items[0] ?? {}
    };
});

const functions = {
    toggleGalleryLightBox
};

const withGalleryProps = wrapHOC(connect(fields, functions));

export {
    withGalleryProps, fields, functions
};
