import decorators from 'utils/decorators';
import personalizedPreviewPlacementsApi from 'services/api/personalizedPreviewPlacements';
import {
    SET_P13N_VARIATIONS, SET_ACTIVE_P13N_VARIATION, SET_SID_DATA, UPDATE_SID_DATA
} from 'constants/actionTypes/personalization';

const setP13NVariations = payload => {
    return {
        type: SET_P13N_VARIATIONS,
        payload
    };
};

const setActiveVariation = payload => {
    return {
        type: SET_ACTIVE_P13N_VARIATION,
        payload
    };
};

const setSidData = payload => {
    return {
        type: SET_SID_DATA,
        payload
    };
};

const updateSidData = payload => {
    return {
        type: UPDATE_SID_DATA,
        payload
    };
};

const setPersonalizedVariations = (contextId, variationIds, callback) => {
    return dispatch => {
        const { country, channel, language } = Sephora.renderQueryParams;
        const payload = {
            variationIds,
            channel,
            language,
            country
        };

        return decorators
            .withInterstice(
                personalizedPreviewPlacementsApi.getVariations,
                0
            )(payload)
            .then(variations => {
                if (!variations) {
                    callback();
                } else {
                    const variationData = {
                        [contextId]: variations
                    };
                    dispatch(setP13NVariations(variationData));
                }
            })
            .catch(() => {
                callback();
            });
    };
};

export default {
    setPersonalizedVariations,
    setActiveVariation,
    setSidData,
    updateSidData,
    setP13NVariations
};
