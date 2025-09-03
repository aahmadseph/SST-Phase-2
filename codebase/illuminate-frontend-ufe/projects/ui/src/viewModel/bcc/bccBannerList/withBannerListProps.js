/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import userUtils from 'utils/User';
import p13nUtils from 'utils/localStorage/P13n';
import BannerListBindings from 'analytics/bindingMethods/components/bccComponents/BannerList/BannerListBindings';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { sendCmsComponentEvent, matchContexts } from 'analytics/utils/cmsComponents';
import { personalizationSelector } from 'viewModel/selectors/personalization/personalizationSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import constants from 'constants/content';
import Empty from 'constants/empty';
import anaConsts from 'analytics/constants';
import fetchTrendingContent from 'services/api/bannerList/fetchTrendingContent';
import PersonalizationUtils from 'utils/Personalization';
import { showTrendingContentSelector } from 'viewModel/selectors/testTarget/showTrendingContentSelector';

const {
    COMPONENT_TYPES: { BANNER_LIST }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const TRENDING_CONTENT = {
    homepage_marketingbanner: 'hpmktg',
    homepage_herocarousel: 'hphc'
};

const { wrapHOC } = FrameworkUtils;

const functions = (dispatch, ownProps) => ({
    triggerImpression: function () {
        const { items } = ownProps;
        const personalizationData = p13nUtils.getAllPersonalizedCache();
        const biStatus = userUtils.getBiStatus();
        const profileId = userUtils.getProfileId();
        const profileStatus = userUtils.getProfileStatus();
        const bannersPersonalizedData = [];
        const userData = {
            biStatus,
            profileId,
            profileStatus
        };

        // Check for each item in the banner list to see if its context matches any of the
        // contexts for personalization data in the local storage.
        items.forEach(item => {
            const { personalization } = item;

            if (personalization) {
                const personalizationLocalData = matchContexts(personalization, personalizationData);

                if (personalizationLocalData) {
                    bannersPersonalizedData.push(personalizationLocalData);
                }
            }
        });

        // Only trigger analytics for viewable impression if they also have personalization data.
        if (bannersPersonalizedData.length > 0) {
            userData.bannersPersonalizedData = bannersPersonalizedData;
            BannerListBindings.bannerItemsImpression(userData);
        }
    },
    triggerCMSImpression: function (targets, renderItems, personalization = {}) {
        const { items, sid, title = '', blPlacement = '' } = ownProps;
        const {
            isNBCEnabled = null,
            NBCSlotCounts = Empty.Object,
            bannerPoolId = '',
            isTrendingEnabled = null,
            guardrails = [],
            timestamp = '',
            client_request_id = '',
            context = ''
        } = ownProps?.personalization || Empty.Object;
        const currentItems = (renderItems || items)
            ?.map((item, index) => ({
                ...item,
                itemIndex: index,
                isNBCEnabled,
                blPlacement,
                isTrendingEnabled,
                parentContextId: context || personalization?.context,
                timestamp: timestamp || personalization?.timestamp,
                clientRequestId: client_request_id || personalization?.client_request_id,
                bannerPoolId,
                guardrails: guardrails || personalization?.guardrails,
                NBCSlotCounts: personalization?.NBCSlotCounts?.web || NBCSlotCounts?.web || null
            }))
            .filter((item, index) => targets.includes(index));

        const eventName = IMPRESSION;

        const cmsEventData = {
            items: currentItems,
            eventName,
            title,
            sid,
            component: BANNER_LIST
        };

        setTimeout(() => {
            sendCmsComponentEvent(cmsEventData);
        }, 1000);

        // When the user signs in, we want to re-trigger the impression event
        window.addEventListener(anaConsts.Event.SIGN_IN_RELOAD, () => {
            sendCmsComponentEvent(cmsEventData);
        });
    },
    triggerClick: async function (data, position, personalization = {}) {
        const { sid: bannerSid, variationData } = data;
        const { items, sid, title, blPlacement = '' } = ownProps;
        const {
            isNBCEnabled = null,
            NBCSlotCounts = Empty.Object,
            bannerPoolId = '',
            isTrendingEnabled = null,
            guardrails = [],
            timestamp = '',
            client_request_id = '',
            context = ''
        } = ownProps?.personalization || Empty.Object;
        const eventName = ITEM_CLICK;

        const _items = variationData
            ? [
                {
                    ...variationData,
                    itemIndex: position,
                    isNBCEnabled,
                    bannerPoolId,
                    isTrendingEnabled,
                    blPlacement,
                    timestamp: timestamp || personalization?.timestamp,
                    parentContextId: context || personalization?.context,
                    clientRequestId: client_request_id || personalization?.client_request_id,
                    guardrails: guardrails || personalization?.guardrails,
                    NBCSlotCounts: personalization?.NBCSlotCounts?.web || NBCSlotCounts?.web || null
                }
            ]
            : items.map((item, index) => ({
                ...item,
                itemIndex: index,
                isNBCEnabled,
                bannerPoolId,
                blPlacement,
                isTrendingEnabled,
                guardrails,
                timestamp,
                parentContextId: context || personalization?.context,
                client_request_id,
                NBCSlotCounts: personalization?.NBCSlotCounts?.web || NBCSlotCounts?.web || null
            }));

        await sendCmsComponentEvent({
            items: _items,
            eventName,
            title,
            sid,
            clickedSid: bannerSid,
            component: BANNER_LIST
        });
    },
    getTrendingContent: async function () {
        const { blPlacement } = ownProps;
        const placement = TRENDING_CONTENT[blPlacement];

        return fetchTrendingContent(placement).then(data => data?.data?.at());
    }
});

const connectedBannerList = connect(
    createSelector(
        coreUserDataSelector,
        p13nSelector,
        personalizationSelector,
        showTrendingContentSelector,
        (_state, ownProps) => ownProps,
        (user, p13n, personalization, showTrendingContent, ownProps) => {
            const { isNBCEnabled = false, NBCSlotCounts = Empty.Object } = ownProps?.personalization || Empty.Object;
            const { isTrending } = ownProps;
            const { isPersonalizationInitializing } = personalization;
            const personalizedComponent = (isNBCEnabled && personalization.personalizedComponent) || Empty.Object;
            const isTrendingContentChallengerOne = showTrendingContent.challengerOne;

            let isTrendingContentEnabled = false;

            if (isTrending || ownProps?.personalization?.isTrendingEnabled) {
                if (user.isAnonymous) {
                    isTrendingContentEnabled = isTrendingContentChallengerOne;
                } else {
                    if (isNBCEnabled && (Object.keys(personalizedComponent).length === 0 || personalizedComponent?.length === 0)) {
                        isTrendingContentEnabled = true;
                    }
                }
            }

            const showPersonalizationOverlay = PersonalizationUtils.shouldShowPersonalizationOverlay(isNBCEnabled);
            const nonTargettedVariations = showPersonalizationOverlay ? ownProps.items : undefined;
            const _items = [...ownProps.items];

            let itemsToShow = ownProps.items;

            // Limit the number of items to display given the slots count for signed in users if enabled for NBC
            if (!user.isAnonymous && isNBCEnabled && NBCSlotCounts?.web) {
                itemsToShow = _items.slice(0, NBCSlotCounts.web);
            }

            return {
                p13n,
                personalizedComponent,
                isPersonalizationInitializing,
                showPersonalizationOverlay,
                nonTargettedVariations,
                items: itemsToShow,
                isTrendingContentEnabled
            };
        }
    ),
    functions
);

const withBannerListProps = wrapHOC(connectedBannerList);

export {
    functions, withBannerListProps
};
