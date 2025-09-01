import {
    CatalogEngineReady,
    CategoriesFetched,
    ConstructorBeaconDisabled,
    ConstructorBeaconInitialized,
    DebouncedResize,
    DebouncedScroll,
    DOMContentLoaded,
    HydrationFinished,
    Immediate,
    LazyLoadComplete,
    load,
    OrderInfoCtrlrsApplied,
    OrderInfoLoaded,
    OrderInfoReady,
    PostLoad,
    PostLoadCtrlrsApplied,
    ProfileUpdated,
    SearchInfoLoaded,
    SearchInfoReady,
    ShowQuickLookModal,
    TestTarget,
    TestTargetCtrlrsApplied,
    TestTargetLoaded,
    TestTargetReady,
    TestTargetResult,
    TestTargetServiceReady,
    UserInfoCtrlrsApplied,
    UserInfoLoaded,
    UserInfoReady,
    VisitorAPILoaded,
    nebOnsiteLoaded,
    ProductInfoLoaded,
    ProductInfoReady,
    P13NData,
    P13NDataReady,
    P13NDataLoaded
} from 'constants/events';

import agentAwareUtils from 'utils/AgentAware';
import store from 'store/Store';
import userActions from 'actions/UserActions';
import actions from 'actions/Actions';

const { addAgentAwareListener } = agentAwareUtils;
const { signOut } = userActions;
const { showSignInModal } = actions;

// This function should run immediately the first time its called.
// It will then run at the specified interval if called again
// before that interval is up.
function debounce(func, wait) {
    var lastRun,
        timeout,
        args,
        _this,
        later = function () {
            clearTimeout(timeout);
            timeout = null;
            lastRun = new Date().getTime();
            func.apply(_this, args);
        };

    return function () {
        _this = this;
        args = arguments;

        var sinceLastRun = new Date().getTime() - lastRun;

        if (sinceLastRun > wait) {
            later();
        } else if (!timeout) {
            timeout = setTimeout(later, wait - sinceLastRun);
        }
    };
}

var debouncedScrollHandler = debounce(function () {
    window.dispatchEvent(new CustomEvent(DebouncedScroll, { detail: {} }));
}, 50);

if (typeof window !== 'undefined') {
    window.addEventListener('scroll', debouncedScrollHandler);
}

var debouncedResizeHandler = debounce(function () {
    window.dispatchEvent(new CustomEvent(DebouncedResize, { detail: {} }));
}, 500);

if (typeof window !== 'undefined') {
    window.addEventListener('resize', debouncedResizeHandler);
}

addAgentAwareListener('Logout', () => {
    // Close sign in modal before logout

    store.dispatch(showSignInModal({ isOpen: false }));
    store.dispatch(signOut('/', true));
});

addAgentAwareListener('CloseSignInModal', () => {
    // Close sign in modal
    store.dispatch(showSignInModal({ isOpen: false }));
});

// const onLast = function (target, events, callback) {
//     var count = 0;
//
//     for (var i = 0; i < events.length; i++) {
//         target.addEventListener(events[i], function () {
//             if (++count === events.length) callback();
//         }, false);
//     }
// }

export default {
    CatalogEngineReady,
    CategoriesFetched,
    ConstructorBeaconDisabled,
    ConstructorBeaconInitialized,
    DebouncedResize,
    DebouncedScroll,
    DOMContentLoaded,
    HydrationFinished,
    Immediate,
    LazyLoadComplete,
    load,
    onLastLoadEvent: Sephora.Util.onLastLoadEvent,
    OrderInfoCtrlrsApplied,
    OrderInfoLoaded,
    OrderInfoReady,
    PostLoad,
    PostLoadCtrlrsApplied,
    ProfileUpdated,
    SearchInfoLoaded,
    SearchInfoReady,
    ShowQuickLookModal,
    nebOnsiteLoaded,
    TestTarget,
    TestTargetCtrlrsApplied,
    TestTargetLoaded,
    TestTargetReady,
    TestTargetResult,
    TestTargetServiceReady,
    UserInfoCtrlrsApplied,
    UserInfoLoaded,
    UserInfoReady,
    ProductInfoLoaded,
    ProductInfoReady,
    VisitorAPILoaded,
    P13NData,
    P13NDataReady,
    P13NDataLoaded
};
