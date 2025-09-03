import { createSelector } from 'reselect';
import localeUtils from 'utils/LanguageLocale';
import { showShopYourStoreAbTestSelector } from 'viewModel/selectors/testTarget/showShopYourStoreAbTestSelector';

const isShopYourStoreEnabledSelector = createSelector(showShopYourStoreAbTestSelector, showShopYourStoreAbTest => {
    const country = localeUtils.getCurrentCountry();
    const killswitchName = 'isShopYourStoreEnabled' + country;
    const globalKillswitch = Sephora.configurationSettings[killswitchName] === true;
    const isShopYourStoreEnabled = globalKillswitch && showShopYourStoreAbTest;

    return isShopYourStoreEnabled;
});

export { isShopYourStoreEnabledSelector };
