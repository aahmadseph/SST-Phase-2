import Actions from 'actions/Actions';
import store from 'store/Store';
import klarnaUtils from 'utils/Klarna';
import ufeApi from 'services/api/ufeApi';

const { showExtendSessionModal } = Actions;

const ONE_MINUTE = 60000;
const SECOND = 1000;
const EXPIRY = 900000; // 15min

const SessionExtensionService = {
    expiryCounter: undefined,
    setExpiryTimer: function (prevAPICallsCnt) {
        if (this.expiryCounter) {
            clearInterval(this.expiryCounter);
            this.expiryCounter = undefined;
        }

        this.expiry = EXPIRY;

        this.expiryCounter = setInterval(() => {
            const currentAPICallsCnt = ufeApi.getCallsCounter();

            if (currentAPICallsCnt === prevAPICallsCnt) {
                this.expiry = this.expiry - SECOND;
            } else {
                clearInterval(this.expiryCounter);
                this.setExpiryTimer(currentAPICallsCnt);
            }

            if (this.expiry <= ONE_MINUTE) {
                clearInterval(this.expiryCounter);
                klarnaUtils.extendSessionInBackground() || store.dispatch(showExtendSessionModal({ isOpen: true }));
            }
        }, SECOND);
    }
};

export default SessionExtensionService;
