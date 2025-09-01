import targetedPromotion from 'reducers/targetedPromotion';
const { ACTION_TYPES: TYPES } = targetedPromotion;

function updateTargetedPromotion(data) {
    return {
        type: TYPES.UPDATE_TARGETED_PROMOTIOM,
        data: data
    };
}

export default {
    TYPES,
    updateTargetedPromotion
};
