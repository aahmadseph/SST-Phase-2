import { createSelector } from 'reselect';
import localeUtils from 'utils/LanguageLocale';

import { showShopYourStoreFiltersAbTestSelector } from 'viewModel/selectors/testTarget/showShopYourStoreFiltersAbTestSelector';

const isShopYourStoreFilterEnabledSelector = createSelector(showShopYourStoreFiltersAbTestSelector, showShopYourStoreFiltersAbTest => {
    const country = localeUtils.getCurrentCountry();
    const killswitchName = 'shopYourStoreFilter' + country;
    const globalKillswitch = Sephora.configurationSettings[killswitchName]?.isEnabled === true;
    const isShopYourStoreFilterEnabled = globalKillswitch && showShopYourStoreFiltersAbTest;

    return isShopYourStoreFilterEnabled;
});

export { isShopYourStoreFilterEnabledSelector };
