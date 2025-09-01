import localeUtils from 'utils/LanguageLocale';
import constants from 'components/constants';
const { BUTTON_TEXT } = constants;
const priceRegExp = /\d*\.\d{0,2}/;
const CHANEL_ID = '1065';

// move this to entities
// do not use "sku.", since this object should be mixed into sku: Object.assign({}, sku, Sku);
// use "this."" instead.
const skuUtil = {
    CUSTOM_SETS_TYPE: {
        SINGLE_SKU: {
            YOUR_CHOICES: 'SINGLE_SKU_YOUR_CHOICES',
            SKU_LIST: 'SINGLE_SKU_SKU_LIST'
        },
        GROUPED_SKU: {
            YOUR_CHOICES: 'GROUPED_SKU_YOUR_CHOICES',
            SKU_LIST: 'GROUPED_SKU_SKU_LIST'
        },
        UNKNOWN_SKU: {
            YOUR_CHOICES: 'UNKNOWN_SKU_YOUR_CHOICES',
            SKU_LIST: 'UNKNOWN_SKU_SKU_LIST'
        }
    },

    skuSwatchType: {
        TEXT: 'Text',
        IMAGE: 'Image',
        SIZE: 'Size',
        NONE: 'None'
    },

    skuVariationType: {
        COLOR: 'Color',
        SIZE: 'Size',
        CONCENTRATION: 'Concentration',
        FORMULATION: 'Formulation',
        SIZE_CONCENTRATION_FORMULATION: 'Size + Concentration + Formulation',
        SIZE_CONCENTRATION: 'Size + Concentration',
        SCENT: 'Scent',
        TYPE: 'Type',
        NONE: 'None'
    },

    // Reward and Rouge Reward Card are not standard sku.types supported by API,
    // but we need it within this list of Constants
    skuTypes: {
        STANDARD: 'standard',
        SAMPLE: 'sample',
        MINI: 'Mini',
        GWP: 'gwp',
        EGC: 'e-certificate',
        GC: 'gift card',
        BIRTHDAY_GIFT: 'birthday gift',
        CELEBRATION_GIFT: 'celebration gift',
        ROUGE_BIRTHDAY_GIFT: 'Rouge Welcome Kit',
        WELCOME_KIT: 'welcome kit',
        SUBSCRIPTION: 'subscription',
        REWARD: 'reward', // doesn't exist in API
        ROUGE_REWARD_CARD: 'Reward_Card',
        SDU: 'sdu'
    },

    skuSubTypes: {
        PRODUCT: 'product'
    },

    biExclusiveLevels: {
        NONE: 'none',
        BI: 'BI',
        VIB: 'VIB',
        ROUGE: 'Rouge'
    },

    IDs: {
        GC: '00050'
    },

    PRODUCT_IDS: { SAMPLE: 'P370205' },

    ARIA_DESCRIBED_BY_IDS: {
        COLOR_SWATCH: 'colorSwatch',
        SIZE_SWATCH: 'sizeSwatch'
    },

    skuDefaults: { quantity: 10 },

    SKU_ID_PARAM: 'skuId',
    HIDDEN_CATEGORY_ID: 'cat870031',
    CUSTOM_MAKEOVER_SKU_ID: '2119469',
    VIB_FREE_SHIPPING_SKU: '2168656',
    VIB_CURTAINS_UP_FREE_SHIPPING: '2168649',

    VIB_CELEBRATION_POINTS_SKU_ID: '2119485',
    VIB_CURTAINS_POINTS_SKU_ID: '2167732',

    ROUGE_CELEBRATION_POINTS_SKU_ID: '2119436',
    ROUGE_CURTAINS_POINTS_SKU_ID: '2167716',

    // CHANEL_BRAND_ID = 1065
    BRANDS_WIHOUT_UGC_CONTENT: [1065],

    MINIMUM_PRICE_FOR_FREE_SHIPPING: 50,

    // @TODO refactor the function for readability
    // if sku is defined as sku = product by default
    // there is no need to ckeck if it exists
    productUrl: function (product, sku = product) {
        let url = null;

        if (sku && sku.targetUrl.indexOf('skuId') === -1) {
            url = product.targetUrl + '?skuId=' + sku.skuId;
        } else if (product && sku) {
            url = sku.targetUrl;
        }

        return url;
    },

    isSubscription: function (sku) {
        return sku && sku.type && sku.type.toLowerCase() === this.skuTypes.SUBSCRIPTION;
    },

    isSDU: function (sku) {
        return sku && sku.type && sku.type.toLowerCase() === this.skuTypes.SDU;
    },

    isShowEmailMeWhenBackInStore: function (sku) {
        return (
            sku.isWithBackInStockTreatment &&
            (sku.actionFlags.backInStockReminderStatus === 'inactive' || sku.actionFlags.backInStockReminderStatus === 'active')
        );
    },

    getEmailMeText: function (sku) {
        let CTAText;

        if (sku.actionFlags?.backInStockReminderStatus === 'inactive') {
            CTAText = BUTTON_TEXT.OOS_ACTIVE;
        } else if (sku.actionFlags?.backInStockReminderStatus === 'active') {
            CTAText = BUTTON_TEXT.OOS_INACTIVE;
        }

        return CTAText;
    },

    isGiftCard: function (sku) {
        return sku.type && sku.type.toLowerCase() === this.skuTypes.GC;
    },

    isGwp: function (sku) {
        return sku.type && sku.type.toLowerCase() === this.skuTypes.GWP;
    },

    isOnlineOnly: function (sku) {
        return sku.isOnlineOnly;
    },

    isStoreOnly: function (sku) {
        return sku.isShowAsStoreOnlyTreatment;
    },

    isAppExclusive: function (sku) {
        return sku.isAppExclusive;
    },

    isAutoReplenish: function (sku) {
        return sku.isReplenishment;
    },

    isOnlineOrAppOnly: function (sku) {
        return this.isOnlineOnly(sku) || this.isAppExclusive(sku);
    },

    isGlobalGwp: function (item) {
        return this.isGwp(item.sku) && item.isGlobalPromotion;
    },

    isBirthdayGift: function (sku) {
        return (
            sku.biType && (sku.biType.toLowerCase() === this.skuTypes.BIRTHDAY_GIFT || sku.biType.toLowerCase() === this.skuTypes.ROUGE_BIRTHDAY_GIFT)
        );
    },

    isSample: function (sku = {}) {
        return sku?.type && sku.type.toLowerCase() === this.skuTypes.SAMPLE;
    },

    isPDPSample: function (sku = {}) {
        return this.isSample(sku) && sku?.subType?.toLowerCase() === this.skuSubTypes.PRODUCT;
    },

    isBiReward: function (sku) {
        // TODO: double check existance of 'none' case biType new fetchProduct API response
        return sku && !!sku.biType && sku.biType.toLowerCase() !== 'none';
    },

    isBiRewardGwpSample: function (sku) {
        return this.isBiReward(sku) || this.isGwp(sku) || this.isSample(sku);
    },
    isEligible: async function (sku) {
        const userUtils = (await import(/* webpackMode: "eager" */ './User')).default;
        /*ILLUPH-124729: BCC Carrousel SKUs do not have isElegible key, in
        that case the reward should be eligible*/
        const skuEligible = sku.isEligible === undefined || sku.isEligible;

        // If there is already a birthday gift in the basket or the current sku is a birthday gift, we disable the reward
        if (this.isBirthdayGift(sku)) {
            const basketUtils = (await import(/* webpackChunkName: "priority" */ './Basket')).default;
            const items = basketUtils.getBasketItems();
            const isBasketContainBirthdayItem = basketUtils.basketContainBirthdayItem(items);
            const birthdaySkuIsEligible = !isBasketContainBirthdayItem;

            return birthdaySkuIsEligible && userUtils.isBiLevelQualifiedFor(sku) && userUtils.isBiPointsBiQualifiedFor(sku);
        }

        if (!(this.isBiReward(sku) && (sku.isEligible || (!sku.isEligible && sku.isInBasket)))) {
            return false;
        }

        return skuEligible && userUtils.isBiLevelQualifiedFor(sku) && userUtils.isBiPointsBiQualifiedFor(sku);
    },
    isRewardDisabled: async function (sku) {
        const userUtils = (await import(/* webpackMode: "eager" */ './User')).default;
        const basketUtils = (await import(/* webpackChunkName: "priority" */ './Basket')).default;
        //sku.isEligible might be undefined, which is why there is a default of true.
        const isEligible = await this.isEligible(sku);

        return (
            userUtils.isAnonymous() ||
            !userUtils.isRewardEligible(sku) ||
            !isEligible ||
            (this.isBirthdayGift(sku) && !userUtils.isBirthdayGiftEligible()) ||
            (this.isWelcomeKit(sku) && basketUtils.hasWelcomeKit()) ||
            (this.isBirthdayGift(sku) && basketUtils.hasBirthdayGift())
        );
    },

    isHardGood: function (sku, includeBiReward = false) {
        return (
            (includeBiReward || !this.isBiReward(sku)) &&
            !this.isWelcomeKit(sku) &&
            !this.isBirthdayGift(sku) &&
            !this.isGwp(sku) &&
            !this.isSample(sku) &&
            !this.isGiftCard(sku)
        );
    },

    isCleanProduct: function (specialProdCategories) {
        if (specialProdCategories) {
            const filteredSpecialProdCategories = specialProdCategories.filter(cat => {
                return cat.seoName.indexOf('clean') >= 0;
            });

            return filteredSpecialProdCategories.length > 0;
        } else {
            return false;
        }
    },

    isWelcomeKit: function (sku) {
        return sku.biType && new RegExp(this.skuTypes.WELCOME_KIT).test(sku.biType.toLowerCase());
    },

    isCelebrationGift: function (sku) {
        return (
            (sku.biType && new RegExp(this.skuTypes.CELEBRATION_GIFT).test(sku.biType.toLowerCase())) ||
            (sku.biType && new RegExp(this.skuTypes.ROUGE_BIRTHDAY_GIFT.toLowerCase()).test(sku.biType.toLowerCase()))
        );
    },

    isVIBFreeShipping: function (sku) {
        return sku && sku.skuId === this.VIB_FREE_SHIPPING_SKU;
    },

    isBiExclusive: function (sku = {}) {
        return !!sku.biExclusiveLevel && sku.biExclusiveLevel !== 'none';
    },

    getExclusiveText: function (sku = {}) {
        return this.isBiExclusive(sku) ? (sku.biExclusiveLevel === this.biExclusiveLevels.BI ? 'Insider' : sku.biExclusiveLevel) : 'App';
    },

    isEGiftCard: function (sku = {}) {
        return sku.type && sku.type.toLowerCase() === this.skuTypes.EGC;
    },

    isStandardProduct: function (sku = {}) {
        //need to check that sku is not bi reward because sku.type is still standard for rewards
        return sku.type && sku.type.toLowerCase() === this.skuTypes.STANDARD && !this.isBiReward(sku);
    },

    isFreeText: function (sku = {}) {
        // check for FREE or GRATUIT (CA locale) in listPrice
        const value = sku.listPrice && sku.listPrice.toLowerCase();

        return value === 'free' || value === 'gratuit';
    },

    isFree: function (sku) {
        return (
            sku.isFree ||
            this.isSample(sku) ||
            this.isWelcomeKit(sku) ||
            this.isCelebrationGift(sku) ||
            this.isBirthdayGift(sku) ||
            this.isFreeText(sku)
        );
    },

    isLoveEligible: function (sku) {
        if (this.isGwp(sku) || this.isSample(sku) || this.isBiReward(sku) || this.isGiftCard(sku) || this.isEGiftCard(sku)) {
            return false;
        }

        return true;
    },

    isCountryRestricted: function (sku) {
        return sku.actionFlags && sku.actionFlags.isRestrictedCountry;
    },

    isReservationNotOffered: function (sku) {
        return sku.actionFlags && sku.actionFlags.isReservationNotOffered;
    },

    isChangeableQuantity: function (sku) {
        const skuItem = Object.assign({}, sku);

        if (!skuItem.maxPurchaseQuantity) {
            skuItem.maxPurchaseQuantity = this.skuDefaults.quantity;
        }

        // @TODO the logic may need a check ¬aΛ¬bΛ¬cΛ¬dΛ¬eΛ¬(fΛg)
        return (
            !this.isWelcomeKit(skuItem) &&
            !this.isBirthdayGift(skuItem) &&
            !this.isGwp(skuItem) &&
            !this.isSample(skuItem) &&
            !this.isGiftCard(skuItem) &&
            !skuItem.isOutOfStock &&
            !(skuItem.maxPurchaseQuantity === 1 && this.isBiReward(skuItem))
        );
    },

    // @TODO check if the structure of the object is the same as used in the product object
    // @TODO remove private variables
    isChanel: function (sku = {}) {
        return sku.brand && sku.brandId === CHANEL_ID;
    },

    isRougeRewardCard: function (sku) {
        return sku && sku.rewardSubType && sku.rewardSubType.toUpperCase() === this.skuTypes.ROUGE_REWARD_CARD.toUpperCase();
    },

    hasNotEnoughPointsToRedeem: function (sku) {
        return sku && sku.hasNotEnoughPointsToRedeem !== undefined && sku.hasNotEnoughPointsToRedeem;
    },

    getBiPoints: function (sku) {
        if (this.isBiReward(sku)) {
            if (this.isWelcomeKit(sku) || this.isBirthdayGift(sku)) {
                return 0;
            } else {
                return parseInt(/^\d*/.exec(sku.biType)[0]);
            }
        } else {
            return null;
        }
    },

    purchasableQuantities: function (sku, startFromZero) {
        const skuItem = Object.assign({}, sku);

        if (!skuItem.maxPurchaseQuantity) {
            skuItem.maxPurchaseQuantity = this.skuDefaults.quantity;
        }

        if (!this.isChangeableQuantity(skuItem)) {
            return [1];
        }

        if (skuItem.maxPurchaseQuantity) {
            const quantity = [];
            let counter = startFromZero ? 0 : 1;

            while (counter <= skuItem.maxPurchaseQuantity) {
                quantity.push(counter++);
            }

            return quantity;
        }

        return null;
    },

    showAddReview: function (sku) {
        return sku.actionFlags && sku.actionFlags.showAddReview;
    },

    // return correct image according to size
    getImgSrc: function (imageSize, images = {}) {
        return images['image' + imageSize] || images.image || images.imageUrl;
    },

    getProductType: function (currentSku) {
        if (this.isRougeRewardCard(currentSku)) {
            return this.skuTypes.ROUGE_REWARD_CARD;
        }

        if (this.isBiReward(currentSku)) {
            return this.skuTypes.REWARD;
        }

        if (this.isSubscription(currentSku)) {
            return this.skuTypes.SUBSCRIPTION;
        }

        if (this.isSDU(currentSku)) {
            return this.skuTypes.SDU;
        }

        return this.skuTypes.STANDARD;
    },

    getSkuListFromProduct(product) {
        const { regularChildSkus = [], onSaleChildSkus = [] } = product;

        let allSkus = regularChildSkus.concat(onSaleChildSkus);

        if (!allSkus.length && product.currentSku) {
            allSkus = [product.currentSku];
        }

        return allSkus.map(sku => sku.skuId);
    },

    parsePrice: function (price) {
        const parsedPrice = (price || '').match(priceRegExp);

        return parsedPrice ? parseFloat(parsedPrice[0]) : NaN;
    },

    isCustomSetsSingleSkuProduct: function (product) {
        return product.currentSku && product.currentSku.configurableOptions && product.currentSku.configurableOptions.skuOptions;
    },

    isCustomSetsGroupedSkuProduct: function (product) {
        return product.currentSku && product.currentSku.configurableOptions && product.currentSku.configurableOptions.groupedSkuOptions;
    },

    isFragrance: function (product, sku) {
        return (product || sku).variationType === this.skuVariationType.SIZE_CONCENTRATION_FORMULATION;
    },

    // @TODO remove direct access to the window properties
    getProductPageData: function (locationObj = {}) {
        let productData = null;
        const { path, queryParams } = locationObj;

        const clearUrl = decodeURI(path || Sephora.renderQueryParams.urlPath).replace(/[^a-zA-Z0-9]/g, '');

        const pidResult = /P\d+$/.exec(clearUrl);

        if (pidResult) {
            productData = { productId: pidResult[0] };

            if (locationObj) {
                if (queryParams && queryParams.skuId) {
                    productData.skuId = queryParams.skuId;
                }
            } else {
                const skuIdResult = /skuId=(\d+)/.exec(location.search);

                if (skuIdResult) {
                    productData.skuId = skuIdResult[1];
                }
            }
        }

        return productData;
    },

    brandShowUserGeneratedContent: function (brandId) {
        return this.BRANDS_WIHOUT_UGC_CONTENT.indexOf(+brandId) === -1;
    },

    showColorIQOnPPage: function (product) {
        const { parentCategory = {} } = product;
        const displayName = parentCategory.displayName;

        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Sku');

        return displayName === getText('foundation') || displayName === getText('concealer');
    },
    getCurrentProductColorIQMatch: async function (product) {
        const userUtils = (await import(/* webpackMode: "eager" */ './User')).default;
        const userSkinTones = userUtils.getUserSkinTones();
        const reverseLookUpApi = (await import(/* webpackMode: "eager" */ 'services/api/sdn')).default;

        const userLABCode = userSkinTones && userSkinTones.length && userSkinTones[0].replace(/,/g, ':').split(':');
        const userPrimarySkinTone = {
            l: userLABCode[0],
            a: userLABCode[1],
            b: userLABCode[2]
        };

        return userLABCode
            ? reverseLookUpApi.getProductIdLab(product.productDetails.productId, userPrimarySkinTone).then(data => {
                return data.skuId ? data.skuId : 'No Match';
            })
            : new Promise(resolve => {
                resolve('No Match');
            });
    },
    showRWDColorIQOnPage: function (product) {
        const { parentCategory = {} } = product;
        const displayName = parentCategory.displayName;

        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Sku');

        return displayName === getText('foundation') || displayName === getText('concealer');
    },

    isColorIQEnabled: product => {
        const { parentCategory = {}, regularChildSkus = [] } = product;
        const { displayName } = parentCategory;
        const isColorIQEnabled = !!regularChildSkus.length;
        const getText = localeUtils.getLocaleResourceFile('utils/locales', 'Sku');
        const isFoundationCategory = displayName === getText('foundation');
        const isConcealerCategory = displayName === getText('concealer');

        return isColorIQEnabled && (isFoundationCategory || isConcealerCategory);
    },

    // @TODO refactor: overcomplicated logic
    //  ¬(F)V¬(sΛ¬F) expression is a tautology
    getViewDetailsUrl: function (currentSku, product) {
        const isSample = this.isSample(currentSku);
        const getFullSizeUrl = () => {
            if (isSample) {
                return currentSku.targetUrl;
            } else {
                return `/product/${currentSku.fullSizeProductId}?skuId=${currentSku.fullSizeSkuId}`;
            }
        };
        const getTargetUrl = () => {
            if (currentSku.fullSizeSku) {
                const targetUrl = currentSku.fullSizeSku.targetUrl;

                if (targetUrl.indexOf('skuId') > -1) {
                    return targetUrl;
                } else {
                    return `${targetUrl}?skuId=${currentSku.fullSizeSku.skuId}`;
                }
            } else {
                return product.targetUrl;
            }
        };

        if (currentSku.fullSizeProductUrl) {
            const productDetails = product.productDetails || product || {};

            if (productDetails.productId) {
                return getFullSizeUrl();
            } else {
                return null;
            }
        } else if (isSample && !currentSku.fullSizeProductUrl) {
            return null;
        } else {
            return getTargetUrl();
        }
    },

    // CRMTS-58: Calculate 15% discount to support credit card a/b test
    getDiscountValue: async function ({ listPrice, salePrice }) {
        let price = salePrice || listPrice;
        const basketUtils = (await import(/* webpackChunkName: "priority" */ './Basket')).default;
        const parsedPrice = this.parsePrice(basketUtils.removeCurrency(price));

        if (!parsedPrice) {
            return [];
        }

        const firstBuyIncentive = (Sephora.configurationSettings.firstBuyIncentive || 25) / 100;

        let creditCardDiscountValue = (parsedPrice * firstBuyIncentive).toFixed(2);

        if (price.includes(',')) {
            if (localeUtils.isFrench()) {
                creditCardDiscountValue = creditCardDiscountValue.replace('.', ',');
            } else {
                price = creditCardDiscountValue.replace(',', '');
            }
        }

        return [price.replace(/(\d+(?:[,.]\d*)?)/g, creditCardDiscountValue)];
    },

    getProductVariations: function ({ product = {}, sku = {} } = {}) {
        return {
            product: {
                variationType: product.variationType,
                variationTypeDisplayName: product.variationTypeDisplayName
            },
            sku: {
                variationType: sku.variationType,
                variationTypeDisplayName: sku.variationTypeDisplayName,
                variationValue: sku.variationValue,
                variationDesc: sku.variationDesc,
                isOnlyFewLeft: sku.isOnlyFewLeft
            }
        };
    },

    getProductvariationTypeDisplayName: function (product, sku) {
        return (
            (product || sku).variationTypeDisplayName &&
            !this.isFragrance(product, sku) &&
            `${(product || sku).variationTypeDisplayName.toUpperCase()}: `
        );
    },

    getProductPageSamples: function (items) {
        return items.filter(item => this.isPDPSample(item.sku));
    },

    getFilteredSamples: function (samples, excludeProductSamples = true) {
        if (excludeProductSamples) {
            return samples.filter(sample => !this.isPDPSample(sample.sku));
        }

        return samples;
    }
};

export default skuUtil;
