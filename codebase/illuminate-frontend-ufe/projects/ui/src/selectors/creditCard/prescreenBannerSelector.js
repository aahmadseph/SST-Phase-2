/* eslint-disable complexity */
import { createSelector } from 'reselect';

import Empty from 'constants/empty';
import cookieUtils from 'utils/Cookies';
import P13nUtils from 'utils/localStorage/P13n';
import PersonalizationUtils from 'utils/Personalization';
import userUtils from 'utils/User';
import { headerFooterTemplateSelector } from 'selectors/page/headerFooterTemplate/headerFooterTemplateSelector';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { pageSelector } from 'selectors/page/pageSelector';
import { creditCardSelector } from 'selectors/creditCard/creditCardSelector';
import rwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import store from 'store/Store';
import RCPSCookies from 'utils/RCPSCookies';

const { getPersonalizedComponent, checkDataToDisplay } = PersonalizationUtils;
const { setPersonalizationCache, setPersonalizationPlaceholder, filteredCache } = P13nUtils;

const prescreenBannerSelector = createSelector(
    p13nSelector,
    coreUserDataSelector,
    headerFooterTemplateSelector,
    pageSelector,
    creditCardSelector,
    (_state, ownProps) => ownProps.source,
    (p13n, user, headerFooterTemplate, page, creditCard, source) => {
        let personalizedComponent = Empty.Array;
        let personalization = null;

        if (!RCPSCookies.isRCPSCCAP()) {
            return personalizedComponent;
        }

        const headerFooterTemplateData = headerFooterTemplate?.data;

        switch (source) {
            case 'inline':
                if (headerFooterTemplateData && headerFooterTemplateData?.inlineBasket?.length > 0) {
                    // First item in inlineBasket is the prescreen banner
                    personalization = headerFooterTemplateData.inlineBasket[0]?.personalization;
                    personalizedComponent = headerFooterTemplateData.inlineBasket[0];
                }

                break;
            case 'basket':
                if (page.basketPage && page.basketPage?.checkoutCcBanner) {
                    personalization = page.basketPage.checkoutCcBanner?.personalization;
                    personalizedComponent = page.basketPage.checkoutCcBanner;
                }

                break;
            case 'checkout':
                if (creditCard?.ccBanner) {
                    personalization = creditCard.ccBanner?.personalization;
                    personalizedComponent = creditCard.ccBanner;
                }

                break;
            default:
                break;
        }

        if (userUtils.isSignedIn() && personalization) {
            const filteredItem = filteredCache(personalization);

            if (filteredItem && user?.userId && user?.biId) {
                setPersonalizationPlaceholder(personalization.context);
                store.dispatch(rwdBasketActions.getPersonalizedComponents(personalization, user));
            }

            if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
                const prvCookie = cookieUtils.read(cookieUtils.KEYS.P13N_PRV);

                if (prvCookie && p13n.data?.length > 0) {
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

            return personalizedComponent?.variationData;
        }

        return personalizedComponent;
    }
);

export { prescreenBannerSelector };
