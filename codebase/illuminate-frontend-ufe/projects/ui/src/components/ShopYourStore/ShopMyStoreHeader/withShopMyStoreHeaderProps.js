import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import storeUtils from 'utils/Store';
import LanguageLocale from 'utils/LanguageLocale';
import { STORE } from 'constants/Shared';
import ContentConstants from 'constants/content';
const { RENDERING_TYPE } = ContentConstants;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocale;
const getText = getLocaleResourceFile('components/ShopYourStore/ShopMyStoreHeader/locales', 'ShopMyStoreHeader');

import ShopMyStoreActions from 'actions/HappeningShopMyStoreActions';

import { shopMyStoreSelector } from 'selectors/page/shopMyStore/shopMyStoreSelector';

const localizationSelector = createStructuredSelector({
    shop: getTextFromResource(getText, 'shop'),
    openUntil: () => vars => getTextFromResource(getText, 'openUntil', vars)(),
    closed: getTextFromResource(getText, 'closed'),
    storeDetails: getTextFromResource(getText, 'storeDetails'),
    findAStore: getTextFromResource(getText, 'findAStore'),
    servicesAndEvents: getTextFromResource(getText, 'servicesAndEvents')
});

const fields = createSelector(localizationSelector, shopMyStoreSelector, (localization, shopMyStore) => {
    const { data } = shopMyStore;
    const storeDetails = data?.storeDetails || {};
    const storeName = storeDetails.displayName || '';
    const closingTime = storeUtils.getStoreTodayClosingTime(storeDetails.storeHours)?.replace(/^0/, '');
    const isStoreClosed = !closingTime || closingTime === STORE.CLOSED;
    const storeClosingTime = isStoreClosed ? localization.closed : localization.openUntil([closingTime]);
    const pickupMessage = storeDetails.pickupMessage;
    const targetUrl = storeDetails.targetUrl;
    const isBopisable = storeDetails.isBopisable;
    const content = data?.content?.layout?.content;
    const contentfulHeader = content?.find(section => section.renderingType === RENDERING_TYPE.HAPPENING_SHOP_MY_STORE);
    const bannerImageSrc = (contentfulHeader?.items || [])[0]?.largeMedia?.src;

    const shoppingOptions = [
        {
            available: !!storeDetails.isBopisable,
            translationKey: 'inStorePickup'
        },
        {
            available: !!storeDetails.isCurbsideEnabled,
            translationKey: 'curbsidePickup'
        },
        {
            available: !!storeDetails.isBeautyServicesEnabled,
            translationKey: 'beautyServices'
        },
        {
            available: !!storeDetails.isStoreEventsEnabled,
            translationKey: 'storeEvents'
        }
    ];

    const hasShoppingOptions = shoppingOptions.some(option => option.available);

    return {
        localization,
        storeName,
        storeClosingTime,
        isStoreClosed,
        isBopisable,
        pickupMessage,
        shoppingOptions,
        hasShoppingOptions,
        bannerImageSrc,
        targetUrl
    };
});

const functions = {
    showStoreSwitcherModal: () => ShopMyStoreActions.showStoreSwitcherModal('section header')
};

const withShopMyStoreHeaderProps = wrapHOC(connect(fields, functions));

export {
    fields, withShopMyStoreHeaderProps
};
