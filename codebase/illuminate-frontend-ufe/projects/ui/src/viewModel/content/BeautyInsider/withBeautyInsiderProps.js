import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import netBeautyBankPointsAvailableSelector from 'selectors/basket/netBeautyBankPointsAvailableSelector';

import userUtils from 'utils/User';
import beautyInsiderActions from 'actions/BeautyInsiderActions';
import rewardActions from 'actions/RewardActions';
import profileActions from 'actions/ProfileActions';
const { wrapHOC } = FrameworkUtils;
const { getAccountHistorySlice } = profileActions;

const fields = createSelector(netBeautyBankPointsAvailableSelector, userSelector, (netBeautyBankPointsAvailable, user) => {
    return {
        netBeautyBankPointsAvailable,
        user,
        isBI: userUtils.isBI(),
        isSignedIn: userUtils.isSignedIn(),
        userIsInitialized: user.isInitialized,
        isAtLeastRecognized: user.isInitialized && userUtils.isUserAtleastRecognized()
    };
});

const functions = dispatch => ({
    fetchBiRewards: () => dispatch(beautyInsiderActions.fetchBiRewards()),
    fetchClientSummary: (profileId, includeCampaigns) => dispatch(beautyInsiderActions.fetchClientSummary(profileId, includeCampaigns)),
    fetchRecentlyRedeemedRewards: profileId => dispatch(rewardActions.fetchRecentlyRedeemedRewards(profileId, { purchaseFilter: 'rewards' })),
    getAccountHistorySlice: profileId => dispatch(getAccountHistorySlice(profileId, 0, 4)),
    fetchBeautyOffers: (country, language) => dispatch(beautyInsiderActions.getBeautyOffers(country, language))
});

const withBeautyInsiderProps = wrapHOC(connect(fields, functions));

export {
    withBeautyInsiderProps, fields, functions
};
