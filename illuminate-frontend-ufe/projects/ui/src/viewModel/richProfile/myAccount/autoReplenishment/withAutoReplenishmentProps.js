import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import subscriptionsSelector from 'selectors/page/autoReplenishment/subscriptions/subscriptionsSelector';
import BeautyInsiderSelector from 'selectors/beautyInsider/beautyInsiderSelector';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import beautyInsiderActions from 'actions/BeautyInsiderActions';
import { userSelector } from 'selectors/user/userSelector';
import cmsDataSelector from 'selectors/page/autoReplenishment/cmsData/cmsDataSelector';
import userUtils from 'utils/User';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import AutoReplenishmentBindings from 'analytics/bindingMethods/pages/myAccount/AutoReplenishmentBindings';

const { wrapHOC } = FrameworkUtils;
const { beautyInsiderSelector } = BeautyInsiderSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/AutoReplenishment/locales', 'AutoReplenishment');
const getTextFreq = getLocaleResourceFile('components/GlobalModals/ManageSubscriptionModal/locales', 'ManageSubscriptionModal');

const fields = createSelector(
    subscriptionsSelector,
    userSelector,
    beautyInsiderSelector,
    cmsDataSelector,
    createStructuredSelector({
        viewMore: getTextFromResource(getText, 'viewMore'),
        viewMoreSubscriptions: getTextFromResource(getText, 'viewMoreSubscriptions'),
        needHelp: getTextFromResource(getText, 'needHelp'),
        viewFAQ: getTextFromResource(getText, 'viewFAQ'),
        deliveryFrequency: getTextFromResource(getTextFreq, 'deliveryFrequency'),
        autoReplenishSummary: getTextFromResource(getTextFreq, 'autoReplenishSummary'),
        activeText: getTextFromResource(getTextFreq, 'active'),
        pausedText: getTextFromResource(getTextFreq, 'paused'),
        canceledText: getTextFromResource(getText, 'canceled'),
        viewShipments: getTextFromResource(getTextFreq, 'viewShipments'),
        biPointsEarned: getTextFromResource(getTextFreq, 'biPointsEarned'),
        totalSaving: getTextFromResource(getTextFreq, 'totalSaving'),
        points: getTextFromResource(getTextFreq, 'points'),
        rateOf: getTextFromResource(getText, 'rateOf', ['{0}']),
        canceledSubscriptionsHeading: getTextFromResource(getText, 'canceledSubscriptionsHeading'),
        canceledSubscriptionsSubheading: getTextFromResource(getText, 'canceledSubscriptionsSubheading'),
        headerItem: getTextFromResource(getText, 'headerItem'),
        headerPrice: getTextFromResource(getText, 'headerPrice'),
        activeSubscriptionsCount: getTextFromResource(getText, 'activeSubscriptionsCount', ['{0}', '{1}']),
        pausedSubscriptionsCount: getTextFromResource(getText, 'pausedSubscriptionsCount', ['{0}', '{1}']),
        canceledSubscriptionsCount: getTextFromResource(getText, 'canceledSubscriptionsCount', ['{0}', '{1}'])
    }),
    (allSubscriptions, user, beautyInsider, cmsData, textResources) => {
        const {
            hasNext, active, paused, cancelled, subscriptions, subscriptionList, totalAggregateDiscount
        } = allSubscriptions;
        const { firstName, profileId } = user;
        const biPoints = beautyInsider.summary?.clientSummary?.currentYear?.subscriptionPtsEarned?.value || 0;
        const isLoggedIn = userUtils.isSignedIn();
        const displaySignIn = user.isInitialized && !isLoggedIn;

        return {
            ...textResources,
            hasNext,
            active,
            paused,
            cancelled,
            subscriptions,
            subscriptionList,
            cmsData,
            totalAggregateDiscount,
            firstName,
            profileId,
            isLoggedIn,
            displaySignIn,
            biPoints
        };
    }
);

const functions = {
    loadSubscriptions: AutoReplenishmentActions.loadSubscriptions,
    updateActiveSubscriptions: AutoReplenishmentActions.updateActiveSubscriptions,
    updatePausedSubscriptions: AutoReplenishmentActions.updatePausedSubscriptions,
    updateCancelledSubscriptions: AutoReplenishmentActions.updateCancelledSubscriptions,
    openFAQModal: AutoReplenishmentActions.openFAQModal,
    unsubscribeAutoReplenishment: AutoReplenishmentActions.unsubscribeAutoReplenishment,
    pauseAutoReplenishment: AutoReplenishmentActions.pauseAutoReplenishment,
    skipAutoReplenishment: AutoReplenishmentActions.skipAutoReplenishment,
    getItSoonerAutoReplenishment: AutoReplenishmentActions.getItSoonerAutoReplenishment,
    openConfirmUnsubscribeModal: AutoReplenishmentActions.openConfirmUnsubscribeModal,
    openConfirmPausedSubscriptionModal: AutoReplenishmentActions.openConfirmPausedSubscriptionModal,
    updateAutoReplenishmentSubscription: AutoReplenishmentActions.updateAutoReplenishmentSubscription,
    fetchClientSummary: beautyInsiderActions.fetchClientSummary,
    removeCreditCard: AutoReplenishmentActions.removeCreditCard,
    setDefaultCCOnProfileAndDelete: AutoReplenishmentActions.setDefaultCCOnProfileAndDelete,
    resumeAutoReplenishment: AutoReplenishmentActions.resumeAutoReplenishment,
    manageUnsubscribe: AutoReplenishmentBindings.manageUnsubscribe,
    pauseConfirmation: AutoReplenishmentBindings.pauseConfirmation,
    closeGetItSooner: AutoReplenishmentBindings.closeGetItSooner,
    unsubscribeModalClose: AutoReplenishmentBindings.unsubscribeModalClose,
    skipModalClose: AutoReplenishmentBindings.skipModalClose,
    resumeModalConfirm: AutoReplenishmentBindings.resumeModalConfirm,
    addCardModalClose: AutoReplenishmentBindings.addCardModalClose,
    skipConfirmation: AutoReplenishmentBindings.skipConfirmation,
    loadMoreTracking: AutoReplenishmentBindings.loadMore,
    loadContentfulContent: AutoReplenishmentActions.loadContentfulContent
};

const withAutoReplenishmentProps = wrapHOC(connect(fields, functions));

export {
    withAutoReplenishmentProps, fields, functions
};
