import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import { Container } from 'components/ui';
import analyticsConsts from 'analytics/constants';
import BackToTopButton from 'components/BackToTopButton/BackToTopButton';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'Actions';
import ProductActions from 'actions/ProductActions';
import AddToBasketActions from 'actions/AddToBasketActions';
import ProductPageSEO from 'components/ProductPage/ProductPageSEO/ProductPageSEO';
import DigitalProduct from 'components/ProductPage/Type/DigitalProduct/DigitalProduct';
import SDUProductPage from 'components/ProductPage/Type/DigitalProduct/SDUProductPage';
import RegularProduct from 'components/ProductPage/Type/RegularProduct';
import RewardProduct from 'components/ProductPage/Type/RewardProduct/RewardProduct';
import SetPageAnalyticsProps from 'components/Analytics';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageBindings';
import skuUtils from 'utils/Sku';
import skuHelpers from 'utils/skuHelpers';
import store from 'store/Store';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import Location from 'utils/Location';
import { PostLoad } from 'constants/events';
import MobileStickyMenu from 'components/ProductPage/MobileStickyMenu/MobileStickyMenu.ctrlr';
import { breakpoints } from 'style/config';
import actions from 'actions/Actions';
import { Pages } from 'constants/Pages';
import basketConstants from 'constants/Basket';

const getBasketText = localeUtils.getLocaleResourceFile('actions/locales', 'BasketActions');
const getText = localeUtils.getLocaleResourceFile('pages/Product/locales', 'ProductPage');
const { BasketType, DEEPLINK_ADD_TO_BASKET_SOURCES } = basketConstants;
const {
    DEEPLINK_US_SMS, DEEPLINK_CA_SMS, DEEPLINK_US_EMAIL, DEEPLINK_CA_EMAIL, REPLEN_US_SMS, REPLEN_CA_SMS
} = DEEPLINK_ADD_TO_BASKET_SOURCES;

const {
    PRODUCT_IDS: { SAMPLE },
    SKU_ID_PARAM,
    skuTypes: { REWARD, ROUGE_REWARD_CARD, STANDARD, SDU }
} = skuUtils;
const {
    SKU_UPDATE_SOURCE: { QUERY_STRING }
} = ProductActions;

const SKU_DATA_READY = 'skuDataReady';
const USER_SPECIFIC_DATA_READY = 'userSpecificDataReady';

const ADD_TO_BASKET_PARAM = 'om_mmc';
const ADD_TO_BASKET_MAPPING = {
    [ADD_TO_BASKET_PARAM]: [DEEPLINK_US_SMS, DEEPLINK_CA_SMS, DEEPLINK_US_EMAIL, DEEPLINK_CA_EMAIL, REPLEN_US_SMS, REPLEN_CA_SMS]
};
const ADD_TO_BASKET_DEFAULT_QTY = 1;

class ProductPage extends BaseClass {
    constructor(props) {
        super(props);
        const {
            page: { product }
        } = store.getState();

        this.state = { product, showStickyMenu: false, alreadyTriedToAddProductToBasket: false };
    }

    shouldSendAnalytics = {
        [SKU_DATA_READY]: false,
        [USER_SPECIFIC_DATA_READY]: false
    };

    componentDidMount() {
        store.setAndWatch('page.product', this, null, true);
        store.setAndWatch('page.product.isUserSpecificReady', this, userSpecificFlag => {
            if (userSpecificFlag?.isUserSpecificReady) {
                this.initializeAnalyticsIfAllDataReady(USER_SPECIFIC_DATA_READY);
            }
        });

        const Events = require('utils/framework/Events').default;
        // Wait for the initial personalized product gets into the store
        Events.onLastLoadEvent(window, [Events.ProductInfoReady], () => {
            userUtils.validateUserStatus().then(() => {
                store.setAndWatch('user', this, (newData, oldData) => {
                    const userIsUpdatedForTheFirstTime = newData.user && !oldData;
                    const userProfileHasChanged = newData.user.profileId !== oldData?.user.profileId;

                    if (!userIsUpdatedForTheFirstTime && userProfileHasChanged) {
                        store.dispatch(ProductActions.updateProductWithUserSpecificData());
                    }

                    // Make sure we call `addToBasketFromURLParameter` method just once,
                    // regardless of new user data
                    if (this.state.alreadyTriedToAddProductToBasket === false) {
                        this.setState({
                            alreadyTriedToAddProductToBasket: true
                        });

                        // This is the spot where it's safe to call this method, giving that
                        // for basket inclusion, we need to have user and product data at hand.
                        this.addToBasketFromURLParameter();
                    }
                });
            });
        });

        const showStickyMenu = Sephora.isMobile() && window.matchMedia(breakpoints.xsMax).matches;
        this.setState({ showStickyMenu });

        Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
            if (!this.state?.product?.currentSku?.isOutOfStock) {
                this.addItemsFromTsl();
            }
        });
    }

    componentDidUpdate(_prevProps, prevState) {
        if (prevState.product?.productDetails?.productId !== this.state.product?.productDetails?.productId) {
            this.shouldSendAnalytics[USER_SPECIFIC_DATA_READY] = false;
        }

        // Swatch Changes require to update the digitalData.product value. Otherwise it is empty on every change.
        if (prevState.product?.currentSku?.displayName !== this.state.product?.currentSku?.displayName) {
            productPageBindings.initializeAnalyticsObjectWithProductData();
        }
    }

    shouldComponentUpdate(_nextProps, nextState) {
        const {
            product: { currentSku, errorCode, productDetails }
        } = this.state;
        const currentSkuType = skuUtils.getProductType(currentSku);
        const nextSkuType = skuUtils.getProductType(nextState.product.currentSku);

        return (
            nextState.product.errorCode !== errorCode ||
            nextSkuType !== currentSkuType ||
            nextState.product.productDetails?.productId !== productDetails?.productId
        );
    }

    addItemsFromTsl = () => {
        const currentUrl = window.location.href;
        const { product } = this.state;
        const currentSku = product.currentSku;

        if (currentUrl.includes('c3ch=Linkshare') && currentUrl.includes(`c3nid=${Pages.tslId}`)) {
            try {
                store.dispatch(
                    AddToBasketActions.addToBasket(currentSku, BasketType.Standard, ADD_TO_BASKET_DEFAULT_QTY, () => {
                        if (window.matchMedia(breakpoints.smMin).matches) {
                            store.dispatch(
                                actions.showAddToBasketModal({
                                    product: product,
                                    sku: currentSku,
                                    quantity: ADD_TO_BASKET_DEFAULT_QTY,
                                    isOpen: true
                                })
                            );
                        }
                    })
                );
            } catch {
                store.dispatch(
                    Actions.showInfoModal({
                        isOpen: true,
                        message: getBasketText('genericErrorTitle'),
                        buttonText: getBasketText('gotIt')
                    })
                );
            }
        }
    };

    render() {
        // This should be broken down and accessed from subcomponents that need specific
        // data rather than being pass through the high level page components
        const {
            product,
            product: { currentSku }
        } = this.state;

        // We do not currently re-evaluate product type when a user change sku on a page.  This means
        // that the product type (and thus the product page type to display) is determined on initial
        // render.  If we ever introduce products with skus of different types, we will need to address
        // this (and also address how it should behave, since in theory it would currently render
        // completely differrent pages as the user changed skus).
        const currentSkuType = skuUtils.getProductType(currentSku);
        let pageType = analyticsConsts.PAGE_TYPES.PRODUCT;
        let content;

        switch (currentSkuType) {
            case ROUGE_REWARD_CARD: {
                const { rewardPoints, rewardValue } = currentSku;
                let subtitle = '';

                if (rewardPoints && rewardValue) {
                    subtitle = getText('subtitle', [rewardPoints, rewardValue]);
                }

                pageType = analyticsConsts.PAGE_TYPES.REWARDS;
                content = (
                    <DigitalProduct
                        subtitle={subtitle}
                        processSkuId={this.processSkuId}
                    />
                );

                break;
            }
            case REWARD: {
                pageType = analyticsConsts.PAGE_TYPES.REWARDS;
                content = <RewardProduct processSkuId={this.processSkuId} />;

                break;
            }
            case SDU: {
                content = (
                    <SDUProductPage
                        skipConfirmationModal={true}
                        processSkuId={this.processSkuId}
                    />
                );

                break;
            }
            case STANDARD:
            default: {
                content = <RegularProduct processSkuId={this.processSkuId} />;

                break;
            }
        }

        const showStickyMenu = currentSkuType === STANDARD && this.state.showStickyMenu;

        return (
            <Container
                is='main'
                data-at={Sephora.debug.dataAt('pdp_page_container')}
            >
                {showStickyMenu && <MobileStickyMenu />}
                <SetPageAnalyticsProps
                    pageType={pageType}
                    pageName={product?.productDetails?.productId}
                />
                {content}
                {!showStickyMenu && <BackToTopButton analyticsLinkName={analyticsConsts.LinkData.BACK_TO_TOP} />}
                <ProductPageSEO product={product} />
            </Container>
        );
    }

    initializeAnalyticsIfAllDataReady = keyThatsReady => {
        if (Object.values(this.shouldSendAnalytics).every(x => x)) {
            return; // already sent
        }

        this.shouldSendAnalytics[keyThatsReady] = true;

        if (Object.values(this.shouldSendAnalytics).every(x => x)) {
            productPageBindings.initializeAnalyticsObjectWithProductData();
        }
    };

    processSkuId = component => {
        const {
            page: {
                product,
                product: { productDetails }
            }
        } = store.getState();
        let skuId = urlUtils.getParamsByName(SKU_ID_PARAM);
        component.isSkuReady = true;
        const dispatchParams = { disableDispatchWarning: true };

        if (Array.isArray(skuId) && skuId.length > 0) {
            skuId = skuId[0];

            // TODO: Remove sample specific code if we kill sample ppages.  Otherwise, find more elegant
            // solution (separate component for samples?
            // If we have a sample, we have to get the full product data
            // Note: we check by sample product id here because we don't have the full sku data to
            // check skuType
            if ((productDetails || product).productId === SAMPLE) {
                store.dispatch(ProductActions.fetchCurrentProduct(SAMPLE, skuId), dispatchParams);
            } else {
                const skuFromProduct = skuHelpers.getSkuFromProduct(product, skuId);

                // Confirm that this sku is present in the product
                if (skuFromProduct) {
                    store.dispatch(ProductActions.updateSkuInCurrentProduct(skuFromProduct, QUERY_STRING), dispatchParams);
                }
            }
        }

        // this call should be made at the end of this method, so at this point all SKU data will be updated and ready to use
        this.initializeAnalyticsIfAllDataReady(SKU_DATA_READY);
    };

    addToBasketSuccess = () => {
        Location.navigateTo(null, '/basket');
    };

    addToBasketFailure = error => {
        store.dispatch(Actions.showInterstice(false));

        if (error.errorMessages) {
            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    message: error.errorMessages[0],
                    buttonText: getBasketText('gotIt')
                })
            );
        }
    };

    addToBasketFromURLParameter = async () => {
        const addToBasketURLQuery = urlUtils.getParamsByName(ADD_TO_BASKET_PARAM);
        const addToBasketURLParam = addToBasketURLQuery ? addToBasketURLQuery[0] : null;

        // If no valid URL param, skip functionality
        if (!addToBasketURLParam) {
            return;
        }

        const { product } = this.state;
        const { basket } = store.getState();
        const currentSku = product.currentSku;

        // Before proceeding, we should see if URL param is appropriate
        if (
            ADD_TO_BASKET_MAPPING[ADD_TO_BASKET_PARAM] &&
            ADD_TO_BASKET_MAPPING[ADD_TO_BASKET_PARAM].find(mappedParam => mappedParam === addToBasketURLParam)
        ) {
            // Make sure product is not already in basket
            if (Array.isArray(basket.items) && basket.items.find(basketItem => basketItem.sku.skuId === currentSku.skuId)) {
                store.dispatch(
                    Actions.showInfoModal({
                        isOpen: true,
                        message: getBasketText('alreadyInCart'),
                        buttonText: getBasketText('gotIt')
                    })
                );

                return;
            }

            try {
                store.dispatch(Actions.showInterstice(true));

                await store.dispatch(AddToBasketActions.addToBasket(currentSku, false, ADD_TO_BASKET_DEFAULT_QTY, this.addToBasketSuccess));
            } catch (e) {
                this.addToBasketFailure(e);
            }
        }
    };
}

export default wrapComponent(ProductPage, 'ProductPage', true);
