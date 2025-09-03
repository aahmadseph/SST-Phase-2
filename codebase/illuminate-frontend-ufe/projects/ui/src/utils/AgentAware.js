const AGENT_AWARE_CLASSNAMES = {
    AGENT_AWARE_HIDE: 'agent-aware-hide',
    AGENT_AWARE_SHOW: 'agent-aware-show'
};

const applyAgentAwareClassname = (className = '') => {
    if (Sephora.isAgentAuthorizedRole) {
        return className;
    }

    return '';
};

const applyAgentAwareClassnameToTiers = (className = '', tiersAllowed = []) => {
    if (Sephora.isAgentAuthorizedRole?.(tiersAllowed)) {
        return className;
    }

    return '';
};

const applyHideAgentAwareClass = () => {
    return applyAgentAwareClassname(AGENT_AWARE_CLASSNAMES.AGENT_AWARE_HIDE);
};

const applyShowAgentAwareClass = () => {
    return applyAgentAwareClassname(AGENT_AWARE_CLASSNAMES.AGENT_AWARE_SHOW);
};

const applyHideAgentAwareClassToTiers = (tiersAllowed = []) => {
    return applyAgentAwareClassnameToTiers(AGENT_AWARE_CLASSNAMES.AGENT_AWARE_HIDE, tiersAllowed);
};

const addAgentAwareListener = (eventName, callbackFn) => {
    return window.addEventListener(eventName, callbackFn);
};

const removeAgentAwareListener = (eventName, eventLister) => {
    window.removeEventListener(eventName, eventLister, false);
};

export default {
    applyShowAgentAwareClass,
    applyAgentAwareClassnameToTiers,
    applyHideAgentAwareClass,
    applyHideAgentAwareClassToTiers,
    addAgentAwareListener,
    removeAgentAwareListener
};
