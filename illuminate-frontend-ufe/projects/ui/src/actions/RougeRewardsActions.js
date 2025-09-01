import getRougeRewards from 'services/api/beautyInsider';
import { UPDATE_ROUGE_EXCLUSIVE_REWARDS } from 'constants/actionTypes/rougeRewards';
import rougeExclusiveUtils from 'utils/rougeExclusive';

const updateRougeExclusiveRewards = (profileLanguage, profileLocale) => (dispatch, getState) => {
    getRougeRewards.getRougeRewards(profileLanguage, profileLocale).then(data => {
        const basket = getState().basket;
        const updatedRewards = rougeExclusiveUtils.updateRougeExclusiveSkus(data.biRewards, basket);

        dispatch({
            type: UPDATE_ROUGE_EXCLUSIVE_REWARDS,
            payload: updatedRewards
        });
    });
};

const loadRougeRewards = (profileLanguage, profileLocale) => dispatch => {
    if (!rougeExclusiveUtils.isRougeExclusive()) {
        return;
    }

    dispatch(updateRougeExclusiveRewards(profileLanguage, profileLocale));
};

export default {
    loadRougeRewards
};
