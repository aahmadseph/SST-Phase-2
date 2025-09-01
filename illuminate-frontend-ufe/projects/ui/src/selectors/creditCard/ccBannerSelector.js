/* eslint-disable complexity */
import { createSelector } from 'reselect';
import userUtils from 'utils/User';
import P13nUtils from 'utils/localStorage/P13n';
import BasketPageSelector from 'selectors/page/rwdBasket/basketSelector';
import PersonalizationUtils from 'utils/Personalization';
import rwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import store from 'store/Store';
import cookieUtils from 'utils/Cookies';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';

const { basketPageSelector } = BasketPageSelector;
const { getPersonalizedComponent, checkDataToDisplay } = PersonalizationUtils;
const { setPersonalizationCache, setPersonalizationPlaceholder, filteredCache } = P13nUtils;

import { BASKET_RENDERING_TYPE } from 'constants/RwdBasket';

import RCPSCookies from 'utils/RCPSCookies';

const ccBannerSelector = createSelector(p13nSelector, coreUserDataSelector, basketPageSelector, (p13n, user, basketPage) => {
    let ccBanner = [];
    let personalization = null;
    let personalizedComponent = null;

    if (RCPSCookies.isRCPSCCAP()) {
        const biBenefits = basketPage?.cmsData?.biBenifits || [];
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
});

export default ccBannerSelector;
