import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import BeautyInsiderSelector from 'selectors/beautyInsider/beautyInsiderSelector';
import biUtils from 'utils/BiProfile';
// const { userSelector } = require('selectors/user/userSelector');
// const userUtils = require('utils/User').default;
import rewardsSelector from 'selectors/rewards/rewardsSelector';
import availableRrcCouponsSelector from 'selectors/availableRrcCoupons/availableRrcCouponsSelector';
import profileSelector from 'selectors/profile/profileSelector';
import basketRewardsSelector from 'selectors/basket/rewards/rewardsSelector';
import { isOmniRewardEnabledSelector } from 'viewModel/selectors/basket/isOmniRewardEnabled/isOmniRewardEnabledSelector';
import Storage from 'utils/localStorage/Storage';
import Empty from 'constants/empty';
const { wrapHOC } = FrameworkUtils;
const { beautyInsiderSelector } = BeautyInsiderSelector;

const getMostRecentRewards = (groupsSortedByMostRecent, limit) => {
    const recentRewards = [];
    // const groupsSortedByMostRecent = rewardsPurchasedGroups.sort(this.sortByMostRecent());

    while (groupsSortedByMostRecent.length && recentRewards.length !== limit) {
        const group = groupsSortedByMostRecent.pop();

        for (const item of group.purchasedItems) {
            if (recentRewards.length === limit) {
                break;
            }

            item.sku.readableTransactionDate = group.transactionDate;

            recentRewards.push(item.sku);
        }
    }

    return recentRewards;
};

const fields = createSelector(
    beautyInsiderSelector,
    rewardsSelector,
    availableRrcCouponsSelector,
    profileSelector,
    basketRewardsSelector,
    isOmniRewardEnabledSelector,
    (beautyInsider, rewards, rougeRewardsCoupons, profile, basketRewards, isOmniRewardEnabled) => {
        const { REWARD_GROUPS, REWARDS_PURCHASED_GROUPS } = biUtils;
        const { useLXSRedemptionHistory = false } = Sephora.configurationSettings;
        let rewardsPurchasedGroups;

        const {
            [REWARD_GROUPS.CELEBRATION]: celebrationGifts,
            [REWARD_GROUPS.BIRTHDAY]: birthdayGifts,
            [REWARD_GROUPS.REWARD]: biRewards
        } = beautyInsider.biRewardGroups || {};

        if (useLXSRedemptionHistory) {
            rewardsPurchasedGroups = Storage.local.getItem(REWARDS_PURCHASED_GROUPS) || Empty.Array;
        } else {
            rewardsPurchasedGroups = rewards?.rewardsPurchasedGroups || Empty.Array;
        }

        const sortedRewardsPurchasedGroups = (rewardsPurchasedGroups || []).sort((a, b) => {
            const dateA = new Date(a.transactionDate);
            const dateB = new Date(b.transactionDate);

            if (dateA < dateB) {
                return -1;
            }

            if (dateA > dateB) {
                return 1;
            }

            // dates are equal
            return 0;
        });

        const redeemedRewards = getMostRecentRewards(sortedRewardsPurchasedGroups, 4);
        const showOmniRewardsNotice = isOmniRewardEnabled && basketRewards.length === 0;

        return {
            celebrationGifts,
            birthdayGifts,
            biRewards,
            beautyInsiderSummary: beautyInsider?.summary,
            redeemedRewards,
            rougeRewardsCoupons: rougeRewardsCoupons.coupons,
            accountHistorySlice: profile?.accountHistorySlice,
            showOmniRewardsNotice
        };
    }
);

const functions = null;

const withBeautyInsiderModulesProps = wrapHOC(connect(fields, functions));

export {
    withBeautyInsiderModulesProps, fields, functions
};
