import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import addressUtils from 'utils/Address';
import Empty from 'constants/empty';
import LanguageLocale from 'utils/LanguageLocale';
import ContentConstants from 'constants/content';
const { RENDERING_TYPE } = ContentConstants;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/ShopYourStore/ShopSameDayHeader/locales', 'ShopSameDayHeader');

import ShopSameDayActions from 'actions/HappeningShopSameDayActions';

import { shopSameDaySelector } from 'selectors/page/shopSameDay/shopSameDaySelector';
import { isUserSDUTrialEligibleSelector } from 'viewModel/selectors/user/isUserSDUTrialEligibleSelector';
import { isSDUAddedToBasketSelector } from 'viewModel/selectors/basket/isSDUAddedToBasketSelector';

const localizationSelector = createStructuredSelector({
    shopSdd: getTextFromResource(getText, 'shopSdd'),
    notAvailableForZipCode: () => vars => getTextFromResource(getText, 'notAvailableForZipCode', vars)(),
    checkAnotherLocation: getTextFromResource(getText, 'checkAnotherLocation')
});

const fields = createSelector(
    localizationSelector,
    shopSameDaySelector,
    isUserSDUTrialEligibleSelector,
    isSDUAddedToBasketSelector,
    (localization, shopSameDay, isUserSDUTrialEligible, isSDUAddedToBasket) => {
        const sameDay = shopSameDay?.data?.sameDay || Empty.Object;
        const zipCode = addressUtils.formatZipCode(sameDay.zipCode);
        const deliveryTitle = sameDay.deliveryTitle || `${localization.shopSdd}: ${zipCode}`;
        const deliveryMessage = sameDay.deliveryMessage;
        const sameDayAvailable = sameDay.sameDayAvailable;
        const notAvailableForZipCode = localization.notAvailableForZipCode([zipCode]);
        const showSDUBanner = (!sameDay.isSDUApplied || isUserSDUTrialEligible) && !isSDUAddedToBasket && sameDayAvailable;
        const content = shopSameDay?.data?.content?.layout?.content;
        const contentfulHeader = content?.find(section => section.renderingType === RENDERING_TYPE.HAPPENING_SHOP_SAME_DAY);
        const bannerImageSrc = (contentfulHeader?.items || [])[0]?.largeMedia?.src;

        return {
            localization,
            zipCode,
            deliveryTitle,
            deliveryMessage,
            sameDayAvailable,
            notAvailableForZipCode,
            showSDUBanner,
            bannerImageSrc,
            isUserSDUTrialEligible,
            isSDUAddedToBasket
        };
    }
);

const functions = {
    showShippingDeliveryLocationModal: () => ShopSameDayActions.showShippingDeliveryLocationModal('section header')
};

const withShopSameDayHeaderProps = wrapHOC(connect(fields, functions));

export {
    fields, withShopSameDayHeaderProps
};
