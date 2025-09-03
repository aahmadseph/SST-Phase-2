/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import productUtils from 'utils/product';
import store from 'Store';
import watch from 'redux-watch';
import ProductActions from 'actions/ProductActions';

import RateAndReview from 'components/AddReview/RateAndReview/RateAndReview';
import SelectShade from 'components/AddReview/SelectShade/SelectShade';
import PostingConfirmation from 'components/AddReview/PostingConfirmation/PostingConfirmation';
import AboutMe from 'components/AddReview/AboutMe/AboutMe';

import authentication from 'utils/Authentication';
import Location from 'utils/Location';
import communityUtils from 'utils/Community';
import UrlUtils from 'utils/Url';
import skuUtils from 'utils/Sku';
import UI from 'utils/UI';
import userUtil from 'utils/User';
import Iovation from 'utils/Iovation';
import herlpersUtils from 'utils/Helpers';
import userUtils from 'utils/User';
import biUtils from 'utils/BiProfile';
import Storage from 'utils/localStorage/Storage';

import bvService from 'services/api/thirdparty/BazaarVoice';
import lithiumApi from 'services/api/thirdparty/Lithium';
import sessionExtensionService from 'services/SessionExtensionService';
import profileApi from 'services/api/profile';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import productPageBindings from 'analytics/bindingMethods/pages/productPage/productPageBindings';
import { PostLoad } from 'constants/events';
import beautyUtils from 'utils/BeautyPreferencesRedesigned';

const { getProp } = herlpersUtils;

let readyForAnalytics;
let initialLoadOccurred = false;

const forBV = 'forBV';

// Set to true only if the user cancelled out of social login prior to the product response
// returning.
let isRedirectNeeded = false;

const redirectToProductPage = productPageUrl => {
    if (!productPageUrl) {
        return;
    }

    Location.setLocation(productPageUrl);
};

const ABOUT_ME_QUESTIONS = [
    biUtils.TYPES.SKIN_TYPE,
    biUtils.TYPES.SKIN_CONCERNS,
    biUtils.TYPES.SKIN_TONE,
    biUtils.TYPES.AGE_RANGE,
    biUtils.TYPES.HAIR_COLOR,
    biUtils.TYPES.HAIR_TYPE,
    biUtils.TYPES.HAIR_CONCERNS,
    biUtils.TYPES.EYE_COLOR
];

const ADD_REVIEW_PAGES_NAMES = {
    SHADES: 'SHADES',
    RATE_AND_REVIEW: 'RATE_AND_REVIEW',
    ABOUT_YOU: 'ABOUT_YOU',
    CONFIRMATION: 'CONFIRMATION'
};

class AddReviewCarousel extends BaseClass {
    state = {
        currentProduct: null,
        user: {},
        refinements: [],
        submitData: {},
        isUserReviewAllowed: false,
        currentPage: 0,
        totalReviews: 0
    };

    componentDidMount() {
        let productId = null;
        let skuId = null;

        if (window != null) {
            Sephora.Util.onLastLoadEvent(window, [PostLoad], () => {
                Iovation.loadIovationScript();
                Iovation.getBlackboxString([], true).then(blackBoxString => {
                    this.setState({ deviceData: blackBoxString });
                });
            });
        }

        store.setAndWatch('historyLocation', this, data => {
            if (!data.historyLocation?.queryParams?.skuId) {
                this.setState({ skipShades: false, currentPage: 0 });
            }
        });

        // path should be /{productId}/review
        const loc = Location.getLocation(true);

        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(this.props.requestCounter);

        if (loc.pathname) {
            const match = loc.href.match(/productId=(P\d+)/i);

            if (match) {
                productId = match[1];
            }

            skuId = UrlUtils.getParamsByName('skuId');
        } else {
            // if we cannot parse out the product ID (should never happen given the spring rules)
        }

        const getProduct = new Promise(resolve => {
            const watchCurrentProduct = watch(store.getState, 'page.product');
            this.unsubscribeCurrentProduct = store.subscribe(
                watchCurrentProduct(currentProduct => {
                    if (currentProduct.variationType) {
                        const { content = {} } = currentProduct;

                        if (isRedirectNeeded) {
                            redirectToProductPage(content.targetUrl);
                        } else {
                            if (skuId || currentProduct.variationType !== skuUtils.skuVariationType.COLOR) {
                                this.setState({ skipShades: true }, resolve);
                            } else {
                                resolve();
                            }

                            this.setState({ currentProduct });
                        }
                    }
                }),
                this
            );
        });

        store.dispatch(ProductActions.fetchCurrentProduct(productId, skuId));

        const getReviewData = new Promise(resolve => {
            authentication
                .requireLoggedInAuthentication()
                .then(() => communityUtils.ensureUserIsReadyForSocialAction(communityUtils.PROVIDER_TYPES.bv))
                .then(() => {
                    this.setState({ isUserReviewAllowed: true });
                    resolve();
                })
                .catch(() => {
                    // If the user cancels at any state of signin then redirect to product page.
                    // If the product response has already returned, we can redirect immediately.
                    // Otherwise, we have to wait for the product response to get the seo friend url
                    if (this.state.currentProduct) {
                        redirectToProductPage(this.state.currentProduct?.content?.seoCanonicalUrl || this.state.currentProduct?.seoCanonicalUrl);
                    } else {
                        isRedirectNeeded = true;
                    }
                });
        });

        Sephora.analytics.initialLoadDependencies.push(
            new Promise(resolve => {
                readyForAnalytics = resolve;
            })
        );

        Promise.all([getProduct, getReviewData]).then(() => this.sendAnalytics());

        const storageKey = bvService.getStorageKeyForProductReview(productId);
        const productReviewData = Storage.local.getItem(storageKey);
        this.setState({ productReviewData: productReviewData });
    }

    componentWillUnmount() {
        if (this.unsubscribeCurrentProduct) {
            this.unsubscribeCurrentProduct();
        }
    }

    render() {
        this.addReviewPages = [];

        if (!this.state.currentProduct) {
            return null;
        } else if (this.state.currentProduct.errorCode) {
            return <div>{this.state.currentProduct.errorMessages.join(' ')}</div>;
        }

        const items = this.getItems();
        const component = items[this.state.currentPage];

        return this.state.isUserReviewAllowed || !userUtil.isSignedIn() ? <main>{component}</main> : null;
    }

    submitReview = submitData => {
        const { currentProduct } = this.state;
        const productDetails = currentProduct.productDetails;
        let productId;
        let preferredSku = forBV;
        const productRootParentCategoryId = this.findCurrentProductParentCategory();
        const world = beautyUtils.getMasterListRefinementWorldByCategoryId(productRootParentCategoryId);

        // if the product does not have skus that are color swatch based, then submit productId
        // else submit the skuId
        // this is because as of sprint 2017.6, the only skuIds submitted as a 'productId'
        // to BV's feed from Sephora are those that have color swatches
        if (currentProduct.variationType !== skuUtils.skuVariationType.COLOR) {
            productId = productDetails.productId;
        } else {
            productId = currentProduct.currentSku.skuId;
            preferredSku = currentProduct.currentSku.skuId;
        }

        profileApi.getUserSpecificProductDetails(productDetails.productId, preferredSku, true).then(data => {
            bvService
                .submitReview({
                    productId: productId,
                    title: submitData.reviewTitle,
                    rating: submitData.rating,
                    isRecommended: submitData.isRecommended,
                    reviewText: submitData.reviewText,
                    photos: submitData.photos,
                    isFreeSample: submitData.isFreeSample,
                    isSephoraEmployee: submitData.isSephoraEmployee,
                    userId: userUtils.getProfileId(),
                    verifiedPurchaser: data.currentSku.actionFlags.verifiedPurchase,
                    bazaarvoiceUasToken: data.currentSku.actionFlags.bazaarvoiceUasToken,
                    fp: this.state.deviceData,
                    world: world
                })
                .then(() => {
                    // Call the Gamification Engagement API
                    const INTERACTION_TYPE = 'review_posted';
                    const INCREMENT_AMOUNT = 1;
                    lithiumApi.incrementUserScore(INTERACTION_TYPE, INCREMENT_AMOUNT);

                    this.onNext();
                })
                .catch(err => {
                    const { errors } = err;
                    let submissionErrors = [];

                    if (errors instanceof Array) {
                        submissionErrors = errors.map(error => error.Message);
                    } else if (typeof errors === 'object' && errors.message) {
                        submissionErrors.push(errors.message);
                    }

                    this.setState({ submissionErrors: submissionErrors }, () => this.onNext());
                });
        });
    };

    getItems = () => {
        const skipShades = this.state.skipShades;
        const items = [];

        if (!skipShades) {
            items.push(this.getShades());
        }

        items.push(this.getRateAndReview());

        const aboutYou = this.getAboutYou();

        if (aboutYou) {
            items.push(aboutYou);
        }

        items.push(this.getConfirmation());

        return items;
    };

    getShades = () => {
        const key = ADD_REVIEW_PAGES_NAMES.SHADES;
        this.addReviewPages.push(key);

        return (
            <SelectShade
                key={key}
                product={this.state.currentProduct}
                onNext={this.onNext}
            />
        );
    };

    getRateAndReview = () => {
        const key = ADD_REVIEW_PAGES_NAMES.RATE_AND_REVIEW;
        this.addReviewPages.push(key);

        return (
            <RateAndReview
                key={key}
                product={this.state.currentProduct}
                onNext={this.onNext}
            />
        );
    };

    findCurrentProductParentCategory = () => {
        return productUtils.findProductRootParentCategoryId(this.state.currentProduct.parentCategory);
    };

    getAboutYou = () => {
        const { customerPreference = {} } = store.getState().user || {};
        const aboutMeBiTraits = [];
        const key = ADD_REVIEW_PAGES_NAMES.ABOUT_YOU;
        const productRootParentCategoryId = this.findCurrentProductParentCategory();
        const world = beautyUtils.getBeautyPreferencesWorldPageInfo(undefined, productRootParentCategoryId);

        if (!world) {
            return null;
        }

        world.refinements?.forEach(refinement => {
            const savedPreference = customerPreference[world.key]?.[refinement.key];
            const isPreferenceEmpty = !savedPreference?.length;
            const isRefinementQuestionAvailable = ABOUT_ME_QUESTIONS.includes(refinement.key);

            if (isPreferenceEmpty && isRefinementQuestionAvailable) {
                aboutMeBiTraits.push(refinement.key);
            }
        });

        if (!aboutMeBiTraits.length) {
            return null;
        }

        this.addReviewPages.push(key);

        return (
            <AboutMe
                key={key}
                product={this.state.currentProduct}
                onSubmit={() => this.submitReview(this.state.submitData)}
                aboutMeBiTraits={aboutMeBiTraits}
                world={world}
            />
        );
    };

    getConfirmation = () => {
        const key = ADD_REVIEW_PAGES_NAMES.CONFIRMATION;
        this.addReviewPages.push(key);
        const productURL = this.state.currentProduct.targetUrl;

        return (
            <PostingConfirmation
                key={key}
                submissionErrors={this.state.submissionErrors}
                productURL={productURL}
            />
        );
    };

    onNext = (rateAndReviewData = {}) => {
        let { currentPage } = this.state;
        currentPage++;
        this.sendAnalytics(currentPage);

        if (Object.keys(rateAndReviewData).length > 0) {
            this.setState({ submitData: Object.assign({}, this.state.submitData, rateAndReviewData) }, () => {
                const showAboutMe = this.getAboutYou();

                if (showAboutMe) {
                    this.setState({ currentPage });
                    UI.scrollToTop();
                } else {
                    const reviewWithVerfiedPurchaser = Object.assign({}, this.state.submitData);
                    this.submitReview(reviewWithVerfiedPurchaser);
                }
            });
        } else {
            this.setState({ currentPage });
            UI.scrollToTop();
        }
    };

    sendAnalytics = (currentNumber = 0) => {
        const currentPage = this.addReviewPages[currentNumber];
        const pageType = anaConsts.PAGE_TYPES.PRODUCT_REVIEW;
        let pageDetail;
        let pageName;
        const world = productPageBindings.getProductWorld(this.state.currentProduct) || 'n/a';
        const recentEvent = anaUtils.getLastAsyncPageLoadData(null, true);

        switch (currentPage) {
            case ADD_REVIEW_PAGES_NAMES.SHADES:
                pageDetail = anaConsts.PAGE_DETAIL.ADD_REVIEW_SELECT_SKU;
                pageName = [pageType, pageDetail, world + ':*'].join(':');

                //Do we need this first scenario at all? Will this ever be an async page load?
                if (initialLoadOccurred) {
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            pageName,
                            pageType,
                            pageDetail
                        }
                    });
                } else {
                    digitalData.page.category.pageType = pageType;
                    digitalData.page.pageInfo.pageName = pageDetail;
                    digitalData.page.attributes.world = world;
                }

                break;
            case ADD_REVIEW_PAGES_NAMES.RATE_AND_REVIEW:
                pageDetail = anaConsts.PAGE_DETAIL.ADD_REVIEW_WRITE;
                pageName = [pageType, pageDetail, world + ':*'].join(':');

                //Yes, we need this. Sometimes it can be the first page instead of "shades"
                if (initialLoadOccurred) {
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            pageName,
                            pageType,
                            pageDetail,
                            eventStrings: [anaConsts.Event.ADD_REVIEW_RATE_AND_REVEW],
                            productStrings: anaUtils.buildSingleProductString({ sku: this.state.currentProduct.currentSku })
                        }
                    });
                } else {
                    digitalData.page.category.pageType = pageType;
                    digitalData.page.pageInfo.pageName = pageDetail;
                    digitalData.page.attributes.world = world;
                    digitalData.page.attributes.productStrings.push(anaUtils.buildSingleProductString({ sku: this.state.currentProduct.currentSku }));
                }

                digitalData.page.attributes.brandName = this.state.currentProduct.productDetails?.brand?.displayName || '';
                digitalData.page.attributes.productName = this.state.currentProduct.productDetails?.displayName || '';
                digitalData.page.attributes.productId = this.state.currentProduct.productDetails?.productId || '';
                digitalData.page.attributes.totalReviews = this.state.productReviewData?.totalReviewCount || 0;

                break;
            case ADD_REVIEW_PAGES_NAMES.ABOUT_YOU:
                pageDetail = anaConsts.PAGE_DETAIL.ADD_REVIEW_ABOUT;
                pageName = [pageType, pageDetail, world + ':*'].join(':');
                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                    data: {
                        pageName,
                        pageType,
                        pageDetail,
                        previousPageName: recentEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
                    }
                });

                break;
            case ADD_REVIEW_PAGES_NAMES.CONFIRMATION:
                pageDetail = anaConsts.PAGE_DETAIL.ADD_REVIEW_SUBMIT;
                pageName = [pageType, pageDetail, world + ':*'].join(':');
                processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                    data: {
                        pageName,
                        pageType,
                        pageDetail,
                        eventStrings: [anaConsts.Event.ADD_REVIEW_CONFIRMATION],
                        productStrings: anaUtils.buildSingleProductString({ sku: this.state.currentProduct.currentSku }),
                        world,
                        previousPageName: recentEvent.pageName || getProp(digitalData, 'page.attributes.sephoraPageInfo.pageName')
                    }
                });

                break;
            default:
        }

        digitalData.page.attributes.sephoraPageInfo.pageName = pageName;
        anaUtils.setNextPageData({ pageName });

        //Resolve promise that was holding back the initial page load
        readyForAnalytics();

        initialLoadOccurred = true;
    };
}

export default wrapComponent(AddReviewCarousel, 'AddReviewCarousel', true);
