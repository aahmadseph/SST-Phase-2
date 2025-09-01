import { STORE_INITIALISATION } from 'constants/actionTypes/application';

const initialState = {};

const ssrProps = function (state = initialState, action) {
    // eslint-disable-next-line object-curly-newline
    const { type, payload } = action;

    switch (type) {
        case STORE_INITIALISATION: {
            return payload.ssrProps;
        }
        default: {
            return state;
        }
    }
};

export default ssrProps;
