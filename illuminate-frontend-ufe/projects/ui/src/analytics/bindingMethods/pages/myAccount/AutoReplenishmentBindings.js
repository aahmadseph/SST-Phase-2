import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import helperUtils from 'utils/Helpers';

const { formatSiteCatalystPrice } = helperUtils;

const {
    EVENT_NAMES: { AUTO_REPLENISHMENT },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class AutoReplenishmentBindings {
    static triggerSOTAnalytics = (subscription, eventName) => {
        const {
            currentSku: { skuId, qty: quantity, originalPrice: originalPrice, discountedPrice: discountedPrice },
            frequency: replenishmentFreqNum,
            frequencyType: replenishmentFreqType,
            status
        } = subscription;
        const unformattedPrice = discountedPrice ? discountedPrice : originalPrice;

        const price = formatSiteCatalystPrice(unformattedPrice);
        processEvent.process(SOT_LINK_TRACKING_EVENT, {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                skuId,
                replenishmentFreqNum,
                replenishmentFreqType: replenishmentFreqType.toLowerCase(),
                status: status?.toLowerCase(),
                quantity,
                price
            }
        });
    };

    static triggerSOTSimpleAnalytics = eventName => {
        processEvent.process(SOT_LINK_TRACKING_EVENT, {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName
            }
        });
    };

    static manageSubscriptionClose = subscription => {
        const { MANAGE_SUBSCRIPTION_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, MANAGE_SUBSCRIPTION_CLOSE);
    };

    static manageUnsubscribe = subscription => {
        const { UNSUBSCRIBE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, UNSUBSCRIBE);
    };

    static confirmGetItSooner = subscription => {
        const { GET_IT_SOONER_CONFIRM } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, GET_IT_SOONER_CONFIRM);
    };

    static unsubscribeModalClose = subscription => {
        const { CLOSE_UNSUBSCRIBE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, CLOSE_UNSUBSCRIBE);
    };

    static skipModalClose = subscription => {
        const { CLOSE_SKIP } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, CLOSE_SKIP);
    };

    static resumeModalConfirm = subscription => {
        const { CONFIRM_RESUME } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, CONFIRM_RESUME);
    };

    static closeGetItSooner = subscription => {
        const { GET_IT_SOONER_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, GET_IT_SOONER_CLOSE);
    };

    static unavailableGetItSooner = subscription => {
        const { GET_IT_SOONER_UNAVAILABLE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, GET_IT_SOONER_UNAVAILABLE);
    };

    static resumeClose = subscription => {
        const { RESUME_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, RESUME_CLOSE);
    };

    static pauseConfirmation = subscription => {
        const { PAUSE_CONFIRMATION } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, PAUSE_CONFIRMATION);
    };

    static pauseClose = subscription => {
        const { PAUSE_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, PAUSE_CLOSE);
    };

    static updatePaymentSave = subscription => {
        const { UPDATE_PAYMENT_SAVE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, UPDATE_PAYMENT_SAVE);
    };

    static updatePaymentClose = subscription => {
        const { UPDATE_PAYMENT_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, UPDATE_PAYMENT_CLOSE);
    };

    static addCardModalClose = subscription => {
        const { ADD_CARD_MODAL_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, ADD_CARD_MODAL_CLOSE);
    };

    static editCardModalClose = subscription => {
        const { EDIT_CARD_MODAL_CLOSE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, EDIT_CARD_MODAL_CLOSE);
    };

    static savedAddedCard = subscription => {
        const { ADD_CARD_MODAL_SAVE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, ADD_CARD_MODAL_SAVE);
    };

    static savedEditedCard = subscription => {
        const { EDIT_CARD_MODAL_SAVE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, EDIT_CARD_MODAL_SAVE);
    };

    static updatePaymentRemove = subscription => {
        const { REMOVE_PAYMENT } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, REMOVE_PAYMENT);
    };

    static skipConfirmation = subscription => {
        const { SKIP_CONFIRMATION } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, SKIP_CONFIRMATION);
    };

    static loadMore = () => {
        const { LOAD_MORE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTSimpleAnalytics(LOAD_MORE);
    };

    static skipItemUnavailable = subscription => {
        const { SKIP_UNAVAILABLE } = AUTO_REPLENISHMENT;
        AutoReplenishmentBindings.triggerSOTAnalytics(subscription, SKIP_UNAVAILABLE);
    };
}

export default AutoReplenishmentBindings;
