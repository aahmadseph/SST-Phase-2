import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const { ASYNC_PAGE_LOAD, EVENT_NAMES, PAGE_NAMES, LINK_TRACKING_EVENT } = anaConsts;

// fires s.t call
function triggerAPLAnalytics() {
    processEvent.process(ASYNC_PAGE_LOAD, {
        data: {
            pageName: PAGE_NAMES.TRUST_MARK_MODAL
        }
    });
}

// fires s.tl call
function triggerSOTAnalytics() {
    processEvent.process(LINK_TRACKING_EVENT, {
        data: {
            actionInfo: EVENT_NAMES.BAZAAR_VOICE_POLICY_CLICK,
            previousPage: PAGE_NAMES.TRUST_MARK_MODAL
        }
    });
}

export default {
    triggerSOTAnalytics,
    triggerAPLAnalytics
};
