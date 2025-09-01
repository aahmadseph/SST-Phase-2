import PreviewScreen from 'components/GlobalModals/AddGiftMessageModal/PreviewScreen/PreviewScreen';
import { withAddGiftMessageModalProps } from 'viewModel/globalModals/addGiftMessageModal/withAddGiftMessageModalProps';

const ConnectedPreviewScreen = withAddGiftMessageModalProps(PreviewScreen);

export default ConnectedPreviewScreen;
