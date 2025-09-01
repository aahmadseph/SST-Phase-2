import {
    UPDATE_SUBSCRIPTIONS,
    UPDATE_SUBSCRIPTION_LIST,
    UPDATE_ACTIVE_SUBSCRIPTIONS,
    UPDATE_PAUSED_SUBSCRIPTIONS,
    UPDATE_CANCELLED_SUBSCRIPTIONS,
    UNSUBSCRIBE_AUTOREPLENISHMENT,
    LOAD_SHIPPING_AND_PAYMENT_INFO,
    LOAD_CREDIT_CARD_LIST,
    UPDATE_AUTOREPLENISHMENT_SUBSCRIPTION,
    CLEAR_SUBSCRIPTIONS,
    LOAD_COUNTRIES,
    LOAD_CONTENT
} from 'constants/actionTypes/autoReplenishment';

const initialState = {
    subscriptions: {
        subscriptions: [],
        numOfPagesLoaded: 0,
        activePagesLoaded: 0,
        pausedPagesLoaded: 0,
        cancelledPagesLoaded: 0
    },
    shippingAndPaymentInfo: {
        shippingAddress: {},
        payment: {}
    },
    creditCards: [],
    countries: [],
    cmsData: null
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case UPDATE_SUBSCRIPTIONS: {
            return {
                ...state,
                subscriptions: {
                    ...payload,
                    numOfPagesLoaded: state.subscriptions.numOfPagesLoaded + 1,
                    subscriptions: state.subscriptions.subscriptions.concat(payload.subscriptions)
                }
            };
        }
        case UNSUBSCRIBE_AUTOREPLENISHMENT: {
            return {
                ...state,
                subscriptions: {
                    ...payload,
                    subscriptions: state.subscriptions?.subscriptions?.filter(({ subscriptionId }) => subscriptionId !== payload.subscriptionId)
                }
            };
        }
        case UPDATE_SUBSCRIPTION_LIST: {
            return {
                ...state,
                subscriptions: {
                    ...payload,
                    activePagesLoaded: state.subscriptions.activePagesLoaded + 1,
                    pausedPagesLoaded: state.subscriptions.pausedPagesLoaded + 1,
                    cancelledPagesLoaded: state.subscriptions.pausedPagesLoaded + 1
                }
            };
        }
        case UPDATE_ACTIVE_SUBSCRIPTIONS: {
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    subscriptionList: {
                        ...state.subscriptions.subscriptionList,
                        active: {
                            ...state.subscriptions.subscriptionList.active,
                            hasNext: payload.subscriptionList.active.hasNext,
                            subscriptions: [
                                ...state.subscriptions.subscriptionList.active.subscriptions,
                                ...payload.subscriptionList.active.subscriptions
                            ]
                        }
                    },
                    activePagesLoaded: state.subscriptions.activePagesLoaded + 1
                }
            };
        }
        case UPDATE_PAUSED_SUBSCRIPTIONS: {
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    subscriptionList: {
                        ...state.subscriptions.subscriptionList,
                        paused: {
                            ...state.subscriptions.subscriptionList.paused,
                            hasNext: payload.subscriptionList.paused.hasNext,
                            subscriptions: [
                                ...state.subscriptions.subscriptionList.paused.subscriptions,
                                ...payload.subscriptionList.paused.subscriptions
                            ]
                        }
                    },
                    pausedPagesLoaded: state.subscriptions.pausedPagesLoaded + 1
                }
            };
        }
        case UPDATE_CANCELLED_SUBSCRIPTIONS: {
            return {
                ...state,
                subscriptions: {
                    ...state.subscriptions,
                    subscriptionList: {
                        ...state.subscriptions.subscriptionList,
                        cancelled: {
                            ...state.subscriptions.subscriptionList.cancelled,
                            hasNext: payload.subscriptionList.cancelled.hasNext,
                            subscriptions: [
                                ...state.subscriptions.subscriptionList.cancelled.subscriptions,
                                ...payload.subscriptionList.cancelled.subscriptions
                            ]
                        }
                    },
                    cancelledPagesLoaded: state.subscriptions.cancelledPagesLoaded + 1
                }
            };
        }
        case LOAD_SHIPPING_AND_PAYMENT_INFO: {
            return {
                ...state,
                shippingAndPaymentInfo: payload
            };
        }
        case LOAD_CREDIT_CARD_LIST: {
            return {
                ...state,
                creditCards: payload.creditCards
            };
        }
        case UPDATE_AUTOREPLENISHMENT_SUBSCRIPTION: {
            return {
                ...state,
                shippingAndPaymentInfo: payload
            };
        }
        case CLEAR_SUBSCRIPTIONS: {
            return initialState;
        }
        case LOAD_COUNTRIES: {
            return {
                ...state,
                countries: payload
            };
        }
        case LOAD_CONTENT: {
            return {
                ...state,
                cmsData: payload
            };
        }
        default: {
            return state;
        }
    }
};

export default {
    reducer,
    initialState
};
