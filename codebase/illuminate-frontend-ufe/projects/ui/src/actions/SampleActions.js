import basketApi from 'services/api/basket';
import samplesReducer from 'reducers/samples';
const { ACTION_TYPES: TYPES } = samplesReducer;

function setSamples(samples) {
    return {
        type: TYPES.SET_SAMPLES,
        samples: samples
    };
}

// TODO: Update the fetch to be handled in the Store
function fetchSamples() {
    return dispatch => {
        basketApi.getSamples().then(data => dispatch(setSamples(data)));
    };
}

export default {
    TYPES,
    fetchSamples,
    setSamples
};
