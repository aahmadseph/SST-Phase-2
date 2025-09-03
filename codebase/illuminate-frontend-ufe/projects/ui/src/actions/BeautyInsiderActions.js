import biRewardsApi from 'services/api/beautyInsider';
import UtilActions from 'utils/redux/Actions';
import { getContent } from 'services/api/Content/getContent';
import BeautyInsiderReducer from 'reducers/beautyInsider';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import store from 'store/Store';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import helpers from 'utils/Helpers';

const isObject = helpers.isObject;
const { ACTION_TYPES: TYPES } = BeautyInsiderReducer;

const updateBIPersonalizedOffers = data => ({
    type: TYPES.SET_BI_PERSONALIZED_OFFERS,
    payload: data
});

function fetchBiRewards() {
    return dispatch => {
        biRewardsApi
            .getBiRewardsGroupForSnapshot()
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
            .catch(error => {
                dispatch(UtilActions.merge('beautyInsider', 'biRewardGroups', error));
            });
    };
}

function getContentfulData(campaign, country, language) {
    return new Promise(resolve => {
        getContent({
            language,
            country,
            path: `/advocacy/${campaign.campaignCode}`
        }).then(({ data }) => {
            if (!data?.excludeCountry) {
                campaign.content = data;
            }

            resolve(campaign);
        });
    });
}

function getBeautyOffers(country, language) {
    return dispatch => {
        getContent({
            language,
            country,
            path: '/beauty/beauty-offers/'
        }).then(({ data }) => {
            const { layout } = data;
            const offers = layout?.content.find(
                content =>
                    content.type === 'PromotionList' && content.features.some(feature => feature.handlerType === 'PromotionList_Personalized_For_You')
            );

            Storage.local.setItem(LOCAL_STORAGE.BI_OFFERS, offers);
            dispatch(UtilActions.merge('beautyInsider', 'biOffers', offers));
        });
    };
}

function fetchClientSummary(profileId, includeCampaigns) {
    return dispatch => {
        biRewardsApi
            .getClientSummary(profileId, includeCampaigns)
            .then(summary => {
                if (summary?.activeCampaigns?.length && Sephora.configurationSettings.isAdvocacyContentfulEnabled) {
                    const { country, language } = Sephora.renderQueryParams;
                    const promises = summary.activeCampaigns.map(campaign => getContentfulData(campaign, country, language));
                    Promise.all(promises).then(data => {
                        summary.activeCampaigns = data;
                        dispatch(UtilActions.merge('beautyInsider', 'summary', summary));
                    });
                } else {
                    dispatch(UtilActions.merge('beautyInsider', 'summary', summary));
                }
            })
            // eslint-disable-next-line no-console
            .catch(console.error);
    };
}

export default {
    fetchBiRewards,
    fetchClientSummary,
    getBeautyOffers,
    updateBIPersonalizedOffers
};
