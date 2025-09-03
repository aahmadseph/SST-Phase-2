import PreferencesModal from 'components/Header/BeautyPreferences/PreferencesModal/PreferencesModal';
import { withPreferencesModalProps } from 'viewModel/header/beautyPreferences/preferencesModal/withPreferencesModalProps';

const ConnectedPreferencesModal = withPreferencesModalProps(PreferencesModal);

export default ConnectedPreferencesModal;
