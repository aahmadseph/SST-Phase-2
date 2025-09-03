import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import ContentSelector from 'selectors/page/sameDayUnlimited/bccContent/content/contentSelector';
import ShippingAndPaymentInfoSelector from 'selectors/page/autoReplenishment/shippingAndPaymentInfo/shippingAndPaymentInfoSelector';
import sduSubscriptionsSelector from 'selectors/page/sameDayUnlimited/sduSubscriptionsSelector';
import dateUtils from 'utils/Date';
import userUtils from 'utils/User';
import FrameworkUtils from 'utils/framework';
import AutoReplenishmentActions from 'actions/AutoReplenishmentActions';
import SameDayUnlimitedActions from 'actions/SameDayUnlimitedActions';
import LanguageUtils from 'utils/LanguageLocale';
import BCCUtils from 'utils/BCC';

const { MEDIA_IDS } = BCCUtils;
const { wrapHOC } = FrameworkUtils;
const { contentSelector } = ContentSelector;
const { shippingAndPaymentInfoSelector } = ShippingAndPaymentInfoSelector;
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageUtils;
const { SAME_DAY_UNLIMITED_US, SAME_DAY_UNLIMITED_CA } = MEDIA_IDS;
const getText = getLocaleResourceFile('components/RichProfile/MyAccount/Subscriptions/SameDayUnlimited/locales', 'SameDayUnlimited');

const fields = createSelector(
    contentSelector,
    userSelector,
    shippingAndPaymentInfoSelector,
    sduSubscriptionsSelector,
    createStructuredSelector({
        sameDayUnlimited: getTextFromResource(getText, 'sameDayUnlimited'),
        memberSince: getTextFromResource(getText, 'memberSince'),
        annually: getTextFromResource(getText, 'annually'),
        cancelSubscription: getTextFromResource(getText, 'cancelSubscription'),
        paymentMethod: getTextFromResource(getText, 'paymentMethod'),
        edit: getTextFromResource(getText, 'edit'),
        renews: getTextFromResource(getText, 'renews'),
        paymentBegins: getTextFromResource(getText, 'paymentBegins'),
        membershipPerks: getTextFromResource(getText, 'membershipPerks'),
        subscriptionCanceled: getTextFromResource(getText, 'subscriptionCanceled'),
        canceled: getTextFromResource(getText, 'canceled'),
        expiresOn: getTextFromResource(getText, 'expiresOn'),
        sduSavingsCA: getTextFromResource(getText, 'sduSavingsCA'),
        sduSavingsUS: getTextFromResource(getText, 'sduSavingsUS')
    }),
    (content, user, shippingAndPaymentData, SDUSubscription, textResources) => {
        const userSubscription = user.userSubscriptions?.filter(subscription => subscription.type === 'SDU')[0];
        const SDUActiveStatuses = ['ACTIVE', 'ACTIVE_TRIAL'];
        const SDUInactiveMemberStatus = 'ACTIVE_NO_RENEWAL';
        const isUserSDUActive = SDUActiveStatuses.indexOf(userSubscription?.status) !== -1;
        const isTrialMember = SDUSubscription?.status === SDUActiveStatuses[1];
        const isMemberInactive = SDUSubscription?.status === SDUInactiveMemberStatus;
        const SDUUrl = '/product/subscription-same-day-unlimited-P483900';
        const sduLogo = '/img/ufe/icons/same-day-unlimited.svg';
        const isLoggedIn = userUtils.isSignedIn();
        const displaySignIn = user.isInitialized && !isLoggedIn;

        const {
            memberSince,
            renews,
            paymentBegins,
            annually,
            subscriptionCanceled,
            canceled,
            expiresOn,
            sduSavingsCA,
            sduSavingsUS,
            ...restTextResources
        } = textResources;
        const { isModifiable } = SDUSubscription;
        const memberSinceDate = dateUtils.getDateInMMDDYYYYShortMonth(SDUSubscription.createdDate) || '';
        const memberSinceText = isMemberInactive ? subscriptionCanceled : `${memberSince} ${memberSinceDate}`;
        const SDUPrice = (SDUSubscription.items && SDUSubscription.items[0].price) || '';
        const sduSavings = isCanada() ? sduSavingsCA : sduSavingsUS;
        const SDUPriceText = isMemberInactive ? canceled : `${SDUPrice} ${annually}`;
        const renewDate = (SDUSubscription && dateUtils.getDateInMMDDYYYYShortMonth(SDUSubscription.subscriptionEndDate)) || '';

        const renewsText = isMemberInactive
            ? `${expiresOn} ${renewDate}`
            : isTrialMember
                ? `${paymentBegins} ${renewDate}`
                : `${renews} ${renewDate}`;
        const mediaId = isCanada() ? SAME_DAY_UNLIMITED_CA : SAME_DAY_UNLIMITED_US;
        const currentCardInfo = Object.keys(shippingAndPaymentData).length > 0;
        const creditCardName = currentCardInfo && shippingAndPaymentData?.payment?.cardType;
        const creditCardToken = currentCardInfo && shippingAndPaymentData?.payment?.cardTokenNumber;
        const { autoReplenishmentConfigurations } = Sephora.configurationSettings || {};
        const { enableReplenishmentPaymentModifiable = false } = autoReplenishmentConfigurations;

        return {
            ...restTextResources,
            memberSinceText,
            sduLogo,
            isLoggedIn,
            displaySignIn,
            SDUSubscription,
            isUserSDUActive,
            isMemberInactive,
            isTrialMember,
            SDUUrl,
            SDUPriceText,
            sduSavings,
            SDUPrice,
            renewDate,
            renewsText,
            creditCardName,
            creditCardToken,
            isModifiable,
            enableReplenishmentPaymentModifiable,
            bccComps: content,
            mediaId,
            user
        };
    }
);

const functions = {
    loadBCCContent: SameDayUnlimitedActions.loadBCCContent,
    loadSDUSubscription: SameDayUnlimitedActions.loadSDUSubscription,
    loadShippingAndPaymentInfo: AutoReplenishmentActions.loadShippingAndPaymentInfo,
    removeCreditCard: AutoReplenishmentActions.removeCreditCard,
    setDefaultCCOnProfileAndDelete: AutoReplenishmentActions.setDefaultCCOnProfileAndDelete,
    cancelSubscriptionAction: SameDayUnlimitedActions.cancelSubscription,
    displayGenericErrorModalAction: SameDayUnlimitedActions.displayGenericErrorModal
};

const withSameDayUnlimitedProps = wrapHOC(connect(fields, functions));

export {
    withSameDayUnlimitedProps, fields, functions
};
