import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import actions from 'actions/Actions';
import UserActions from 'actions/UserActions';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';
import BeautyPreferencesSelector from 'selectors/beautyPreferences/beautyPreferencesSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import authenticationUtils from 'utils/Authentication';
import purchaseHistorySelector from 'selectors/purchaseHistory/purchaseHistorySelector';
import { showAccountMenuBuyItAgainSelector } from 'viewModel/selectors/testTarget/showAccountMenuBuyItAgainSelector';
import { showBuyItAgainLogicSelector } from 'viewModel/selectors/testTarget/showBuyItAgainLogicSelector';
import { isShopYourStoreEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreEnabledSelector';
const { beautyPreferencesSelector } = BeautyPreferencesSelector;
const { signOut, getUserFull, fetchPurchaseHistory } = UserActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/AccountMenu/locales', 'AccountMenu');
const { updateProfileStatus } = authenticationUtils;

// Memoized selectors
const localizationSelector = createStructuredSelector({
    greeting: getTextFromResource(getText, 'greeting'),
    signIn: getTextFromResource(getText, 'signIn'),
    signInPrompt: getTextFromResource(getText, 'signInPrompt'),
    biHeading: getTextFromResource(getText, 'biHeading'),
    biDesc: getTextFromResource(getText, 'biDesc'),
    joinNow: getTextFromResource(getText, 'joinNow'),
    rewardsHeading: getTextFromResource(getText, 'rewardsHeading'),
    rewardsDesc: getTextFromResource(getText, 'rewardsDesc'),
    pointsLabel: getTextFromResource(getText, 'pointsLabel'),
    chooseBirthdayGift: getTextFromResource(getText, 'chooseBirthdayGift'),
    ccHeading: getTextFromResource(getText, 'ccHeading'),
    ccDesc: getTextFromResource(getText, 'ccDesc'),
    ccRewardsLabel: getTextFromResource(getText, 'ccRewardsLabel'),
    ccApplyNow: getTextFromResource(getText, 'ccApplyNow'),
    ordersHeading: getTextFromResource(getText, 'ordersHeading'),
    ordersDesc: getTextFromResource(getText, 'ordersDesc'),
    autoReplenishHeading: getTextFromResource(getText, 'autoReplenishHeading'),
    autoReplenishDesc: getTextFromResource(getText, 'autoReplenishDesc'),
    autoReplenishDescWithSubs: getTextFromResource(getText, 'autoReplenishDescWithSubs'),
    purchasesHeading: getTextFromResource(getText, 'purchasesHeading'),
    purchasesDesc: getTextFromResource(getText, 'purchasesDesc'),
    lovesHeading: getTextFromResource(getText, 'lovesHeading'),
    lovesDesc: getTextFromResource(getText, 'lovesDesc'),
    communityHeading: getTextFromResource(getText, 'communityHeading'),
    communityDesc: getTextFromResource(getText, 'communityDesc'),
    myListsHeading: getTextFromResource(getText, 'myListsHeading'),
    myListsDesc: getTextFromResource(getText, 'myListsDesc'),
    recHeading: getTextFromResource(getText, 'recHeading'),
    recDesc: getTextFromResource(getText, 'recDesc'),
    reservationsHeading: getTextFromResource(getText, 'reservationsHeading'),
    reservationsDesc: getTextFromResource(getText, 'reservationsDesc'),
    beautyPrefHeading: getTextFromResource(getText, 'beautyPrefHeading'),
    beautyPrefDesc: getTextFromResource(getText, 'beautyPrefDesc'),
    guidedSellingBeautyPrefDesc: getTextFromResource(getText, 'guidedSellingBeautyPrefDesc'),
    accountHeading: getTextFromResource(getText, 'accountHeading'),
    accountDesc: getTextFromResource(getText, 'accountDesc'),
    signOut: getTextFromResource(getText, 'signOut'),
    sameDayUnlimitedHeading: getTextFromResource(getText, 'sameDayUnlimitedHeading'),
    sameDayUnlimitedMemberDesc: getTextFromResource(getText, 'sameDayUnlimitedMemberDesc'),
    sameDayUnlimitedNonMemberDesc: getTextFromResource(getText, 'sameDayUnlimitedNonMemberDesc'),
    subscribeToday: getTextFromResource(getText, 'subscribeToday'),
    beautyChallenges: getTextFromResource(getText, 'beautyChallenges'),
    new: getTextFromResource(getText, 'new'),
    galleryHeading: getTextFromResource(getText, 'galleryHeading'),
    galleryDesc: getTextFromResource(getText, 'galleryDesc'),
    beautyChallengesDescription: getTextFromResource(getText, 'beautyChallengesDescription'),
    purchasesViewAll: getTextFromResource(getText, 'purchasesViewAll')
});

const mapStateToProps = createSelector(
    localizationSelector,
    userSelector,
    authSelector,
    beautyPreferencesSelector,
    purchaseHistorySelector,
    showAccountMenuBuyItAgainSelector,
    showBuyItAgainLogicSelector,
    isShopYourStoreEnabledSelector,
    (
        localization,
        user,
        auth,
        { profileCompletionPercentage },
        purchaseHistory,
        showAccountMenuBuyItAgain,
        showBuyItAgainLogic,
        isShopYourStoreEnabled
    ) => ({
        localization,
        user,
        auth,
        profileCompletionPercentage,
        purchaseHistory,
        isAccountMenuBuyItAgain: showAccountMenuBuyItAgain,
        showBuyItAgainLogic,
        isShopYourStoreEnabled
    })
);

const mapDispatchToProps = {
    showSignInModal: actions.showSignInModal,
    getUserFull,
    showBiRegisterModal: actions.showBiRegisterModal,
    signOut,
    showRegisterModal: actions.showRegisterModal,
    updateProfileStatus,
    fetchPurchaseHistory
};

export default connect(mapStateToProps, mapDispatchToProps);
