import { SET_SHOP_SAME_DAY, SET_SHOP_SAME_DAY_SALE_ITEMS, SHOW_SDU_LANDING_PAGE_MODAL } from 'constants/actionTypes/happening';

const initialState = {
    isInitialized: false,
    sale: {},
    isSDULandingPageModalOpen: false
};

const reducer = function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_SHOP_SAME_DAY: {
            return { ...state, isInitialized: true, ...payload };
        }

        case SET_SHOP_SAME_DAY_SALE_ITEMS: {
            const nextState = {
                ...state,
                sale: {
                    ...payload
                }
            };

            return nextState;
        }

        case SHOW_SDU_LANDING_PAGE_MODAL: {
            const nextState = {
                ...state,
                isSDULandingPageModalOpen: payload.isOpen
            };

            return nextState;
        }

        default: {
            return state;
        }
    }
};

export default { reducer, initialState };
