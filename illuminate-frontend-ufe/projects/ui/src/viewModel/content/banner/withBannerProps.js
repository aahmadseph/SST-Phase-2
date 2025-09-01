import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Empty from 'constants/empty';
import FrameworkUtils from 'utils/framework';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import cookieUtils from 'utils/Cookies';
import PersonalizationUtils from 'utils/Personalization';
import P13nUtils from 'utils/localStorage/P13n';
import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';

import constants from 'constants/content';
import anaConsts from 'analytics/constants';

const {
    BANNER_TYPES: { PERSISTENT, DEFAULT }
} = constants;

const {
    COMPONENT_TYPES: { BANNER }
} = constants;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const triggerImpression = function (banner) {
    const eventName = IMPRESSION;
    const bannerType = banner?.variationData?.bannerType || banner?.bannerType;
    const component = bannerType === PERSISTENT ? PERSISTENT : BANNER;

    sendCmsComponentEvent({
        items: [banner],
        eventName,
        sid: '',
        component,
        eventOriginComponent: 'withBannerProps'
    });
};

const triggerClick = async function (banner) {
    const { sid: componentSid, variationData } = banner;

    const eventName = ITEM_CLICK;

    const bannerType = banner?.variationData?.bannerType || banner?.bannerType;
    const component = bannerType !== DEFAULT ? PERSISTENT : BANNER;

    await sendCmsComponentEvent({
        items: [variationData],
        eventName,
        sid: '',
        componentSid,
        component
    });
};

const { getPersonalizedComponent, checkDataToDisplay } = PersonalizationUtils;
const { setPersonalizationCache } = P13nUtils;
const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    p13nSelector,
    coreUserDataSelector,
    (_state, ownProps) => ownProps.personalization,
    (_state, ownProps) => ownProps.nonTargettedVariations,
    (_state, ownProps) => ownProps.nonTargettedPreviewIndex,
    (p13n, user, personalization, nonTargettedVariations, nonTargettedPreviewIndex) => {
        let personalizedComponent = Empty.Array;
        let activePage = -1;

        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);
            const activeVariation = p13n.activeVariations?.[personalization?.context];

            if (prvCookie && p13n.variations && p13n.activeVariations && activeVariation) {
                const variation = p13n.variations?.[personalization?.context]?.find(item => item?.sys?.id === activeVariation);
                personalizedComponent = {
                    variationData: variation
                };
                activePage = p13n.variations?.[personalization?.context]?.findIndex(item => item?.sys?.id === activeVariation);
                activePage = activePage + (nonTargettedVariations?.length || 0);
            } else if (prvCookie && p13n.data?.length > 0) {
                personalizedComponent = p13n.data.find(item => item.context === personalization?.context) || Empty.Array;
            } else if (p13n.headData?.length) {
                setPersonalizationCache(p13n.headData);
                const headItemData = p13n.headData.find(item => (item.p13n?.context || item.context) === personalization?.context);
                personalizedComponent = checkDataToDisplay(headItemData, personalization);
            } else if (user.isAnonymous) {
                personalizedComponent = Empty.Array;
            } else {
                personalizedComponent = getPersonalizedComponent(personalization, user, p13n, true);
            }
        }

        if (nonTargettedPreviewIndex > -1) {
            activePage = nonTargettedPreviewIndex;
        }

        return {
            p13n,
            user,
            personalizedComponent,
            triggerImpression,
            triggerClick,
            activePage: nonTargettedPreviewIndex > -1 ? activePage : activePage + 1
        };
    }
);

const withBannerProps = wrapHOC(connect(fields));

export {
    withBannerProps, fields
};
