import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import auth from 'Authentication';
import Actions from 'actions/Actions';
import BeautyPreferencesActions from 'actions/BeautyPreferencesActions';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import profileIdSelector from 'selectors/user/profileIdSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import userUtils from 'utils/User';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';
import urlUtils from 'utils/Url';

const { wrapHOC } = FrameworkUtils;
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { openRegisterBIModal, updateBeautyPreferences } = BeautyPreferencesActions;
const { getTextFromResource, getLocaleResourceFile, isFrench } = LanguageLocaleUtils;
const { showInterstice, showInfoModal } = Actions;
const getText = getLocaleResourceFile('components/ShadeFinder/ResultsScreen/CapturedColorIQBox/locales', 'CapturedColorIQBox');

const localization = createStructuredSelector({
    saveYourBeauryPrefs: getTextFromResource(getText, 'saveYourBeauryPrefs'),
    joinToSave: getTextFromResource(getText, 'joinToSave'),
    signInToSave: getTextFromResource(getText, 'signInToSave'),
    save: getTextFromResource(getText, 'save'),
    tooltipModalTitle: getTextFromResource(getText, 'tooltipModalTitle'),
    tooltipModalMessage: getTextFromResource(getText, 'tooltipModalMessage'),
    infoModalButton: getTextFromResource(getText, 'infoModalButton'),
    savedPrefsModalTitle: getTextFromResource(getText, 'savedPrefsModalTitle'),
    savedPrefsModalMessage: getTextFromResource(getText, 'savedPrefsModalMessage'),
    savedPrefsModalCancelButton: getTextFromResource(getText, 'savedPrefsModalCancelButton'),
    errorSavingModalTitle: getTextFromResource(getText, 'errorSavingModalTitle'),
    errorSavingModalMessage: getTextFromResource(getText, 'errorSavingModalMessage'),
    errorSavingModalButton: getTextFromResource(getText, 'errorSavingModalButton')
});

const fields = createSelector(localization, profileIdSelector, beautyPreferencesSelector, (textRecources, userProfileId, { beautyPreferences }) => {
    const { joinToSave, signInToSave, save, ...restOfTextResources } = textRecources;
    const isUserSignedIn = !!userProfileId;
    const isBIUser = userUtils.isBI();
    const saveButtonText = isUserSignedIn ? (isBIUser ? save : joinToSave) : signInToSave;

    const storage = Storage.local.getItem(LOCAL_STORAGE.CAPTURED_COLOR_IQ_PREF, false, false, true);
    const capturedColorIQPref = storage?.data;

    const isSignedIn = isUserSignedIn && isBIUser;
    const isNonBIUser = isUserSignedIn && !isBIUser;
    const isGuest = !isSignedIn;

    const isCaFrench = isFrench();

    const newProps = {
        beautyPreferences,
        userProfileId,
        capturedColorIQPref,
        isSignedIn,
        isNonBIUser,
        isGuest,
        isCaFrench,
        localization: { saveButtonText, ...restOfTextResources }
    };

    return newProps;
});

const commonModalOptions = {
    isOpen: true,
    footerDisplay: 'flex',
    footerJustifyContent: 'flex-end',
    footerGridGap: 4,
    bodyFooterPaddingX: 4,
    showCancelButtonLeft: true
};

const functions = {
    openRegisterBIModal,
    showInterstice,
    updateBeautyPreferences,
    fireAnalytics: () => {
        const { MY_SEPHORA } = anaConsts.PAGE_NAMES;
        const spokeText = 'ciq spoke';
        const savedText = 'beauty preference saved';
        const data = {
            pageName: `${MY_SEPHORA}:${spokeText}:${savedText}:*`,
            pageType: MY_SEPHORA,
            pageDetail: `${spokeText}`,
            world: `${savedText}`
        };

        return processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data });
    },
    openSignInModal: (successCallback = () => null) => {
        return auth
            .requireAuthentication(null, null, null)
            .then(successCallback)
            .catch(() => {});
    },
    redirectToBeautyPrefsPage: () => {
        const analyticsData = {
            linkData: 'mysephora:ciq spoke',
            pageName: 'mysephora:ciq spoke:beauty preference saved:*' // this will become c6
        };

        anaUtils.setNextPageData(analyticsData);

        return urlUtils.redirectTo('/profile/BeautyPreferences');
    },
    showModal: (options = {}) => {
        return showInfoModal({ ...commonModalOptions, ...options });
    },
    showSaveErrorModal: () => {
        const options = {
            title: getText('errorSavingModalTitle'),
            message: getText('errorSavingModalMessage'),
            buttonText: getText('errorSavingModalButton'),
            buttonWidth: 165,
            showCancelButtonLeft: false
        };

        return showInfoModal({ ...commonModalOptions, ...options });
    },
    showTooltipModal: () => {
        const options = {
            title: getText('tooltipModalTitle'),
            message: getText('tooltipModalMessage'),
            buttonText: getText('infoModalButton'),
            buttonWidth: 124,
            showCancelButtonLeft: false
        };

        return showInfoModal({ ...commonModalOptions, ...options });
    },
    unsetCapturedColorIQPref: () => {
        const capturedColorIQPref = Storage.local.getItem(LOCAL_STORAGE.CAPTURED_COLOR_IQ_PREF, false, false, true);

        if (capturedColorIQPref) {
            return Storage.local.removeItem(LOCAL_STORAGE.CAPTURED_COLOR_IQ_PREF);
        }

        return null;
    }
};

const withCapturedColorIQBoxProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, localization, withCapturedColorIQBoxProps
};
