import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import LanguageLocale from 'utils/LanguageLocale';
const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/ShopYourStore/SDUBanner/locales', 'SDUBanner');

import ShopSameDayActions from 'actions/HappeningShopSameDayActions';

import { shopSameDaySelector } from 'selectors/page/shopSameDay/shopSameDaySelector';

const localizationSelector = createStructuredSelector({
    tryNowForFree: getTextFromResource(getText, 'tryNowForFree'),
    getFreeSameDayDelivery: getTextFromResource(getText, 'getFreeSameDayDelivery'),
    startSaving: getTextFromResource(getText, 'startSaving')
});

const fields = createSelector(localizationSelector, shopSameDaySelector, (localization, shopSameDay) => {
    return {
        localization,
        isSDULandingPageModalOpen: shopSameDay.isSDULandingPageModalOpen
    };
});

const functions = {
    showSDULandingPageModal: (isOpen = true) => ShopSameDayActions.showSDULandingPageModal({ isOpen })
};

const withSDUBannerProps = wrapHOC(connect(fields, functions));

export {
    fields, withSDUBannerProps
};
