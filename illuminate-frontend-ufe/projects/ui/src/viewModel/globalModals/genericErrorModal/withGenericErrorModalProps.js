import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import Actions from 'actions/Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/GenericErrorModal/locales', 'GenericErrorModal');

const { wrapHOC } = FrameworkUtils;

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    header: getTextFromResource(getText, 'header'),
    content: getTextFromResource(getText, 'content'),
    cta: getTextFromResource(getText, 'cta')
});

const fields = createSelector(localization, textResources => {
    return {
        localization: textResources
    };
});

const functions = {
    requestClose: () => Actions.showGenericErrorModal({ isOpen: false })
};

const withGenericErrorModalProps = wrapHOC(connect(fields, functions));

export {
    withGenericErrorModalProps, fields, functions
};
