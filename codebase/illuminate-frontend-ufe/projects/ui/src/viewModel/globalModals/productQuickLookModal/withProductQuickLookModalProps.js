import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';
import { createStructuredSelector, createSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { toggleGalleryLightBox } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/QuickLookModal/ProductQuickLookModal/locales', 'ProductQuickLookModal');

const fields = createSelector(
    createStructuredSelector({
        seeFullDetails: getTextFromResource(getText, 'seeFullDetails')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = {
    toggleGalleryLightBox
};

const withProductQuickLookModalProps = wrapHOC(connect(fields, functions));

export {
    withProductQuickLookModalProps, fields, functions
};
