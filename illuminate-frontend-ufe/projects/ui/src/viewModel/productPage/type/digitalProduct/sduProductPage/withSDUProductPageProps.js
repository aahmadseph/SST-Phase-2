import { connect } from 'react-redux';
import ContentSelector from 'selectors/page/sameDayUnlimited/bccContent/content/contentSelector';
import { createStructuredSelector, createSelector } from 'reselect';
import Actions from 'Actions';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { userSelector } from 'selectors/user/userSelector';
import SameDayUnlimitedActions from 'actions/SameDayUnlimitedActions';
import basketSelector from 'selectors/basket/basketSelector';
import basketConstants from 'constants/Basket';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import CurrentProductUserSpecificDetailsSelector from 'selectors/page/product/currentProductUserSpecificDetails/currentProductUserSpecificDetailsSelector';
import BCCUtils from 'utils/BCC';
import analyticsConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';

const { currentProductUserSpecificDetailsSelector } = CurrentProductUserSpecificDetailsSelector;
const { MEDIA_IDS } = BCCUtils;
const { wrapHOC } = FrameworkUtils;
const { contentSelector } = ContentSelector;
const { getLocaleResourceFile, getTextFromResource, isUS } = LanguageLocaleUtils;
const { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA } = MEDIA_IDS;
const getText = getLocaleResourceFile('components/GlobalModals/SDULandingPageModal/locales', 'SDULandingPageModal');

const fields = createSelector(
    userSelector,
    basketSelector,
    contentSelector,
    currentProductUserSpecificDetailsSelector,
    createStructuredSelector({
        title: getTextFromResource(getText, 'title'),
        subscribeToSephora: getTextFromResource(getText, 'subscribeToSephora'),
        subHeader: getTextFromResource(getText, 'subHeader'),
        free30DayTrial: getTextFromResource(getText, 'free30DayTrial'),
        then: getTextFromResource(getText, 'then'),
        annually: getTextFromResource(getText, 'annually'),
        regionalAvailability: getTextFromResource(getText, 'regionalAvailability'),
        addTrialToBasket: getTextFromResource(getText, 'addTrialToBasket'),
        addSubscriptionToBasket: getTextFromResource(getText, 'addSubscriptionToBasket'),
        sameDayUnlimited: getTextFromResource(getText, 'sameDayUnlimited'),
        trial: getTextFromResource(getText, 'trial'),
        subscription: getTextFromResource(getText, 'subscription'),
        alreadyAddedToBasket: getTextFromResource(getText, 'alreadyAddedToBasket'),
        joinForOnly: getTextFromResource(getText, 'joinForOnly'),
        viewBasket: getTextFromResource(getText, 'viewBasket'),
        hasBeenAdded: getTextFromResource(getText, 'hasBeenAdded'),
        activateSubscription: getTextFromResource(getText, 'activateSubscription'),
        activateYour: getTextFromResource(getText, 'activateYour'),
        free30day: getTextFromResource(getText, 'free30day'),
        andSave: getTextFromResource(getText, 'andSave')
    }),
    (user, basket, content, currentProductUserSpecificDetails, textResources) => {
        const { SDUProduct } = basket;
        const { isSDUAddedToBasket } = SDUProduct || {};
        const SDUSku = 'P483900';
        const SM_IMG_SIZE = 50;
        const {
            annually,
            trial,
            subscription,
            alreadyAddedToBasket,
            hasBeenAdded,
            activateSubscription,
            activateYour,
            free30day,
            andSave,
            ...restTextResources
        } = textResources;
        const SDUDetails = currentProductUserSpecificDetails.currentSku || {};
        const isCanada = !isUS();
        const savingsText = `${annually}*`;
        const mediaId = isCanada ? SAME_DAY_UNLIMITED_MODAL_CA : SAME_DAY_UNLIMITED_MODAL_US;
        const { BasketType } = basketConstants;
        const basketType = BasketType.Standard;
        const isUserSDUInactive = user?.userSubscriptions?.length > 0 && user?.userSubscriptions[0].status?.startsWith('INACTIVE');
        const isUserTrialEligible = userUtils.isAnonymous() || (isUserSDUInactive && user?.userSubscriptions[0].isTrialEligible);
        const isUserSDUActive = !isUserSDUInactive && !userUtils.isAnonymous();
        const alreadyAddedText = isUserTrialEligible ? `${trial} ${alreadyAddedToBasket}` : `${subscription} ${alreadyAddedToBasket}`;
        const redirectToBasket = () => {
            urlUtils.redirectTo('/basket');
        };
        const redirectToSDUHub = () => {
            urlUtils.redirectTo('/profile/MyAccount/SameDayUnlimited');
        };
        const { isSamedayUnlimitedEnabled } = Sephora.configurationSettings;

        const fireAnalytics = skuId => {
            processEvent.process(analyticsConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageType: analyticsConsts.PAGE_TYPES.PRODUCT,
                    pageName: `${analyticsConsts.PAGE_TYPES.PRODUCT}:${SDUSku}:n/a:*`,
                    eventStrings: [analyticsConsts.Event.PROD_VIEW, analyticsConsts.Event.PRODUCT_VIEW, analyticsConsts.Event.PRODUCT_PAGE_VIEW],
                    productStrings: `;${skuId};;;;eVar26=${skuId}`
                }
            });
        };

        return {
            ...restTextResources,
            SDUDetails,
            isSDUAddedToBasket,
            isUserSDUActive,
            isCanada,
            mediaId,
            SM_IMG_SIZE,
            savingsText,
            alreadyAddedText,
            basketType,
            isUserTrialEligible,
            bccComps: content,
            isSamedayUnlimitedEnabled,
            redirectToBasket,
            redirectToSDUHub,
            fireAnalytics
        };
    }
);

const functions = {
    loadBCCContent: SameDayUnlimitedActions.loadBCCContent,
    showShippingDeliveryLocationModal: Actions.showShippingDeliveryLocationModal,
    addSDUToBasket: SameDayUnlimitedActions.addSDUToBasket
};

const withSDUProductPageProps = wrapHOC(connect(fields, functions));

export {
    withSDUProductPageProps, fields
};
