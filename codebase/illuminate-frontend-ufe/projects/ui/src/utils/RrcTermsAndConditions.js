import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import store from 'Store';
import userUtils from 'utils/User';
import UtilActions from 'utils/redux/Actions';

const persistAcceptance = function (isAccepted) {
    const itemData = {
        isAccepted: isAccepted,
        userProfileId: userUtils.getProfileId()
    };

    Storage.local.setItem(LOCAL_STORAGE.RRC_TERMS_CONDITIONS_ACCEPTED, itemData);
    store.dispatch(UtilActions.merge('termsConditions', 'isRRCTermsAndConditions', isAccepted));
};

const persistAcceptanceCheck = function (isChecked) {
    const itemData = {
        isChecked: isChecked,
        userProfileId: userUtils.getProfileId()
    };

    Storage.local.setItem(LOCAL_STORAGE.RRC_TERMS_CONDITIONS_CHECKED, itemData);
    store.dispatch(UtilActions.merge('termsConditions', 'isRRCTermsAndConditionsChecked', isChecked));
};

const areRRCTermsConditionsAccepted = () => {
    const rrcTermsConditionsAccepted = Storage.local.getItem(LOCAL_STORAGE.RRC_TERMS_CONDITIONS_ACCEPTED);

    return (
        rrcTermsConditionsAccepted && rrcTermsConditionsAccepted.isAccepted && rrcTermsConditionsAccepted.userProfileId === userUtils.getProfileId()
    );
};

const areRRCTermsConditionsChecked = () => {
    const rrcTermsConditionsChecked = Storage.local.getItem(LOCAL_STORAGE.RRC_TERMS_CONDITIONS_CHECKED);

    return rrcTermsConditionsChecked && rrcTermsConditionsChecked.isChecked && rrcTermsConditionsChecked.userProfileId === userUtils.getProfileId();
};

export default {
    persistAcceptance,
    persistAcceptanceCheck,
    areRRCTermsConditionsAccepted,
    areRRCTermsConditionsChecked
};
