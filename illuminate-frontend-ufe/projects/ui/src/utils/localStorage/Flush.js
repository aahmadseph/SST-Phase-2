import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

function flushUser() {
    Storage.local.removeItem(LOCAL_STORAGE.USER_DATA);
    Storage.local.removeItem(LOCAL_STORAGE.CREDIT_CARD_REALTIME_PRESCREEN);
    Storage.local.removeItem(LOCAL_STORAGE.CREDIT_CARD_TARGETERS);
    Storage.local.removeItem(LOCAL_STORAGE.JWT_AUTH_TOKEN);
}

function flushAuthTokens() {
    Storage.local.removeItem(LOCAL_STORAGE.AUTH_ACCESS_TOKEN);
    Storage.local.removeItem(LOCAL_STORAGE.AUTH_REFRESH_TOKEN);
    Storage.local.removeItem(LOCAL_STORAGE.USER_EMAIL);
    Storage.local.removeItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);
    Storage.local.removeItem(LOCAL_STORAGE.PROFILE_SECURITY_STATUS);
    Storage.local.removeItem(LOCAL_STORAGE.PROFILE_ID);
    Storage.local.removeItem(LOCAL_STORAGE.HAS_IDENTITY);
}

function flushBasket() {
    Storage.local.removeItem(LOCAL_STORAGE.BASKET);
}

function flushPersonalizedPromotions() {
    Storage.local.removeItem(LOCAL_STORAGE.PERSONALIZED_PROMOTIONS);
    Storage.local.removeItem(LOCAL_STORAGE.PERSONALIZED_PROMOTIONS_V2);
}

function flushCatNav() {
    Storage.local.removeItem(LOCAL_STORAGE.CATNAV);
    Storage.local.removeItem(LOCAL_STORAGE.CAT_NAV_LOCALE);
}

function flushUserAdditionalData() {
    Storage.local.removeItem(LOCAL_STORAGE.LITHIUM_DATA);
    Storage.local.removeItem(LOCAL_STORAGE.LOVES_DATA);
    Storage.local.removeItem(LOCAL_STORAGE.CREATED_NEW_USER);
    Storage.local.removeItem(LOCAL_STORAGE.HAS_SEEN_UPDATED_SHIPPING_CALCULATIONS);
    Storage.local.removeItem(LOCAL_STORAGE.JWT_AUTH_TOKEN);
}

async function flushMyListsData() {
    await Storage.db.removeItem(LOCAL_STORAGE.LOVED_ITEMS_SKU_ONLY);
    await Storage.db.removeItem(LOCAL_STORAGE.LOVED_ITEMS_WITH_DETAILS);
    await Storage.db.removeItem(LOCAL_STORAGE.ALL_LOVE_LIST);
    await Storage.db.removeItem(LOCAL_STORAGE.LIMITED_LOVED_ITEMS);
    await Storage.db.removeItem(LOCAL_STORAGE.ALL_LOVE_LIST_SKU_ONLY);
}

function flushLoginProfileWarnings() {
    Storage.local.removeItem(LOCAL_STORAGE.POSTPONE_LOGIN_PROFILE_WARNINGS);
    Storage.local.removeItem(LOCAL_STORAGE.LOGIN_PROFILE_WARNINGS);
}

function flushP13nData() {
    Storage.local.removeAllBy(key => key.indexOf(LOCAL_STORAGE.P13N_DATA) === 0);
}

function flushBeautyOffers() {
    Storage.local.removeItem(LOCAL_STORAGE.BI_OFFERS);
}

function flushBiAccountAndProfileId() {
    Storage.local.removeItem(LOCAL_STORAGE.BI_ACCOUNT_ID);
    Storage.local.removeItem(LOCAL_STORAGE.PROFILE_ID);
}

export default {
    flushUser,
    flushAuthTokens,
    flushBasket,
    flushPersonalizedPromotions,
    flushCatNav,
    flushUserAdditionalData,
    flushMyListsData,
    flushLoginProfileWarnings,
    flushP13nData,
    flushBeautyOffers,
    flushBiAccountAndProfileId
};
