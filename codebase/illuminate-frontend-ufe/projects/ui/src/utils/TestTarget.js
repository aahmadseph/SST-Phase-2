import analyticsUtils from 'analytics/utils';
import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import urlUtils from 'utils/Url';
import skuUtils from 'utils/Sku';
import Location from 'utils/Location';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { SEPHORA_CARD_TYPES } from 'constants/CreditCard';
import helperUtils from 'utils/Helpers';
import basketUtils from 'utils/Basket';
import stringUtils from 'utils/String.js';
import anaConsts from 'analytics/constants';
import profileApi from 'services/api/profile';
import Empty from 'constants/empty';

const { getProp } = helperUtils;
const getCurrentCountry = localeUtils.getCurrentCountry;
const noSephoraCC = 'NO_SEPHORA_CC';

const getSelected = choices => {
    try {
        if (choices.length) {
            return choices.length > 1 ? choices.join(',') : choices[0];
        } else {
            return 'null';
        }
    } catch (e) {
        return 'null';
    }
};

/**
 * Looks for a key within any world of the customerPreference object.
 */
function getRefinementValue(customerPreference, key) {
    if (customerPreference && typeof customerPreference === 'object') {
        for (const world of Object.values(customerPreference)) {
            if (world && typeof world === 'object' && Object.prototype.hasOwnProperty.call(world, key)) {
                return world[key];
            }
        }
    }

    return null;
}

const TEST_TYPES = {
    TOGGLE: 'toggle',
    LAUNCHSIGNIN: 'launchSignIn',
    INJECT_PROPS: 'injectProps',
    SHOW_ADD_TO_BASKET_MODAL: 'showAddToBasketModal',
    TOGGLE_AND_INJECT_PROPS: 'toggleAndInjectProps'
};

const TEST_NAME = { TOGGLE_CONSTRUCTOR_VS_ENDECA: 'toggleConstructorVsEndeca' };

const JSON_ACTION = 'setJson';

// TODO: revisit/remove when we migrate to only support JSON offers
const getTotalDeliveredTests = function (payload) {
    const reg = /Sephora\.Util\.TestTarget\.dispatchTest/g;
    let count = 0;

    if (Array.isArray(payload)) {
        payload.forEach(test => {
            if (test) {
                /* This is only needed because all offers increment "receivedTests" in the store.
                 * When we support only JSON offers then this whole function might be removed.
                 */
                if (test.action === JSON_ACTION) {
                    const tests = test.content.map(obj => Object.keys(obj)).flat();
                    const uniqueTests = [...new Set(tests)];
                    const emptyTests = test.content.filter(obj => !Object.keys(obj).length).length;
                    count += uniqueTests.length + emptyTests;
                } else if (typeof test.content === 'string') {
                    const match = test.content.match(reg);

                    if (match && match.length) {
                        count += match.length;
                    }
                }
            }
        });
    }

    return count;
};

// ILLUPH-124898 && ILLUPH-126580 Get/Set om_mmc URL param in local storage
const getOmMmc = () => {
    let omMmc = Storage.local.getItem(LOCAL_STORAGE.TARGET_REFERRER);

    if (!omMmc) {
        const omMmcParam = urlUtils.getParamValueAsSingleString('om_mmc');

        if (omMmcParam) {
            const expiry = new Date(); // Expires 24 hours in the future
            expiry.setDate(expiry.getDate() + 1);
            Storage.local.setItem(LOCAL_STORAGE.TARGET_REFERRER, omMmcParam, expiry);
            omMmc = omMmcParam;
        }
    }

    return omMmc;
};

const getReferringChannel = () => {
    const omMmc = getOmMmc();

    if (!omMmc || typeof omMmc !== 'string') {
        return 'organic';
    }

    const isPaidReferrer = omMmcParam => {
        const paidReferrers = ['ppc', 'us_search', 'ca_search', 'google', 'ytsrch', 'gsp', 'esv'];

        return paidReferrers.some(referrer => omMmcParam && typeof omMmcParam === 'string' && omMmcParam.indexOf(referrer) === 0);
    };

    let referringChannel = null;

    if (omMmc.indexOf('aff') === 0) {
        referringChannel = 'affiliate';
    } else if (omMmc.indexOf('sms-us') === 0 && localeUtils.isUS()) {
        referringChannel = 'sms-us';
    } else if (omMmc.indexOf('ret') === 0 || omMmc.indexOf('tr') === 0) {
        referringChannel = 'email';
    } else if (isPaidReferrer(omMmc)) {
        referringChannel = 'paid';
    } else {
        referringChannel = 'organic';
    }

    return referringChannel;
};

const getMediaCampaign = () => {
    const omMmc = getOmMmc();

    const isMediaCampaign = omMmcParam => {
        const mediaCampaings = ['disp', 'vid', 'facebook', 'paid_social'];

        return mediaCampaings.some(campaign => omMmcParam && typeof omMmcParam === 'string' && omMmcParam.toLowerCase().indexOf(campaign) !== -1);
    };

    let mediaCampaign;

    if (isMediaCampaign(omMmc)) {
        const splittedParam = omMmc.split('-');

        if (splittedParam[1]) {
            mediaCampaign = splittedParam[1];
        }
    }

    return mediaCampaign;
};

const getBrandName = () => {
    const pathArray = Location.getLocation().pathname.split('/');
    const indexOfBrand = pathArray.indexOf('brand');
    const brandName = pathArray.length > indexOfBrand + 1 ? pathArray[indexOfBrand + 1].replace(/-/g, '_') : '';

    return brandName;
};

const getBasketAttribute = basketAttribute => {
    const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET, true) || {};
    const basketData = basketLocalData[basketAttribute] || '';

    return basketData.replace('$', '').trim(); // Remove currencies
};

const getRemainToFreeShipping = userLocalData => {
    // Note: Not using the isRouge utilities
    // because they read the value from the redux store but
    // we need to read it from the local storage.
    const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET, true);
    const deltaFromBasket = getProp(basketLocalData, 'remainToFreeShipping', false);

    const OPTIONS = {
        INTERNATIONAL: 'int_ship',
        ROUGE: 'rouge',
        EMPTY: 'empty'
    };

    if (!basketUtils.isUSorCanadaShipping()) {
        return OPTIONS.INTERNATIONAL;
    }

    if (deltaFromBasket) {
        return deltaFromBasket.trim().replace('$', '');
    } else {
        const vibSegment = getProp(userLocalData, 'profile.beautyInsiderAccount.vibSegment', false);

        if (vibSegment === OPTIONS.ROUGE.toUpperCase()) {
            return OPTIONS.ROUGE;
        } else {
            return OPTIONS.EMPTY;
        }
    }
};

const getProductId = () => {
    const productName = urlUtils.getUrlLastFragment().toLowerCase();
    const productId = productName.split('-').pop();

    return productId;
};

const getCategoryName = () => urlUtils.getUrlLastFragment().toLowerCase();

const getContentPageName = () => {
    const pathArray = Location.getLocation().pathname.split('/');
    const indexOfBeauty = pathArray.indexOf('beauty');
    const contentPageName = pathArray.length > indexOfBeauty + 1 ? pathArray[indexOfBeauty + 1].replace(/-/g, '_') : '';

    return contentPageName;
};

const getPageType = () => {
    let pageType = Sephora?.template?.toLowerCase();
    pageType = pageType ? pageType.split('/').pop() : null;

    if (Location.isContentStorePage()) {
        pageType = 'contentstore';
    } else {
        pageType = analyticsUtils.convertName(pageType);
    }

    return pageType;
};

const getPageName = () => {
    let pageName = analyticsUtils.convertName(getPageType());

    if (Location.isHomepage()) {
        pageName += ':' + pageName + ':n/a:';
    } else if (Location.isBrandNthCategoryPage()) {
        pageName += `:${getBrandName()}:${getCategoryName()}:n/a:`;
    } else if (Location.isRootCategoryPage()) {
        pageName += `:${getCategoryName()}:${getCategoryName()}:`;
    } else if (Location.isNthCategoryPage()) {
        pageName += `:${getCategoryName()}:`;
    } else if (Location.isProductPage()) {
        pageName += `:${getProductId()}:`;
    } else if (Location.isContentStorePage()) {
        pageName = `contentstore:${getContentPageName()}:`;
    } else if (Location.isSearchPage()) {
        pageName += ':results-products:n/a:';
    }

    return pageName;
};

const getAppliedPromotionIds = () => {
    const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET, true);
    const appliedPromotions = getProp(basketLocalData, 'appliedPromotions', []);

    return appliedPromotions.map(promo => promo.promotionId).join(',');
};

const cleanString = str =>
    str
        .trim()
        .replace(/[^\w\s]/gi, '')
        .replace(/ /g, '_')
        .replace(/__/, '_');

const getPrimaryCategory = productCategories => {
    let parentCategory = productCategories.parentCategory;

    if (parentCategory && parentCategory.parentCategory) {
        parentCategory = getPrimaryCategory(parentCategory);
    } else if (parentCategory && parentCategory.displayName) {
        return parentCategory.displayName;
    } else {
        return '';
    }

    return parentCategory;
};

const getNthLevelCategory = productCategories => {
    return productCategories.displayName;
};

const getBrowserUserStatus = () => {
    const hasPreviouslyLoggedIn = Storage.local.getItem(LOCAL_STORAGE.HAS_PREVIOUSLY_LOGGED_IN);
    const createdNewUser = Storage.local.getItem(LOCAL_STORAGE.CREATED_NEW_USER);

    let browserUserStatus;

    if (hasPreviouslyLoggedIn) {
        if (createdNewUser === 'fromSite') {
            browserUserStatus = 'new';
        } else if (createdNewUser === 'fromStore') {
            browserUserStatus = 'store';
        } else {
            browserUserStatus = 'existing';
        }
    } else {
        browserUserStatus = 'unrecognized';
    }

    return browserUserStatus;
};

const getCustomizableSetsKey = product => {
    if (product.currentSku.configurableOptions) {
        if (product.currentSku.configurableOptions.isFree) {
            /* Offer the client a set where one item (single and multiple ppage options) is
             ** customizable and included for FREE.*/
            return anaConsts.CUSTOMIZABLE_SETS_VARIANTS.IS_CUSTOMIZABLE;
        } else {
            /* Allow the client to build a set of one SKU (e.g. eyeshadow) of one product
             ** and receive a free item (e.g. palette) of their choice for FREE.*/
            return anaConsts.CUSTOMIZABLE_SETS_VARIANTS.IS_CUSTOMIZABLE_CHOOSE_FREE_ITEM;
        }
    } else {
        return anaConsts.CUSTOMIZABLE_SETS_VARIANTS.NOT_CUSTOMIZABLE;
    }
};

const convertSkuType = (type = '') => {
    switch (type.toLowerCase()) {
        case 'gift card':
            return 'giftcard';
        default:
            return type;
    }
};

const getProductWorld = child => {
    if (child.parentCategory) {
        return getProductWorld(child.parentCategory);
    } else {
        return child.displayName;
    }
};

const updateDigitalProductObject = (product, addExtraElement = false, sku = null) => {
    const skuId = sku?.skuId || product?.currentSku?.skuId;
    const skuPrice = sku?.salePrice ? sku.salePrice : sku?.listPrice;
    const {
        isNew,
        type,
        listPrice,
        salePrice,
        valuePrice,
        variationType,
        variationValue,
        isSephoraExclusive = false,
        isLimitedEdition = false,
        isOnlineOnly = false,
        isOnlyFewLeft = false,
        isOutOfStock = false,
        isAppExclusive = false,
        isFirstAccess = false,
        isLimitedTimeOffer = false
    } = product.currentSku;

    const priceProperties = {
        price: skuPrice ? skuPrice : salePrice ? salePrice : listPrice,
        originalPrice: sku?.listPrice ? sku.listPrice : listPrice
    };

    Object.assign(priceProperties, salePrice ? { salePrice } : {});

    const valuePriceTrimmed = valuePrice && valuePrice.slice(valuePrice.indexOf('$'), valuePrice.indexOf('v') - 1);
    Object.assign(priceProperties, valuePriceTrimmed ? { valuePrice: valuePriceTrimmed } : {});

    const attributesObj = {
        customizableSetType: getCustomizableSetsKey(product),
        isNew,
        isSephoraExclusive,
        isLimitedEdition,
        isOnlineOnly,
        isOnlyFewLeft,
        isAppExclusive,
        isFirstAccess,
        isLimitedTimeOffer,
        rating: product.rating,
        skuId,
        type: convertSkuType(type),
        typeForPixel: type,
        variationType: variationType || product.variationType,
        variationValue,
        world: getProductWorld(product),
        isOutOfStock,
        nthLevelCategory: product.parentCategory && product.parentCategory.displayName,
        image: product.currentSku.skuImages?.image250,
        productUrl: product.fullSiteProductUrl,
        quickLookAdded: addExtraElement
    };

    Object.assign(attributesObj, priceProperties);

    const productDetails = product.productDetails || product;

    if (!addExtraElement) {
        digitalData.product.push({
            attributes: attributesObj,
            productInfo: {
                description: productDetails.shortDescription?.replace(/<\/?\w+[^>]*\/?>/g, ''),
                manufacturer: productDetails.brand ? productDetails.brand.displayName : '',
                productID: productDetails.productId,
                productName: productDetails.displayName
            }
        });
    } else {
        digitalData.product.unshift({
            attributes: attributesObj,
            productInfo: {
                description: productDetails.shortDescription?.replace(/<\/?\w+[^>]*\/?>/g, ''),
                manufacturer: productDetails.brand ? productDetails.brand.displayName : '',
                productID: productDetails.productId,
                productName: productDetails.displayName
            }
        });
    }
};

const getBobFlag = () => {
    if (localeUtils.isFRCanada()) {
        return 'MARQUES FONDÉES PAR DES PANDC';
    } else {
        return 'BIPOC-OWNED BRAND';
    }
};

export default {
    MBOX_NAME: 'sephora_global',
    MBOX_TIMEOUT: 5000,
    JSON_ACTION,
    TEST_TYPES,
    TEST_NAME,

    /* eslint-disable-next-line complexity */
    setUserParams: function (user = {}, notPreBasket = false) {
        /* TODO: support brand, categoryPath, and pageType when UFE rolls out
         ** to other pages besides HP
         */
        const userLocalData = Storage.local.getItem(LOCAL_STORAGE.USER_DATA, true);
        const profile = user.profile || userLocalData?.profile || user;
        const profileStatus = userUtils.getProfileStatus() || userLocalData?.profile?.loginStatus || 0;

        const getProfileStatusString = status => {
            switch (status) {
                case 2:
                    return 'recognized';
                case 4:
                    return 'signed in';
                default:
                    return 'unrecognized';
            }
        };
        const ccTargeters = Storage.local.getItem(LOCAL_STORAGE.CREDIT_CARD_TARGETERS);

        let localeValue = getCurrentCountry().toLowerCase();

        if (localeUtils.isCanada()) {
            const languageVal = localeUtils.getCurrentLanguage().toLowerCase();
            localeValue = `${localeValue}-${languageVal}`;
        }

        const pageNameParam = getPageName();
        const pageTypeParam = getPageType();

        const targetParams = {
            pageName: pageNameParam,
            locale: localeValue,
            basketType: '',
            brand: '',
            categoryPath: '',
            pageType: pageTypeParam,
            signInStatus: getProfileStatusString(profileStatus)
        };

        const addToParams = (paramsKey, dataKey) => {
            /* This will not add the parameter if it does not exist in the user info data.
             ** This is so user info data saved by Test
             ** & Target is not overwritten
             ** with blank data.*/
            if (dataKey !== '') {
                targetParams[paramsKey] = dataKey;
            }
        };

        // CRMTS-142: hasSavedCreditCards is provided by the Profile API
        let shouldSendHasSavedCreditCards = true;

        if (Location.isBasketPage() && basketUtils.getLocalPickupItems() > 0) {
            shouldSendHasSavedCreditCards = false;
        }

        if (Location.isCheckout() && basketUtils.isPickup()) {
            shouldSendHasSavedCreditCards = false;
        }

        if (getProfileStatusString(profileStatus) !== 'unrecognized' && shouldSendHasSavedCreditCards) {
            const hasSavedCreditCards = !!profile?.hasSavedCreditCards;
            addToParams('profile.hasSavedCreditCards', hasSavedCreditCards);
        }

        // ILLUPH-125016 Add remainToFreeShipping to the mbox attributes
        const remainToFreeShipping = getRemainToFreeShipping(userLocalData);
        addToParams('remainToFreeShipping', remainToFreeShipping);

        // ILLUPH-124898 Add referringChannel to TT request
        addToParams('referringChannel', getReferringChannel());

        // ILLUPH-126580 Add queryParamMediaCampaign to TT request
        addToParams('queryParamMediaCampaign', getMediaCampaign());

        // ILLUPH-124903 Add queryParamEmcampaign, queryParamPromo to TT request
        const queryParamEmcampaign = urlUtils.getParamValueAsSingleString('emcampaign');
        const cachedEmcampaign = Storage.local.getItem(LOCAL_STORAGE.TARGET_CAMPAIGN);
        const queryParamPromo = urlUtils.getParamValueAsSingleString('promo');
        const cachedPromo = Storage.local.getItem(LOCAL_STORAGE.TARGET_PROMO);

        if (queryParamEmcampaign !== '') {
            addToParams('queryParamEmcampaign', queryParamEmcampaign);
            Storage.local.setItem(LOCAL_STORAGE.TARGET_CAMPAIGN, queryParamEmcampaign);
        } else {
            if (cachedEmcampaign !== null) {
                addToParams('queryParamEmcampaign', cachedEmcampaign);
            }
        }

        if (queryParamPromo !== '') {
            addToParams('queryParamPromo', queryParamPromo);
            Storage.local.setItem(LOCAL_STORAGE.TARGET_PROMO, queryParamPromo);
        } else {
            if (cachedPromo !== null) {
                addToParams('queryParamPromo', cachedPromo);
            }
        }

        // ILLUPH-124892 Send pagetype and pagename
        if (getPageType() !== null) {
            addToParams('currentPageType', pageTypeParam);
        }

        if (getPageName() !== null) {
            addToParams('currentPageName', pageNameParam);
        }

        // ILLUPH-124885 Add displayNameBrand to TT request
        const shouldSendBrand = Location.isBrandNthCategoryPage() || Location.isProductPage();

        if (shouldSendBrand && Sephora.mboxAttrs.brandName) {
            const noDiacriticsBrandName = stringUtils.replaceDiacriticChars(Sephora.mboxAttrs.brandName);
            addToParams('displayNameBrand', cleanString(noDiacriticsBrandName));
        }

        // ILLUPH-124909 Cart Items Test Attributes
        addToParams('cartSkus', basketUtils.getSkuIdsItemsLocalStorage().join(','));
        addToParams(
            'cartBrands',
            basketUtils
                .getBrandsItemsLocalStorage()
                .map(item => stringUtils.replaceDiacriticChars(item.sku.brandName).replace(/\s/g, '_').replace(/[^\w]/g, '').replace(/__/, '_'))
                .join(',')
        );

        const appliedPromotionIds = getAppliedPromotionIds();
        addToParams('flagPromosApplied', !!appliedPromotionIds.length);
        addToParams('appliedPromotionIds', appliedPromotionIds);

        /*
         * we need to set the 'pdpCarouselSet' param only if is true
         * cause that's how the T&T Campaign is set
         */

        //ILLUPH-124629 Basket Value Attributes
        addToParams('subtotal', basketUtils.isUSorCanadaShipping() ? getBasketAttribute('rawSubTotal') : 'int_ship');
        addToParams('subtotalAndDiscount', basketUtils.isUSorCanadaShipping() ? getBasketAttribute('subtotal') : 'int_ship');

        // Set basketType value: '' (pre-basket), 'dc' or 'bopis'
        const basketLocalData = Storage.local.getItem(LOCAL_STORAGE.BASKET, true) || {};
        const basketItems = getProp(basketLocalData, 'items', []);
        const basketPickupItems = getProp(basketLocalData.pickupBasket, 'items', []);
        let basketType = basketUtils.isDCBasket() ? 'dc' : 'bopis';

        if (!notPreBasket && basketPickupItems.length && basketItems.length) {
            basketType = '';
        }

        addToParams('basketType', basketType);

        // UTS-708: Send product page type to Target based on Sephora.channel:
        // true if Sephora.channel is 'RWD', else false
        const cachedProductPageType = Storage.local.getItem(LOCAL_STORAGE.TARGET_PRODUCT_PAGE_TYPE);

        if (!Location.isProductPage() && cachedProductPageType !== null) {
            addToParams('profile.isRwdPdp', cachedProductPageType === 'RWD');
        }

        // UTS-969 & UTS-1039 & UTS-1045
        if (!Location.isCheckout()) {
            const hasPickupBasketItems = basketUtils.getLocalPickupItems() > 0;
            const dcBasketSubtotal = getBasketAttribute('rawSubTotal');
            const bopisBasketSubtotal = getProp(basketLocalData.pickupBasket, 'rawSubTotal', '$0.00');
            const bopisBasketSubtotalWithoutCurrency = basketUtils.removeCurrency(bopisBasketSubtotal);
            const basketSubtotal = hasPickupBasketItems
                ? (parseFloat(dcBasketSubtotal) + parseFloat(bopisBasketSubtotalWithoutCurrency)).toFixed(2)
                : dcBasketSubtotal;
            addToParams('basketSubtotal', basketUtils.isUSorCanadaShipping() ? basketSubtotal : 'int_ship');
        }

        if (Location.isProductPage()) {
            const {
                productId, productRating = 0, skuType, skuBiType, productCategories, specialProdCategories
            } = Sephora.mboxAttrs;

            addToParams('productId', (productId || '').toLowerCase());

            if (
                skuUtils.isStandardProduct({
                    type: skuType,
                    biType: skuBiType
                })
            ) {
                addToParams('rating', productRating.toFixed(1));
            }

            if (productCategories) {
                addToParams('category', getPrimaryCategory(productCategories).toLowerCase().trim());
                addToParams('nthLevel', getNthLevelCategory(productCategories).toLowerCase().trim());
            }

            addToParams('specialProdCat', skuUtils.isCleanProduct(specialProdCategories) ? 'clean' : '');

            // Add user.categoryId parameter
            if (productCategories && Sephora?.mboxAttrs?.brandName) {
                const displayNameBrand = cleanString(stringUtils.replaceDiacriticChars(Sephora.mboxAttrs.brandName));
                const primaryCategory = getPrimaryCategory(productCategories).toLowerCase().trim();
                addToParams('user.categoryId', `brand__${displayNameBrand}, category__${primaryCategory}`);
            }

            addToParams('profile.isRwdPdp', Sephora.channel === 'RWD');
            Storage.local.setItem(LOCAL_STORAGE.TARGET_PRODUCT_PAGE_TYPE, Sephora.channel);
        }

        if (profileStatus !== 0 && typeof profile.beautyInsiderAccount !== 'undefined') {
            const userData = profile.beautyInsiderAccount;
            const userBeautyPreferences = profile.customerPreference || Empty.Object;
            const birthDate = userData.birthMonth + '/' + userData.birthDay + '/' + userData.birthYear;

            const addCCTargetToParams = (param, targeter) => {
                addToParams(param, targeter && !!targeter.length);
            };

            addToParams('profile.biStatus', userData.vibSegment?.toLowerCase() || 'non-bi');
            addToParams('profile.biPoints', userData.promotionPoints);
            addToParams('profile.biYtdSpend', userData.vibSpendingForYear);
            addToParams('profile.birthday', birthDate);
            addToParams(
                'profile.biSignUpDate',
                new Date(userData.signupDate).toLocaleString('en-US', {
                    month: '2-digit',
                    day: '2-digit',
                    year: 'numeric'
                })
            );

            addToParams('profile.eyeColor', getSelected(getRefinementValue(userBeautyPreferences, 'eyeColor')));
            addToParams('profile.fragranceFamily', getSelected(getRefinementValue(userBeautyPreferences, 'fragranceFamily')));
            addToParams('profile.hairColor', getSelected(getRefinementValue(userBeautyPreferences, 'hairColor')));
            addToParams('profile.hairConcerns', getSelected(getRefinementValue(userBeautyPreferences, 'hairConcerns')));
            addToParams('profile.yourHair', getSelected(getRefinementValue(userBeautyPreferences, 'hairType')));
            addToParams('profile.hairTexture', getSelected(getRefinementValue(userBeautyPreferences, 'hairTexture')));
            addToParams('profile.ingredientPreferences', getSelected(getRefinementValue(userBeautyPreferences, 'ingredientPreferences')));
            addToParams('profile.shoppingPreferences', getSelected(getRefinementValue(userBeautyPreferences, 'shoppingPreferences')));
            addToParams('profile.skinType', getSelected(getRefinementValue(userBeautyPreferences, 'skinType')));
            addToParams('profile.skinCareConcerns', getSelected(getRefinementValue(userBeautyPreferences, 'skinConcerns')));
            addToParams('profile.skinTone', getSelected(getRefinementValue(userBeautyPreferences, 'skinTone')));

            if (userData.ccAccountandPrescreenInfo) {
                addToParams('profile.ccApprovalStatus', userData.ccAccountandPrescreenInfo.ccApprovalStatus?.toLowerCase());
                addToParams('profile.ccCardType', profile.ccCardType);
                addToParams('profile.ccPreScreenStatus', userData.ccAccountandPrescreenInfo.preScreenStatus);
                addToParams('profile.ccPreScreenCardType', userData.ccAccountandPrescreenInfo.prescreenedCardType);
            }

            if (ccTargeters) {
                addToParams('profile.isUserTargetedForCreditCardBanners', true);

                addCCTargetToParams('profile.isUserTargetedForBasketCreditCardBanner', ccTargeters.CCDynamicMessagingBasketTargeter);
                addCCTargetToParams('profile.isUserTargetedForInlineBasketCreditCardBanner', ccTargeters.CCDynamicMessagingInlineBasketTargeter);
                addCCTargetToParams('profile.isUserTargetedForLeftNavCreditCardBanner', ccTargeters.CCDynamicMessagingLeftNavTargeter);
                addCCTargetToParams('profile.isUserTargetedForCheckoutCreditCardBanner', ccTargeters.CCDynamicMessagingCheckoutTargeter);
            }

            addToParams('profile.spendingToNextBISegment', userData.vibSpendingToNextSegment);
        }

        // ILLUPH-133757 User/Browser Status Parameter MBox Attribute
        addToParams('browserUserStatus', getBrowserUserStatus());

        const ccIsExpired = () => {
            const { PRIVATE_LABEL, PRIVATE_LABEL_TEMP, CO_BRANDED, CO_BRANDED_TEMP } = SEPHORA_CARD_TYPES;

            let userCC;
            const userInfo = userUtils.getProfileId();
            const ccIsExpiredStoredValue = Storage.session.getItem('ccIsExpired');

            if (ccIsExpiredStoredValue !== null) {
                return ccIsExpiredStoredValue !== noSephoraCC ? Promise.resolve(ccIsExpiredStoredValue) : Promise.resolve(undefined);
            } else if (!userInfo) {
                return Promise.resolve(undefined);
            }

            return profileApi
                .getCreditCardsFromProfile(userInfo)
                .then(payments => {
                    if (payments) {
                        userCC = payments.creditCards.filter(cc => {
                            return (
                                cc.cardType === PRIVATE_LABEL ||
                                cc.cardType === PRIVATE_LABEL_TEMP ||
                                cc.cardType === CO_BRANDED ||
                                cc.cardType === CO_BRANDED_TEMP
                            );
                        });

                        const validSephoraCC = userCC.filter(sephoraCC => !sephoraCC.isExpired);
                        let expiredCC;

                        if (validSephoraCC.length) {
                            expiredCC = false;
                        } else if (!validSephoraCC.length && userCC.length) {
                            expiredCC = true;
                        }

                        if (expiredCC !== undefined) {
                            Storage.session.setItem('ccIsExpired', expiredCC);
                        } else {
                            Storage.session.setItem('ccIsExpired', 'NO_SEPHORA_CC');
                        }

                        return expiredCC;
                    } else {
                        Storage.session.setItem('ccIsExpired', 'NO_SEPHORA_CC');

                        return Promise.resolve(undefined);
                    }
                })
                .catch(e => {
                    return Promise.resolve({ errorCode: e.errorCode });
                });
        };

        if (profileStatus === 4) {
            return ccIsExpired()
                .then(ccExpiredInfo => {
                    if (ccExpiredInfo?.errorCode !== -1) {
                        const ccInfo = userUtils.getSephoraCreditCardInfo();

                        if ((ccInfo && ccInfo.ccApprovalStatus === 'APPROVED') || ccExpiredInfo !== undefined) {
                            addToParams('profile.ccSavedPayment', true);
                        } else {
                            addToParams('profile.ccSavedPayment', false);
                        }

                        if (ccExpiredInfo !== undefined) {
                            addToParams('profile.ccIsExpired', ccExpiredInfo);
                        }
                    }
                })
                .then(() => {
                    return targetParams;
                });
        } else {
            if (!userUtils.PROFILE_STATUS.RECOGNIZED_STATUSES.includes(profileStatus)) {
                Storage.session.removeItem('ccIsExpired');
            }

            return Promise.resolve(targetParams);
        }
    },

    sendCustomEvent: function (eventName) {
        global.dispatchEvent(new Event(eventName));
    },

    extractMboxParams: function (pageData) {
        const mboxAttrs = {};

        const addIfExists = (name, data) => {
            if (data !== undefined) {
                mboxAttrs[name] = data;
            }
        };

        if (Location.isProductPage()) {
            const productDetails = pageData.productDetails || {};

            addIfExists('productId', productDetails.productId);
            addIfExists('productRating', productDetails.rating);
            addIfExists('skuType', pageData && pageData.currentSku && pageData.currentSku.type);
            addIfExists('skuBiType', pageData && pageData.currentSku && pageData.currentSku.biType);
            addIfExists('brandName', productDetails.brand && productDetails.brand.displayName);
            addIfExists('productCategories', pageData && pageData.parentCategory);
            addIfExists('specialProdCategories', pageData && pageData.specialProdCategories);
        } else if (pageData?.displayName) {
            addIfExists('brandName', pageData.displayName);
        }

        return mboxAttrs;
    },
    getPageName,
    getPageType,
    getTotalDeliveredTests,
    updateDigitalProductObject,
    getBobFlag
};
