import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { userSelector } from 'selectors/user/userSelector';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';

const { wrapHOC } = FrameworkUtils;
const { setLovesOnItems, toggleGalleryLightBoxKebabModal } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Community/GalleryLightBoxData/locales', 'GalleryLightBoxData');

const fields = createStructuredSelector({
    localization: createStructuredSelector({
        viaSourceText: getTextFromResource(getText, 'via')
    }),
    user: userSelector
});

const functions = {
    setLovesOnItems,
    toggleGalleryLightBoxKebabModal
};

const withGalleryLightBoxDataProps = wrapHOC(connect(fields, functions));

export {
    withGalleryLightBoxDataProps, fields, functions
};
