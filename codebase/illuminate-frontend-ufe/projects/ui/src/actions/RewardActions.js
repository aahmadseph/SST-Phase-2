import getBiRewardsGroup from 'services/api/beautyInsider/getBiRewardsGroup';
import BIApi from 'services/api/beautyInsider';
import UtilActions from 'utils/redux/Actions';
import Storage from 'utils/localStorage/Storage';
import store from 'store/Store';
import biUtils from 'utils/BiProfile';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import helpers from 'utils/Helpers';

const isObject = helpers.isObject;
const { REWARDS_PURCHASED_GROUPS } = biUtils;

function fetchProfileRewards(options) {
    return dispatch => {
        getBiRewardsGroup.getBiRewardsGroupForCheckout(options).then(data => {
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

            return dispatch(UtilActions.merge('rewards', 'rewards', updatedSkus));
        });
    };
}

function fetchRecentlyRedeemedRewards(userId, options) {
    return dispatch => {
        BIApi.getPurchaseHistory(userId, options).then(data => {
            const { useLXSRedemptionHistory = false } = Sephora.configurationSettings;

            if (useLXSRedemptionHistory) {
                Storage.local.setItem(REWARDS_PURCHASED_GROUPS, data.purchasedGroups);
            }

            dispatch(UtilActions.merge('rewards', 'rewardsPurchasedGroups', data.purchasedGroups));
        });
    };
}

export default {
    fetchProfileRewards,
    fetchRecentlyRedeemedRewards
};
