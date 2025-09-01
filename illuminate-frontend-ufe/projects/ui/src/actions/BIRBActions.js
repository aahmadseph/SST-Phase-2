import biApi from 'services/api/beautyInsider/getBiRewardsGroup';
import UtilActions from 'utils/redux/Actions';
import store from 'store/Store';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import helpers from 'utils/Helpers';

const isObject = helpers.isObject;

export function fetchBiRewards(options) {
    return dispatch => {
        biApi
            .getBiRewardsGroupForProfile(options)
            .then(data => {
                const { basket } = store.getState();
                const updatedSkus = {
                    ...data,
                    biRewardGroups: {}
                };

                isObject(data?.biRewardGroups) &&
                    Object.keys(data.biRewardGroups).length > 0 &&
                    Object.keys(data.biRewardGroups).forEach(key => {
                        updatedSkus.biRewardGroups[key] = rougeExclusiveUtils.updateRougeExclusiveSkus(data.biRewardGroups[key], basket);
                    });

                dispatch(UtilActions.merge('beautyInsider', 'biRewardGroups', updatedSkus.biRewardGroups));
            })
            // eslint-disable-next-line no-console
            .catch(console.error);
    };
}

export default { fetchBiRewards };
