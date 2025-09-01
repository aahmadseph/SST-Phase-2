import React from 'react';
import BaseClass from 'components/BaseClass';
import TopPageCMSBannerMessage from 'components/RwdBasket/RwdBasketLayout/TopContentMessages/TopPageCMSBannerMessage';
import { wrapComponent } from 'utils/framework';
import userUtils from 'utils/User';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import * as RwdBasketConst from 'constants/RwdBasket';
import constants from 'constants/content';
import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';

const { TOP_BANNER_PERSONALIZED_MESSAGES } = RwdBasketConst;

const {
    COMPONENT_TYPES: { BANNER }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

class TopContentBirthdayMessage extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isAnalyticsTriggered: false // Track initial load event
        };
    }

    triggerBirthdayAnalytics = (eventName, variationData) => {
        // Don't trigger the analytics on load multiple times.
        if (this.state.isAnalyticsTriggered && eventName === IMPRESSION) {
            return;
        }

        variationData.personalization = this.props.personalization;

        sendCmsComponentEvent({
            items: [variationData],
            eventName,
            sid: '',
            component: BANNER
        });

        // Set state after initial analytics load
        if (eventName === IMPRESSION) {
            this.setState({ isAnalyticsTriggered: true });
        }
    };

    fireModalOpenAnalyticsEvent = () => {
        const variationData = this.props.personalizedComponent?.variationData;
        const { sid } = variationData || {};

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: anaConsts.PAGE_NAMES.BAZAAR_BASKET,
                pageType: anaConsts.PAGE_TYPES.BASKET,
                pageDetail: anaConsts.PAGE_DETAIL.REWARDS_BAZAAR,
                internalCampaign: sid
            }
        });
    };

    handleBannerClick = event => {
        const { openRewardsBazaarModal, personalizedComponent } = this.props;

        const variationData = personalizedComponent?.variationData;
        const { sid } = variationData || {};

        // Fire the analytics event on click (should always work)
        this.fireModalOpenAnalyticsEvent();
        event.stopPropagation();
        openRewardsBazaarModal(true, {
            source: TOP_BANNER_PERSONALIZED_MESSAGES.BIRTHDAY_GIFT,
            analyticsData: {
                personalizedInternalCampaign: sid
            }
        });

        // Trigger analytics for ITEM_CLICK
        this.triggerBirthdayAnalytics(ITEM_CLICK, variationData);
    };

    render() {
        const {
            showSkeleton, isBirthdayGiftEligible, personalizedComponent, backgroundColor, showBasketGreyBackground
        } = this.props;
        const isBasketPersonalizationEnabled = Sephora.configurationSettings.isBasketPersonalizationEnabled;
        const variationData = personalizedComponent?.variationData;

        if (!showSkeleton && (!variationData || !isBasketPersonalizationEnabled || !isBirthdayGiftEligible)) {
            return null;
        }

        // Trigger analytics for the first time on load (if not triggered already)
        if (!this.state.isAnalyticsTriggered) {
            this.triggerBirthdayAnalytics(IMPRESSION, variationData);
        }

        const { sid, text, action, media } = variationData || {};

        return (
            <TopPageCMSBannerMessage
                key={sid}
                text={text}
                renderText={birthdayMessage => birthdayMessage.replace('{0}', userUtils.getProfileFirstName())}
                targetUrl={action?.targetUrl}
                icon={media?.src}
                showSkeleton={showSkeleton}
                sid={sid}
                onClick={this.handleBannerClick}
                backgroundColor={backgroundColor}
                showBasketGreyBackground={showBasketGreyBackground}
            />
        );
    }
}

export default wrapComponent(TopContentBirthdayMessage, 'TopContentBirthdayMessage', true);
