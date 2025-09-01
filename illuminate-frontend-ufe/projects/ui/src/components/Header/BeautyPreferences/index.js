import BeautyPreferences from 'components/Header/BeautyPreferences/BeautyPreferences';
import { withBeautyPreferencesProps } from 'viewModel/header/beautyPreferences/withBeautyPreferencesProps';

const ConnectedBeautyPreferences = withBeautyPreferencesProps(BeautyPreferences);

export default ConnectedBeautyPreferences;
