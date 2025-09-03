// This module provides API call methods for Sephora Commerce
// Beauty Insider APIs:
// https://jira.sephora.com/wiki/display/ILLUMINATE/Beauty+Insider+APIs

import getBiPoints from 'services/api/beautyInsider/getBiPoints';
import getBiDigitalCardNumber from 'services/api/beautyInsider/getBiDigitalCardNumber';
import getBiAccountHistory from 'services/api/beautyInsider/getBiAccountHistory';
import createBiAccount from 'services/api/beautyInsider/createBiAccount';
import updateBiAccount from 'services/api/beautyInsider/updateBiAccount';
import unlinkBiAccount from 'services/api/beautyInsider/unlinkBiAccount';
import getPurchaseHistory from 'services/api/beautyInsider/getPurchaseHistory';
import getCompletePurchaseHistory from 'services/api/beautyInsider/getCompletePurchaseHistory';
import addBiRewardsToCart from 'services/api/beautyInsider/addBiRewardsToCart';
import removeBiRewardFromBasket from 'services/api/beautyInsider/removeBiRewardFromBasket';
import getBiRewards from 'services/api/beautyInsider/getBiRewards';
import getBiRewardsGroup from 'services/api/beautyInsider/getBiRewardsGroup';
import getClientSummary from 'services/api/beautyInsider/getClientSummary';
import getBiProfile from 'services/api/beautyInsider/getBiProfile';
import getRougeRewards from 'services/api/beautyInsider/getRougeRewards';
import getRewardFulfillmentOptions from 'services/api/beautyInsider/getRewardFulfillmentOptions';

const accessTokenName = 'AUTH_ACCESS_TOKEN';
import accessToken from 'services/api/accessToken/accessToken';

const { getBiRewardsGroupForCheckout, getBiRewardsGroupForProfile, getBiRewardsGroupForSnapshot, getBiRewardsGroupForOrderConf } = getBiRewardsGroup;

export default {
    getBiPoints,
    getBiDigitalCardNumber,
    getBiAccountHistory,
    createBiAccount,
    updateBiAccount,
    unlinkBiAccount,
    addBiRewardsToCart,
    removeBiRewardFromBasket,
    getPurchaseHistory,
    getCompletePurchaseHistory,
    getBiRewardsGroupForCheckout,
    getBiRewardsGroupForProfile,
    getBiRewardsGroupForSnapshot,
    getBiRewardsGroupForOrderConf,
    getBiRewards,
    getClientSummary,
    getBiProfile,
    getRougeRewards: accessToken.withAccessToken(getRougeRewards, accessTokenName),
    getRewardFulfillmentOptions: accessToken.withAccessToken(getRewardFulfillmentOptions, accessTokenName)
};
