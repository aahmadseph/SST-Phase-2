import {
    EventType, HydrationFinished, UserInfo, UserInfoLoaded
} from 'constants/events';
import InflatorComps from 'utils/framework/InflateComponents';
import store from 'store/Store';
import UserActions from 'actions/UserActions';
import urlUtils from 'utils/Url';
import Actions from 'Actions';
import CreditCardActions from 'actions/CreditCardActions';
import targetersActions from 'actions/targetersActions';
import framework from 'utils/framework';

const { Application } = framework;
const { forceRegisterModal } = Actions;
const { processUserFull, getUserCreditCardRewards } = UserActions;
const { getCreditCardTargeters } = CreditCardActions;

export default (function () {
    /** Function for Forced Registration Modal if url contains action=register
     * @param {object} userInfoData
     */
    const handleQueryParamsAction = function (userInfoData) {
        const actionParams = urlUtils.getParamsByName('action');
        const { auth } = store.getState();

        if (actionParams && actionParams.indexOf('register') > -1) {
            if (auth.profileStatus !== 0 && !userInfoData.profile.beautyInsiderAccount) {
                store.dispatch(forceRegisterModal(true));
            } else if (auth.profileStatus === 0) {
                store.dispatch(forceRegisterModal(false));
            }
        }
    };

    /* User Info Service */
    Application.events.onLastLoadEvent(window, [HydrationFinished, UserInfoLoaded], function () {
        const userInfo = InflatorComps.services.UserInfo;
        const userInfoData = userInfo.data;
        const dataIsFromCache = userInfo.dataIsFromCache;
        store.dispatch(processUserFull(userInfoData, dataIsFromCache));

        handleQueryParamsAction(userInfoData);

        store.dispatch(getCreditCardTargeters());
        store.dispatch(targetersActions.requestAndSetTargeters());

        if (userInfoData.profile?.profileId) {
            store.dispatch(getUserCreditCardRewards(userInfoData));
        }

        Application.events.dispatchServiceEvent(UserInfo, EventType.Ready);
        Application.events.dispatchServiceEvent(UserInfo, EventType.ServiceCtrlrsApplied, true);
    });

    return null;
}());
