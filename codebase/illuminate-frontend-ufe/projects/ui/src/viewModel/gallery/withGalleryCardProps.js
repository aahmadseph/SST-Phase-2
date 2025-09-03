import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';

const { wrapHOC } = FrameworkUtils;
const { toggleGalleryLightBox, setActiveGalleryItemIndex, setLovesOnItems } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/GalleryCard/locales', 'GalleryCard');

const fields = createSelector(
    createStructuredSelector({
        playVideo: getTextFromResource(getText, 'playVideo'),
        love: getTextFromResource(getText, 'love'),
        unlove: getTextFromResource(getText, 'unlove'),
        loves: getTextFromResource(getText, 'loves')
    }),
    userSelector,
    (localization, user) => {
        return {
            localization,
            userLogin: user.login
        };
    }
);

const functions = {
    toggleGalleryLightBox,
    setActiveGalleryItemIndex,
    setLovesOnItems
};

const withGalleryCardProps = wrapHOC(connect(fields, functions));

export {
    withGalleryCardProps, fields, functions
};
