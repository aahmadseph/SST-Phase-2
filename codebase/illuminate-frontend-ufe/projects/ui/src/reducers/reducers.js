import Constants from 'utils/framework/Constants';
import { combineReducers } from 'redux';
import basket from './addToBasket';
import category from './category';
import historyLocation from './framework/historyLocation';
import interstice from './interstice';
import modals from './modals';
import user from './user';
import loves from './loves';
import klarna from './klarna';
import afterpay from './afterpay';
import search from './search';
import productSpecificDetails from './productSpecificDetails';
import inlineBasket from './inline-basket';
import testTarget from './testTarget';
import targeters from './targeters';
import welcomeMat from './welcomeMat';
import termsConditions from './termsConditions';
import targetedPromotion from './targetedPromotion';
import personalizedPromotions from './personalizedPromotions';
import availableRrcCoupons from './availableRrcCoupons';
import samples from './samples';
import rewards from './rewards';
import promo from './promo';
import applePaySession from './applePaySession';
import reduxActionWatch from 'redux-action-watch';
import intersticeRequests from './intersticeRequests';
import profile from './profile';
import socialInfo from './socialInfo';
import cookies from './cookies';
import catalog from './catalog';
import order from './order';
import editData from './editData';
import errors from './errors';
import beautyInsider from './beautyInsider';
import storeHub from './storeHub';
import wizard from './wizard';
import resetSessionExpiry from './resetSessionExpiry';
import creditCard from './creditCard';
import page from './page';
import ssrProps from './ssrProps';
import purchasedHistory from 'reducers/purchaseHistory';
import completePurchaseHistory from 'reducers/completePurchaseHistory';
import recentlyViewedData from 'reducers/recentlyViewedData';
import beautyRecommendations from 'reducers/beautyRecommendations';
import sponsorProducts from 'reducers/sponsorProducts';
import beautyPreferences from 'reducers/beautyPreferences';
import p13n from 'reducers/p13n';
import sephoraML from 'reducers/sephoraML';
import constructorRecommendations from 'reducers/constructorRecommendations';
import gallery from 'reducers/gallery';
import brandsList from 'reducers/brandsList';
import cmsComponents from 'reducers/cmsComponents';
import gladChat from 'reducers/gladChat';
import paze from './paze';
import venmo from './venmo';
import mailingPreferences from 'reducers/mailingPreferences';
import itemSubstitution from 'reducers/itemSubstitution';
import dynamicComponents from 'reducers/dynamicComponents';
import productSamples from 'reducers/productSamples';
import rougeExclusiveRewards from 'reducers/rougeExclusiveRewards';
import headerAndFooter from 'reducers/headerAndFooter';
import auth from 'reducers/auth';
import rmnBanners from 'reducers/rmnBanners';
import rewardFulfillment from 'reducers/rewardFulfillment';
import creatorStoreFront from 'reducers/creatorStoreFront';
import superChat from 'ai/reducers/superChat';
import storeAndDeliveryFlyout from 'reducers/storeAndDeliveryFlyout';
import recommendationsService from 'reducers/recommendationsService';

//Higher Order function responsible for a generic reducer to merge two objects together
const withMerge = (reducerName, reducer) => (state, action) => {
    switch (action.type) {
        case `${reducerName}_MERGE`: {
            // eslint-disable-next-line object-curly-newline
            const { key, value } = action.payload;

            return {
                ...state,
                [key]: value
            };
        }
        default: {
            return reducer(state, action);
        }
    }
};

const reducers = {
    ssrProps,
    basket,
    inlineBasket,
    category,
    historyLocation,
    interstice,
    loves,
    klarna,
    afterpay,
    modals,
    catalog,
    user,
    search,
    productSpecificDetails,
    targeters,
    testTarget,
    welcomeMat,
    termsConditions,
    targetedPromotion,
    personalizedPromotions,
    availableRrcCoupons,
    samples,
    rewards,
    applePaySession,
    promo,
    intersticeRequests,
    profile,
    socialInfo,
    cookies,
    order,
    editData,
    errors,
    beautyInsider,
    storeHub,
    wizard,
    resetSessionExpiry,
    creditCard,
    page,
    purchasedHistory,
    completePurchaseHistory,
    recentlyViewedData,
    beautyRecommendations,
    sponsorProducts,
    p13n,
    beautyPreferences,
    sephoraML,
    constructorRecommendations,
    gallery,
    brandsList,
    cmsComponents,
    paze,
    venmo,
    mailingPreferences,
    itemSubstitution,
    dynamicComponents,
    productSamples,
    rougeExclusiveRewards,
    headerAndFooter,
    auth,
    rmnBanners,
    rewardFulfillment,
    creatorStoreFront,
    gladChat,
    superChat,
    storeAndDeliveryFlyout,
    recommendationsService
};

Object.keys(reducers).forEach(reducerName => {
    reducers[reducerName] = withMerge(reducerName, reducers[reducerName]);
});

reducers[Constants.ACTION_WATCHER_STATE_NAME] = reduxActionWatch.reducer;
const ufe = combineReducers(reducers);

export default ufe;
