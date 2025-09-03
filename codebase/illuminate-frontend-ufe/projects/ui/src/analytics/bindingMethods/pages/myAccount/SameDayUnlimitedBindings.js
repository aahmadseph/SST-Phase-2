import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

const {
    EVENT_NAMES: { SAME_DAY_UNLIMITED },
    SOT_LINK_TRACKING_EVENT,
    ASYNC_PAGE_LOAD,
    CONTEXT
} = anaConsts;

class SameDayUnlimitedBindings {
    static triggerSOTAnalytics = ({ profileId, eventName, eventType = SOT_LINK_TRACKING_EVENT, pageType }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName
            }
        };

        if (profileId) {
            eventData.data.profileId = profileId;
        }

        if (pageType) {
            eventData.data.pageType = pageType;
        }

        processEvent.process(eventType, eventData);
    };

    static triggerSOTAsyncAnalytics = ({ eventData }) => {
        processEvent.process(ASYNC_PAGE_LOAD, eventData);
    };

    static triggerSOTContentStoreAnalytics = ({ eventName }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static updatePaymentSave = currentSubscription => {
        const { UPDATE_PAYMENT_SAVE } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ profileId: currentSubscription.profileId, eventName: UPDATE_PAYMENT_SAVE });
    };

    static editPaymentSave = profileId => {
        const { EDIT_PAYMENT_SAVE } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ profileId, eventName: EDIT_PAYMENT_SAVE });
    };

    static updatePaymentClose = currentSubscription => {
        const { UPDATE_PAYMENT_CLOSE } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ profileId: currentSubscription.profileId, eventName: UPDATE_PAYMENT_CLOSE });
    };

    static editPaymentClose = profileId => {
        const { EDIT_PAYMENT_CLOSE } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ profileId, eventName: EDIT_PAYMENT_CLOSE });
    };

    static addPaymentSave = () => {
        const { ADD_PAYMENT_SAVE } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ eventName: ADD_PAYMENT_SAVE });
    };

    static addPaymentClose = () => {
        const { ADD_PAYMENT_CLOSE } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ eventName: ADD_PAYMENT_CLOSE });
    };

    static updatePaymentRemove = () => {
        const { REMOVE_PAYMENT } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ eventName: REMOVE_PAYMENT });
    };

    static FAQClick = () => {
        const { FAQ_CLICK } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ eventName: FAQ_CLICK, pageType: 'contentStore', eventType: ASYNC_PAGE_LOAD });
    };

    static trialModalOpen = isTrialAlreadyAdded => {
        const { TRIAL_ALREADY_ADDED } = SAME_DAY_UNLIMITED;

        if (isTrialAlreadyAdded) {
            SameDayUnlimitedBindings.triggerSOTAnalytics({ eventName: TRIAL_ALREADY_ADDED });
        }
    };

    static addToBasket = () => {
        const { ADD_TO_BASKET } = SAME_DAY_UNLIMITED;
        SameDayUnlimitedBindings.triggerSOTAnalytics({ eventName: ADD_TO_BASKET });
    };

    static cancelSubscriptionModalOpen = () => {
        const { CANCEL_SUBSCRIPTION, CANCEL_SUBSCRIPTION_OPEN } = SAME_DAY_UNLIMITED;
        const { SAME_DAY_UNLIMITED: SAME_DAY } = CONTEXT;
        const eventData = {
            data: {
                pageName: `${SAME_DAY}:${CANCEL_SUBSCRIPTION}:n/a:*`,
                pageType: SAME_DAY,
                pageTypeDetail: CANCEL_SUBSCRIPTION,
                previousActionType: CANCEL_SUBSCRIPTION_OPEN
            }
        };
        SameDayUnlimitedBindings.triggerSOTAsyncAnalytics({ eventData });
    };
}

export default SameDayUnlimitedBindings;
