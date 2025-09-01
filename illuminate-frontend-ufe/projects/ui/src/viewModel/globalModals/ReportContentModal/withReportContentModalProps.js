import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import CommunityGalleryActions from 'actions/CommunityGalleryActions';

const { wrapHOC } = FrameworkUtils;
const { toggleReportContentModal } = CommunityGalleryActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/ReportContentModal/locales', 'ReportContentModal');

const fields = createSelector(
    createStructuredSelector({
        reportTitle: getTextFromResource(getText, 'reportTitle'),
        subTitle1: getTextFromResource(getText, 'subTitle1'),
        subTitle2: getTextFromResource(getText, 'subTitle2'),
        copied: getTextFromResource(getText, 'copied'),
        copy: getTextFromResource(getText, 'copy')
    }),
    localization => {
        return {
            localization
        };
    }
);

const functions = {
    toggleReportContentModal
};

const withReportContentModalProps = wrapHOC(connect(fields, functions));

export {
    withReportContentModalProps, fields, functions
};
