import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

import CommunityGalleryActions from 'actions/CommunityGalleryActions';

const { wrapHOC } = FrameworkUtils;
const {
    toggleGalleryLightBoxKebabModal, shareLink, toggleReportContentModal, deleteContentModal, deleteContentModalConfirmation, trackDeletion
} =
    CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/GalleryLightBoxKebabModal/locales', 'GalleryLightBoxKebabModal');

const fields = createSelector(
    createStructuredSelector({
        shareOrDelete: getTextFromResource(getText, 'shareOrDelete'),
        share: getTextFromResource(getText, 'share'),
        removePhoto: getTextFromResource(getText, 'delete'),
        shareOrReport: getTextFromResource(getText, 'shareOrReport'),
        report: getTextFromResource(getText, 'report'),
        shareSubTitle: getTextFromResource(getText, 'shareSubTitle'),
        cancel: getTextFromResource(getText, 'cancel'),
        deleteTitle: getTextFromResource(getText, 'deleteTitle'),
        deleteSubTitle: getTextFromResource(getText, 'deleteSubTitle'),
        deleteConfirmation: getTextFromResource(getText, 'deleteConfirmation'),
        done: getTextFromResource(getText, 'done')
    }),
    userSelector,
    (localization, user) => {
        return {
            localization,
            user
        };
    }
);

const functions = {
    toggleGalleryLightBoxKebabModal,
    shareLink,
    toggleReportContentModal,
    deleteContentModal,
    deleteContentModalConfirmation,
    trackDeletion
};

const withGalleryLightBoxKebabModalProps = wrapHOC(connect(fields, functions));

export {
    withGalleryLightBoxKebabModalProps, fields, functions
};
