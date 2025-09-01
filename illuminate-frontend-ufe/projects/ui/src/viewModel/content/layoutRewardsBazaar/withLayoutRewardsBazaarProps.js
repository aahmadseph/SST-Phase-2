import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import { authSelector } from 'selectors/auth/authSelector';
import basketSelector from 'selectors/basket/basketSelector';
import BeautyInsiderSelector from 'selectors/beautyInsider/beautyInsiderSelector';
import { isOmniRewardEnabledSelector } from 'viewModel/selectors/basket/isOmniRewardEnabled/isOmniRewardEnabledSelector';
import userUtils from 'utils/User';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import RewardsBazaarPageBindings from 'analytics/bindingMethods/pages/rewardsBazaar/rewardsBazaarPageBindings';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const { wrapHOC } = FrameworkUtils;
const { beautyInsiderSelector } = BeautyInsiderSelector;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { fireLinkTrackingAnalytics } = RewardsBazaarPageBindings;

const getText = getLocaleResourceFile('components/Content/ContentLayout/LayoutRewardsBazaar/locales', 'LayoutRewardsBazaar');

const localization = createStructuredSelector({
    addFullSize: getTextFromResource(getText, 'addFullSize'),
    addToBasket: getTextFromResource(getText, 'addToBasket'),
    addToBasketShort: getTextFromResource(getText, 'addToBasketShort'),
    remove: getTextFromResource(getText, 'remove'),
    signInToAccess: getTextFromResource(getText, 'signInToAccess'),
    allRewards: getTextFromResource(getText, 'allRewards'),
    exclusive: getTextFromResource(getText, 'exclusive'),
    omniRewardsNotice: getTextFromResource(getText, 'omniRewardsNotice')
});

const fields = createSelector(
    userSelector,
    authSelector,
    basketSelector,
    beautyInsiderSelector,
    isOmniRewardEnabledSelector,
    localization,
    (user, auth, basket, beautyInsider, isOmniRewardEnabled, locale) => {
        const showOmniRewardsNotice = isOmniRewardEnabled && basket.rewards?.length === 0;
        const isAccessTokenPresent = !!Storage.local.getItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);

        return {
            isAnonymous: user.isInitialized && userUtils.isAnonymous(),
            isBI: userUtils.isBI(),
            isUserAtleastRecognized: userUtils.isUserAtleastRecognized(),
            user,
            auth,
            basket,
            beautyInsider,
            localization: locale,
            showOmniRewardsNotice,
            isAccessTokenPresent
        };
    }
);

const functions = {
    fireLinkTrackingAnalytics
};

const withLayoutRewardsBazaarProps = wrapHOC(connect(fields, functions));

export {
    withLayoutRewardsBazaarProps, fields, functions
};
