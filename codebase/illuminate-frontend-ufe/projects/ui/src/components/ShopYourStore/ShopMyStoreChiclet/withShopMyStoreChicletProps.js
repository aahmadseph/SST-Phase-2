import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import Location from 'utils/Location';
import LanguageLocale from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/ShopYourStore/ShopMyStoreChiclet/locales', 'ShopMyStoreChiclet');

import ShopMyStoreActions from 'actions/HappeningShopMyStoreActions';

import { isShopYourStoreEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreEnabledSelector';
import { userSelector } from 'selectors/user/userSelector';

const localizationSelector = createStructuredSelector({
    shop: getTextFromResource(getText, 'shop'),
    myStore: getTextFromResource(getText, 'myStore')
});

const fields = createSelector(localizationSelector, userSelector, isShopYourStoreEnabledSelector, (localization, user, isShopYourStoreEnabled) => {
    const isHomepage = Location.isHomepage();
    const shouldRender = isHomepage && isShopYourStoreEnabled;
    const hasPreferredStore = !!user.preferredStore;

    return {
        localization,
        hasPreferredStore,
        shouldRender
    };
});

const functions = {
    showStoreSwitcherModal: ShopMyStoreActions.showStoreSwitcherModal
};

const withShopMyStoreChicletProps = wrapHOC(connect(fields, functions));

export {
    fields, withShopMyStoreChicletProps
};
