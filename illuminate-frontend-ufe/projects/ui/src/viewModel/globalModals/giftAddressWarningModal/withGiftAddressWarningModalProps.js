import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import Actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import stringUtils from 'utils/String';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showGiftAddressWarningModal } = Actions;
const { capitalize } = stringUtils;
const getText = getLocaleResourceFile('components/GlobalModals/GiftAddressWarningModal/locale', 'GiftAddressWarningModal');

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    buttonText: getTextFromResource(getText, 'buttonText'),
    cancelButtonText: getTextFromResource(getText, 'cancelButtonText'),
    warningMessage1: getTextFromResource(getText, 'warningMessage1'),
    warningMessage2: getTextFromResource(getText, 'warningMessage2', ['{0}']),
    both: getTextFromResource(getText, 'both'),
    warningMessage3: getTextFromResource(getText, 'warningMessage3'),
    warningMessage4: getTextFromResource(getText, 'warningMessage4')
});

const fields = createSelector(
    localization,
    (_, ownProps) => ownProps.recipientName,
    (textResources, recipientName) => {
        const warningMessage2 = textResources.warningMessage2.replace('{0}', capitalize(recipientName));

        return {
            localization: {
                ...textResources,
                warningMessage2
            }
        };
    }
);

const functions = dispatch => ({
    closeGiftAddressWarningModal: () => {
        const action = showGiftAddressWarningModal({ isOpen: false });

        return dispatch(action);
    }
});

const withGiftAddressWarningModalProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withGiftAddressWarningModalProps
};
