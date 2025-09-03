import utils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import deepExtend from 'utils/deepExtend';
import basketUtils from 'utils/Basket';
import skuUtils from 'utils/Sku';
import locationUtils from 'utils/Location';
import marketingFlagsUtil from 'utils/MarketingFlags';

export default function (data) {
    const currentEvent = utils.getMostRecentEvent(anaConsts.LINK_TRACKING_EVENT);
    const { sku, analyticsData = {} } = data;
    const {
        containerTitle, productId, isAddFullSize, isBIRBReward, personalizedInternalCampaign, rootContainerName
    } = analyticsData;
    const isHomepageRewardCarousel = locationUtils.isHomepage() && containerTitle === anaConsts.CAROUSEL_NAMES.REWARD_BAZAAR;
    const isRougeOnlyRewards = rootContainerName === anaConsts.CAROUSEL_NAMES.ROUGE_REWARDS_CAROUSEL;

    /* ILLUPH-119839
     * According to JIRA and business, requirement is to have prop55 populate with
     * actionCampaignString listed below only for the products within the
     * purchases carousel on the profile lists page. (loves and services cannot have rewards)
     * On other pages we will continue to populate eVar75 with actionCampaignString.
     */
    const addText = isAddFullSize ? 'add-full-size' : isHomepageRewardCarousel ? 'add to basket' : 'add-to-basket';
    const isBiReward = skuUtils.isBiReward(sku);
    let actionInfo = isBIRBReward || isBiReward ? [containerTitle, addText].join(':') : addText;
    let internalCampaign = addText;
    let actionCampaignString;

    if (containerTitle) {
        actionCampaignString = `${containerTitle}:${sku.productId || productId}:${addText}`;

        if (isHomepageRewardCarousel) {
            actionCampaignString = `sephora carousel:${containerTitle}:n/a`;
        }

        if (containerTitle === anaConsts.CAROUSEL_NAMES.PURCHASES) {
            actionInfo = actionCampaignString;
        } else {
            internalCampaign =
                isBIRBReward && !isHomepageRewardCarousel
                    ? `${containerTitle}:${sku.productId || productId}:${addText.split(' ').join('-')}`
                    : actionCampaignString;
        }
    }

    // explicit requirement to have c55 set to this when on rewards bazaar page.
    if (locationUtils.isBIRBPage()) {
        actionInfo = `${anaConsts.CAROUSEL_NAMES.REWARD_BAZAAR}:${anaConsts.CAMPAIGN_STRINGS.ADD_TO_BASKET}`;
    }

    if (personalizedInternalCampaign) {
        internalCampaign = personalizedInternalCampaign;
    }

    const attributes = {
        biRealTimePointStatus: basketUtils.getAvailableBiPoints(),
        biRewardType: sku.biType,
        actionInfo,
        linkName: isAddFullSize ? 'Add Full Size' : 'Add To Basket',
        internalCampaign,
        productStrings: data?.analyticsData?.productStrings?.[0]
    };

    if (isRougeOnlyRewards) {
        attributes.actionInfo = `${rootContainerName}:${anaConsts.ACTION_INFO.ADD_TO_BASKET}`;
        attributes.eventStrings = [anaConsts.Event.SC_ADD];
        attributes.productStrings = attributes.productStrings + `|eVar72=${rootContainerName}`;
        attributes.internalCampaign = `${rootContainerName}:${productId}:${anaConsts.CAMPAIGN_STRINGS.ADD_TO_BASKET}`;
    }

    if (locationUtils.isBIRBPage() || locationUtils.isRewardsPage()) {
        const marketingFlagsString = marketingFlagsUtil.getProductTileFlags(sku).join(' ');

        if (marketingFlagsString) {
            attributes.productStrings = attributes.productStrings + `|eVar134=${marketingFlagsString.toLowerCase()}`;
        }
    }

    deepExtend(currentEvent, {
        eventInfo: {
            attributes: attributes
        }
    });
}
