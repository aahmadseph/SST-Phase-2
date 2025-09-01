import GalleryLightBoxModal from 'components/GlobalModals/GalleryLightBoxModal/GalleryLightBoxModal';
import { withGalleryLightBoxModalProps } from 'viewModel/globalModals/GalleryLightBoxModal/withGalleryLightBoxModalProps';

const ConnectedGalleryLightBoxModal = withGalleryLightBoxModalProps(GalleryLightBoxModal);

export default ConnectedGalleryLightBoxModal;
