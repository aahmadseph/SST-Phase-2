import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { userSelector } from 'selectors/user/userSelector';
import { bottomNavigationSelector } from 'selectors/page/headerFooterTemplate/data/bottomNavigationSelector/bottomNavigationSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Header/locales', 'Header');

import { isShopYourStoreEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreEnabledSelector';

export default connect(
    createSelector(
        userSelector,
        createStructuredSelector({
            tooltip: getTextFromResource(getText, 'tooltip'),
            shop: getTextFromResource(getText, 'shop'),
            community: getTextFromResource(getText, 'community'),
            store: getTextFromResource(getText, 'store'),
            offers: getTextFromResource(getText, 'offers'),
            home: getTextFromResource(getText, 'home'),
            me: getTextFromResource(getText, 'me'),
            myStore: getTextFromResource(getText, 'myStore')
        }),
        isShopYourStoreEnabledSelector,
        bottomNavigationSelector,
        (user, localization, isShopYourStoreEnabled, bottomNavHidden, showDynamicBottomNav, bottomNavigation) => {
            const isUserReady = user.isInitialized;

            return {
                user,
                isUserReady,
                isAnonymous: isUserReady && userUtils.isAnonymous(),
                localization,
                isShopYourStoreEnabled,
                bottomNavigation
            };
        }
    )
);
