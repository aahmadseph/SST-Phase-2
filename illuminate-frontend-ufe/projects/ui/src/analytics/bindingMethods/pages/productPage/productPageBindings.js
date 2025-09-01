import anaConsts from 'analytics/constants';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import Storage from 'utils/localStorage/Storage';
import StorageConst from 'utils/localStorage/Constants';
import store from 'Store';
import userUtils from 'utils/User';

export default (function () {
    //Product Page Binding Methods
    return {
        buildBreadCrumbsForBraze: function (breadCrumbs = []) {
            const levelKeys = ['categoryName', 'topLevelName', 'nthLevelName'];
            const dataForBraze = breadCrumbs.reduce((data, crumb, i) => {
                if (levelKeys[i]) {
                    data[levelKeys[i]] = crumb;
                }

                return data;
            }, {});

            return dataForBraze;
        },

        /* Change the string we get from the API to what analysts want to see */
        convertSkuType: (type = '') => {
            switch (type.toLowerCase()) {
                case 'gift card':
                    return 'giftcard';
                default:
                    return type;
            }
        },

        /**
         * Add an item to the product array;
         */
        populatePrimaryProductObject: function (product) {
            const {
                skuId,
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
                isLimitedTimeOffer = false,
                isBiReward = false
            } = product.currentSku;

            const { suggestedUsage, lovesCount, reviews } = product.productDetails;

            const priceProperties = {
                price: salePrice ? salePrice : listPrice,
                originalPrice: listPrice
            };

            Object.assign(priceProperties, salePrice ? { salePrice } : {});

            const valuePriceTrimmed = valuePrice && valuePrice.slice(valuePrice.indexOf('$'), valuePrice.indexOf('v') - 1);
            Object.assign(priceProperties, valuePriceTrimmed ? { valuePrice: valuePriceTrimmed } : {});

            const attributesObj = {
                customizableSetType: this.getCustomizableSetsKey(product),
                isNew,
                isSephoraExclusive,
                isLimitedEdition,
                isOnlineOnly,
                isOnlyFewLeft,
                isAppExclusive,
                isFirstAccess,
                isLimitedTimeOffer,
                rating: product.productDetails.rating || '',
                skuId,
                type: this.convertSkuType(type),
                typeForPixel: type,
                variationType: variationType || product.variationType,
                variationValue,
                world: this.getProductWorld(product),
                isOutOfStock,
                nthLevelCategory: product?.parentCategory?.displayName,
                image: product?.currentSku?.skuImages?.image250,
                productUrl: product.fullSiteProductUrl,
                preferredStore: userUtils.getPreferredStoreId(),
                suggestedUsage,
                lovesCount,
                reviews,
                isBiReward,
                nthLevelCategoryId: product?.parentCategory?.categoryId,
                parentCategory: product?.parentCategory?.parentCategory
            };

            Object.assign(attributesObj, priceProperties);

            const productDetails = product.productDetails;

            if (digitalData.product.length > 0) {
                const lastProduct = digitalData.product[digitalData.product.length - 1];

                if (lastProduct?.productInfo?.productID === productDetails.productId) {
                    return;
                }
            }

            digitalData.product.push({
                attributes: attributesObj,
                productInfo: {
                    description: productDetails.shortDescription && productDetails.shortDescription.replace(/<\/?\w+[^>]*\/?>/g, ''),
                    manufacturer: productDetails?.brand?.displayName || '',
                    productID: productDetails.productId,
                    productName: productDetails.displayName
                }
            });
        },

        getProductWorld: function (child) {
            if (child.parentCategory) {
                return this.getProductWorld(child.parentCategory);
            } else if (skuUtils.isBiReward(child.currentSku)) {
                return 'n/a';
            } else {
                return (child.displayName && child.displayName.toLowerCase()) || '';
            }
        },
        /**
         * @returns {Array} The current load page events
         */
        getPageEvents: function () {
            const events = digitalData.page.attributes.eventStrings;
            const product = store.getState().page.product;

            events.push('prodView');
            events.push(anaConsts.Event.PRODUCT_VIEW);
            events.push(anaConsts.Event.PRODUCT_PAGE_VIEW);

            const replenishAvailable = product.currentSku.isReplenishmentEligible
                ? anaConsts.PRODUCT_AUTO_REPLENISH_ELIGIBLE.AVAILABLE
                : product.regularChildSkus?.some(prod => prod.isReplenishmentEligible)
                    ? anaConsts.PRODUCT_AUTO_REPLENISH_ELIGIBLE.NOT_ALL_SKUS_AVAILABLE
                    : anaConsts.PRODUCT_AUTO_REPLENISH_ELIGIBLE.NOT_AVAILABLE;
            events.push(`${anaConsts.Event.EVENT_248}=${replenishAvailable}`);
            const isCleanProduct = skuUtils.isCleanProduct(product.specialProdCategories);
            const isColorIQEnabled = skuUtils.isColorIQEnabled(product);

            if (isColorIQEnabled) {
                events.push(anaConsts.Event.PRODUCT_PAGE_COLORIQ_ENABLED);
            } else if (isCleanProduct) {
                events.push(anaConsts.Event.PRODUCT_CLEAN_LABEL);
                digitalData.page.attributes.specialProdCategories = product.specialProdCategories;
            }

            return events;
        },

        /**
         * Builds and returns the data that we want to know about this product
         * @param  {Object} currentProduct The product object to get data from
         * @return  {String} The analytics data for the product
         * Format: ;SKUID;;;;eVar26=SKUID|eVar37=[USE CASE#]|
         *         eVar52=Rec_PrevPgType_CarouselName_AudienceID_ExperienceID
         */
        getProductStrings: function (currentProduct, currentSku = {}) {
            const isRougeRewardCard = skuUtils.isRougeRewardCard(currentSku);

            const previousPageData = digitalData.page.attributes.previousPageData;

            const componentTitle = previousPageData?.recInfo?.componentTitle;
            const {
                READY_TO_CHECKOUT, CHOSEN_FOR_YOU, SELLING_FAST, NEW_ARRIVALS, VALUE_SETS
            } = anaConsts.COMPONENT_TITLE;
            const componentTitleConstants = [READY_TO_CHECKOUT, CHOSEN_FOR_YOU, SELLING_FAST, NEW_ARRIVALS, VALUE_SETS];

            const eVar = 'eVar37=' + currentProduct.attributes.customizableSetType;

            const productString = [';' + currentProduct.attributes.skuId + ';;;;eVar26=' + currentProduct.attributes.skuId, eVar];

            // CRMTS-418 Analytics for checkout component on homepage a/b test
            if (componentTitleConstants.indexOf(componentTitle?.trim()) !== -1) {
                productString.push('eVar69=' + previousPageData.recInfo.componentTitle);
            }

            const buildeVar52 = () => {
                const recType = previousPageData.recInfo.isExternalRec ? 'constructor' : 'sephora';
                const previousPageType = previousPageData.pageType || 'n/a';
                const podId = previousPageData.recInfo.podId || 'n/a';
                let carouselName = 'n/a';

                if (previousPageData.recInfo.componentTitle) {
                    switch (previousPageData.recInfo.componentTitle) {
                        case anaConsts.COMPONENT_TITLE.PRODUCTS_GRID: {
                            carouselName = anaConsts.COMPONENT_TITLE.SKUGRID;

                            break;
                        }

                        case anaConsts.COMPONENT_TITLE.READY_TO_CHECKOUT: {
                            carouselName = anaConsts.COMPONENT_TITLE.READY_TO_CHECKOUT;

                            break;
                        }

                        default: {
                            carouselName = previousPageData.recInfo.componentTitle;

                            break;
                        }
                    }
                }

                return `${recType}_${previousPageType}_${carouselName}_${podId}`;
            };

            //eVar52 should only be present in s.products if user clicked on product image
            //to get to ppage. ILLUPH-91163.
            if (digitalData.page.attributes.internalCampaign && !isRougeRewardCard) {
                productString.push('eVar52=' + buildeVar52());
            }

            const productStringWithoutEmptyValues = productString.filter(Boolean);

            return productStringWithoutEmptyValues.join('|').toLowerCase();
        },

        /**
         * Determine the key used later to tell which type of custom set this product is
         * @return {String} One of the following strings indicating the type of custom set
         */
        getCustomizableSetsKey: function (product) {
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
        },

        /**
         * Kick off all the methods that use product data to populate analytics objects
         * @returns {void}.
         */
        initializeAnalyticsObjectWithProductData: function () {
            const currentProduct = store.getState().page.product;
            this.populatePrimaryProductObject(currentProduct);

            //ToDo: Figure out where this should live
            const pageVariants = this.getPageVariants(currentProduct);
            // eslint-disable-next-line no-undef
            const { attributes } = digitalData.page;
            attributes.featureVariantKeys = attributes.featureVariantKeys.concat(pageVariants);
            Sephora.analytics.resolvePromises.analyticsProductDataReady();

            const items = [];
            const createItems = function ({ displayName, targetUrl, parentCategory }) {
                const item = {};
                item.displayName = displayName;
                item.targetUrl = targetUrl;
                items.push(item);

                return parentCategory ? createItems(parentCategory) : items.reverse();
            };

            if (currentProduct.parentCategory) {
                this.categoryBreadCrumbItems = createItems(currentProduct.parentCategory);
            }

            digitalData.page.pageInfo.breadcrumbs = this.categoryBreadCrumbItems;
        },

        /* eslint-disable-next-line complexity */
        getPageVariants: function (currentProduct) {
            const variantKeys = [];
            const {
                productDetails = {},
                ancillarySkus = [],
                currentSku,
                hoveredSku,
                productVideos = [],
                productArticles = [],
                recentlyViewedSkus = [],
                similarSkus = [],
                ymalSkus = []
            } = currentProduct;

            const { alternateImages = [], ingredientDesc, isOnlyFewLeft } = hoveredSku || currentSku;

            if (currentProduct.skuSelectorType !== skuUtils.skuSwatchType.NONE) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.SWATCHES);
            }

            if (isOnlyFewLeft) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.ONLY_FEW_LEFT);
            }

            if (alternateImages.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.ALTERNATE_IMAGES);
            }

            const localizedProductVideos = productVideos.filter(
                item =>
                    !item.styleList ||
                    (localeUtils.isFRCanada() && item.styleList['FR_CA_SHOW'] !== undefined) ||
                    (!localeUtils.isFRCanada() && item.styleList['FR_CA_HIDE'] !== undefined)
            );

            if (localizedProductVideos.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.HERO_VIDEOS);
            }

            if (productDetails?.suggestedUsage) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.HOW_TO_USE_TAB);
            }

            if (ingredientDesc) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.INGREDIENTS_TAB);
            }

            if (ancillarySkus.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.USE_IT_WITH);
            }

            if (productArticles.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.EXPLORE_ARTICLES);
            }

            //Photos section under Learn More(Key: 10) is reported in ExploreThisProduct.jsx

            if (ymalSkus.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.YOU_MIGHT_ALSO_LIKE);
            }

            //'12' - Similar Products Module
            if (similarSkus.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.SIMILAR_PRODUCTS);
            }

            if (recentlyViewedSkus.length) {
                variantKeys.push(anaConsts.PAGE_VARIANTS.RECENTLY_VIEWED);
            }

            return variantKeys;
        },

        /**
         * Returns the value for evar6 (Product Finding Method)
         */
        getProductFindingValue: function () {
            const sessionStoragePageFlagExists = Storage.session.getItem(StorageConst.PAGE_LOAD_FLAG);
            const ursTrackingCode = digitalData.page.attributes.campaigns.ursTrackingCode;

            if (!sessionStoragePageFlagExists) {
                return 'Direct Entry by ' + (ursTrackingCode ? ursTrackingCode : 'Bookmark/Typed');
            } else {
                return 'D=pageName';
            }
        }
    };
}());
