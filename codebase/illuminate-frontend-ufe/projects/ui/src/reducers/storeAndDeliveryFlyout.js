import { SET_SHOP_MY_STORE, SET_SHOP_SAME_DAY, SET_STORE_AND_DELIVERY_SLA } from 'constants/actionTypes/happening';

const initialState = {
    isInitialized: false,
    storeDetails: {},
    sameDay: {}
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_STORE_AND_DELIVERY_SLA: {
            const nextState = {
                ...state,
                isInitialized: true,
                ...payload
            };

            return nextState;
        }
        case SET_SHOP_MY_STORE: {
            const { data: { storeDetails: { pickupMessage, isBopisable, isBeautyServicesEnabled, isStoreEventsEnabled } = {} } = {} } = payload;
            const nextState = {
                ...state,
                storeDetails: {
                    ...state.storeDetails,
                    pickupMessage,
                    isBopisable,
                    isBeautyServicesEnabled,
                    isStoreEventsEnabled
                }
            };

            return nextState;
        }

        case SET_SHOP_SAME_DAY: {
            const { data: { sameDay: { deliveryMessage, sameDayAvailable } = {} } = {} } = payload;

            const nextState = {
                ...state,
                sameDay: {
                    ...state.sameDay,
                    deliveryMessage,
                    sameDayAvailable
                }
            };

            return nextState;
        }

        default: {
            return state;
        }
    }
};

export default reducer;
