import userUtils from 'utils/User';
import P13nUtils from 'utils/localStorage/P13n';
import store from 'store/Store';
import rwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import cookieUtils from 'utils/Cookies';
import { BASKET_RENDERING_TYPE } from 'constants/RwdBasket';
import PersonalizationUtils from 'utils/Personalization';

const { getPersonalizedComponent, checkDataToDisplay } = PersonalizationUtils;
const { setPersonalizationCache, setPersonalizationPlaceholder, filteredCache } = P13nUtils;

import RCPSCookies from 'utils/RCPSCookies';

export const checkoutCCBanner = (p13n, user, biBenefitsData) => {
    let ccBanner = [];
    let personalization = null;
    let personalizedComponent = null;

    if (RCPSCookies.isRCPSCCAP()) {
        const biBenefits = biBenefitsData || [];
        const ccRewards = biBenefits.find(biBenefit => biBenefit.renderingType === BASKET_RENDERING_TYPE.CC_BANNER);

        ccBanner = ccRewards?.items;

        if (userUtils.isSignedIn() && ccRewards?.personalization) {
            personalization = ccRewards?.personalization;

            const filteredItem = filteredCache(personalization);

            if (filteredItem && user?.userId && user?.biId) {
                setPersonalizationPlaceholder(personalization.context);
                store.dispatch(rwdBasketActions.getPersonalizedComponents(personalization, user));
            }

            if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
                const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

                if (prvCookie && p13n.data?.length > 0) {
                    personalizedComponent = p13n.data.find(item => item.context === personalization?.context) || null;
                } else if (p13n.headData?.length) {
                    setPersonalizationCache(p13n.headData);
                    const headItemData = p13n.headData.find(item => (item.p13n?.context || item.context) === personalization?.context);
                    personalizedComponent = checkDataToDisplay(headItemData, personalization);
                } else if (user.isAnonymous) {
                    personalizedComponent = null;
                } else {
                    personalizedComponent = getPersonalizedComponent(personalization, user, p13n, true);
                }
            }

            if (personalizedComponent?.variationData?.items?.length) {
                ccBanner = personalizedComponent.variationData.items;
            } else {
                ccBanner = [];
            }
        }
    }

    return ccBanner;
};
