import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import addressUtils from 'utils/Address';
import LanguageLocale from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/Header/locales', 'Header');

import preferredStoreInfoSelector from 'selectors/user/preferredStoreInfoSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
const { preferredZipCodeSelector } = PreferredZipCodeSelector;

const localizationSelector = createStructuredSelector({
    chooseYourStore: getTextFromResource(getText, 'chooseYourStore'),
    chooseYourLocation: getTextFromResource(getText, 'chooseYourLocation'),
    chooseYourStoreAndLocation: getTextFromResource(getText, 'chooseYourStoreAndLocation')
});

const fields = createSelector(
    localizationSelector,
    preferredStoreInfoSelector,
    preferredZipCodeSelector,
    (localization, preferredStoreInfo, preferredZipCode) => {
        const storeName = preferredStoreInfo.displayName;
        const zipCode = addressUtils.formatZipCode(preferredZipCode);
        let storeNameAndZipCode = '';

        if (storeName && zipCode) {
            storeNameAndZipCode = `${storeName} • ${zipCode}`;
        } else if (storeName) {
            storeNameAndZipCode = `${storeName} • ${localization.chooseYourLocation}`;
        } else if (zipCode) {
            storeNameAndZipCode = `${localization.chooseYourStore} • ${zipCode}`;
        } else {
            storeNameAndZipCode = localization.chooseYourStoreAndLocation;
        }

        return {
            storeNameAndZipCode
        };
    }
);

const withPreferredStoreAndZipCodeProps = wrapHOC(connect(fields));

export {
    fields, withPreferredStoreAndZipCodeProps
};
