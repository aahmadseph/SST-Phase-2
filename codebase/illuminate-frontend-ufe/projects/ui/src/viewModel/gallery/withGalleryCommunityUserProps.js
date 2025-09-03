import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';

const { wrapHOC } = FrameworkUtils;
const { toggleGalleryLightBox } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Community/GalleryLightBoxData/locales', 'GalleryLightBoxData');

const fields = createSelector(
    createStructuredSelector({
        viaSourceText: getTextFromResource(getText, 'via')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = { toggleGalleryLightBox };

const withGalleryCommunityUserProps = wrapHOC(connect(fields, functions));

export {
    withGalleryCommunityUserProps, fields, functions
};
