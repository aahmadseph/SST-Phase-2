import { HydrationFinished } from 'constants/events';
import Events from 'utils/framework/Events';
import Debounce from 'utils/Debounce';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import RCPSCookies from 'utils/RCPSCookies';

const DEBOUNCED_UPDATE_TIME = 1000;

export default (function () {
    Events.onLastLoadEvent(window, [HydrationFinished], function () {
        if (RCPSCookies.isRCPSAuthEnabled()) {
            const updateTimestamp = () => {
                const timestamp = new Date().toISOString();
                Storage.local.setItem(LOCAL_STORAGE.LAST_USER_INTERACTION, timestamp);

                if (Storage.local.getItem(LOCAL_STORAGE.USER_DIDNT_INTERACT)) {
                    window.dispatchEvent(new CustomEvent('UserComeBack', { detail: {} }));
                    Storage.local.removeItem(LOCAL_STORAGE.USER_DIDNT_INTERACT);
                }
            };
            const debouncedUpdateTimestamp = Debounce.debounce(updateTimestamp, DEBOUNCED_UPDATE_TIME);

            window.addEventListener('click', debouncedUpdateTimestamp, true);
            window.addEventListener('scroll', debouncedUpdateTimestamp, true);
        }
    });

    return null;
}());
