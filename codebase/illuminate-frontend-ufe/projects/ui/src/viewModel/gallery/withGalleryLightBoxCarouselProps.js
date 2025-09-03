import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import CommunityGalleryBindings from 'analytics/bindingMethods/pages/community/CommunityGalleryBindings';

const { wrapHOC } = FrameworkUtils;
const { setActiveGalleryItemIndex, showItemZoomModal } = CommunityGalleryActions;
const fields = null;
const functions = {
    setActiveGalleryItemIndex,
    showItemZoomModal,
    ugcNext: CommunityGalleryBindings.ugcNext
};

const withGalleryLightBoxCarouselProps = wrapHOC(connect(fields, functions));

export {
    withGalleryLightBoxCarouselProps, fields, functions
};
