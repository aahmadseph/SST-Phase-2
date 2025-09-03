/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

/* eslint-disable class-methods-use-this */
import React from 'react';
import { Fragment } from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';
import Actions from 'Actions';
import { ZIP_CODE_CHANGED_FROM_HEADER } from 'constants/actionTypes/user';
import { breakpoints, mediaQueries } from 'style/config';
import {
    Flex, Text, Link, Divider
} from 'components/ui';
import ChanelBottomBanner from 'components/ChanelBottomBanner';
import Swatches from 'components/ProductPage/Swatches/Swatches';
import RelatedLinks from 'components/ProductPage/RelatedLinks';
import PreviouslyPurchased from 'components/ProductPage/PreviouslyPurchased';
import DisplayName from 'components/ProductPage/DisplayName/DisplayName';
import LovesCount from 'components/ProductPage/LovesCount/LovesCount';
import Price from 'components/ProductPage/Price/Price';
import ProductCardCarousel from 'components/ProductPage/ProductCardCarousel/ProductCardCarousel';
import FrequentlyBoughtTogether from 'components/ProductPage/FrequentlyBoughtTogether';
import GalleryCardCarousel from 'components/ProductPage/GalleryCardCarousel';
import Highlights from 'components/ProductPage/Highlights/Highlights';
import Info from 'components/ProductPage/Info';
import Ingredients from 'components/ProductPage/Ingredients/Ingredients';
import HowToUse from 'components/ProductPage/HowToUse/HowToUse';
import ReviewsAnchor from 'components/ProductPage/ReviewsAnchor/ReviewsAnchor';
import AboutTheBrand from 'components/ProductPage/AboutTheBrand/AboutTheBrand';
import CallToAction from 'components/ProductPage/CallToAction';
import LoveIcon from 'components/ProductPage/ProductLove/LoveIcon';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import LayoutTop from 'components/ProductPage/LayoutTop/LayoutTop';
import DeliveryOptions from 'components/ProductPage/DeliveryOptions';
import BccRwdComponentList from 'components/Bcc/BccRwdComponentList';
import ExtraProductDetailsUtils from 'utils/ExtraProductDetailsUtils';
import CustomSets from 'components/ProductPage/CustomSets/CustomSets';
import profileApi from 'services/api/profile';
import ProductActions from 'actions/ProductActions';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import skuUtils from 'utils/Sku';
import localeUtils from 'utils/LanguageLocale';
import UI from 'utils/UI';
import urlUtils from 'utils/Url';
import userActions from 'actions/UserActions';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import storeUtils from 'utils/Store';
import basketUtils from 'utils/Basket';
import userUtils from 'utils/User';
import safelyReadProp from 'analytics/utils/safelyReadProperty';
import basketConstants from 'constants/Basket';
import anaUtils from 'analytics/utils';
import userLocationUtils from 'utils/UserLocation';
import DeliveryFrequencyModal from 'components/GlobalModals/DeliveryFrequencyModal';
import ProductViewsCount from 'components/ProductPage/ProductViewsCount';
const getText = text => localeUtils.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);
const getAutoReplenText = text => localeUtils.getLocaleResourceFile('components/DeliveryInfo/AutoReplenishment/locales', 'AutoReplenishment')(text);
import deliveryFrequencyUtils from 'utils/DeliveryFrequency';
import Location from 'utils/Location';
import Empty from 'constants/empty';
import { CONSTRUCTOR_PODS, GROUPING, RESULTS_COUNT } from 'constants/constructorConstants';
import RMN_BANNER_TYPES from 'components/Rmn/constants';
import RCPSCookies from 'utils/RCPSCookies';
import RmnUtils from 'utils/rmn';
import RmnAndPlaUtils from 'utils/rmnAndPla';
import { CHANEL, SEPHORA_COLLECTION } from 'constants/brands';
import HighlyRatedFor from 'components/ProductPage/RatingsAndReviews/HighlyRatedFor';
import RmnBanner from 'components/Rmn/RmnBanner';
import RMNCarousel from 'components/Rmn/RMNCarousel';
import QuestionsAndAnswers from 'components/ProductPage/QuestionsAndAnswers/QuestionsAndAnswers';
import RatingsAndReviews from 'components/ProductPage/RatingsAndReviews';
import ConstructorCarousel from 'components/ConstructorCarousel';
import productActions from 'actions/ProductActions';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';
import { TestTargetReady, DebouncedResize, UserInfoReady } from 'constants/events';
import productSamplesActions from 'actions/ProductSamplesActions';
import cookieUtils from 'utils/Cookies';
import SampleProductsUtils from 'utils/sampleProducts/SampleProducts';
import constants from 'constants/content';
import ProductPage from 'ai/components/EntryPoint/ProductPage';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';
import ComponentResponsiveChangeCheck from 'utils/ComponentResponsiveChangeCheck';
import { mountBannerEventData } from 'analytics/utils/eventName';
import RmnMidPageBanner from 'components/Rmn/RmnMidPageBanner';
import deepEqual from 'deep-equal';
import SessionAI from 'services/api/thirdparty/SessionAI';
import MediaUtils from 'utils/Media';
import { isAIBeautyChatEnabledPDP, isAIBeautyChatGiftFinderEnabledPDP } from 'ai/utils/aiBeautyChat';

const { Media } = MediaUtils;
const { CUSTOM_ACTION_TYPES } = constants;
const { BasketType } = basketConstants;
const { formatSavingAmountString } = deliveryFrequencyUtils;
const { getFulfillmentOptions } = productActions;

const BRAND_ID_CHANEL = '1065';
const {
    POSITIONS, MOBILE_VIEW, SECTIONS, TYPES, LEADERBOARD_POSITION_INDEX, BANNER_AND_PLA_TYPES
} = RMN_BANNER_TYPES;

class RegularProduct extends BaseClass {
    constructor(props) {
        super(props);

        this.isSkuReady = false;
        this.getMatchCallCounter = 0;
        this.hasProductMatchBeenFetched = false;
        this.state = {
            getItShipped: true,
            reserveAndPickup: false,
            sameDayDeliveryClick: false,
            sameDayAvailable: true,
            sameDayPDPApiErrorMessage: null,
            isSmallView: null,
            customSetsChoices: [],
            productExtraDetailsLoaded: true,
            profileColorIQ: undefined,
            autoReplenishChecked: false,
            replenishmentFreqNum: '',
            replenishmentFreqType: '',
            quantity: 1,
            isFrequencyModalOpen: false,
            isAutoReplenMostCommon: false,
            trackedStoreId: '',
            isKohlsStore: false,
            isSDUAddedToBasket: false,
            skuTrialEligibility: false,
            skuTrialPeriod: '',
            isUserSDUTrialEligible: false,
            isSDUBannerVisible: false,
            showHighlyRatedFor: true,
            isSentimentSelectedFromHighlyRated: false,
            regularProductHasMounted: false,
            isBopisFirstOption: false,
            rmnMidPageBannerPayload: {}
        };

        store.setAndWatch({ 'page.product': 'currentProduct' }, this, null, store.STATE_STRATEGIES.DIRECT_INIT);

        store.setAndWatch({ 'page.product': 'currentProduct' }, this, () => {
            const rvData = this.state.currentProduct.recentlyViewedSkus;

            // (EXP-4078) BE does not add the current product to recentlyViewedSkus
            // Current product is filtered from list regardless of when/where it was added
            // This patch is intended for Recently Viewed Recap Card on Home page
            // A more comprehensive solution is being investigated
            // -----------------------------------------------------------------------------
            if (rvData) {
                Storage.local.setItem('rvData', [this.state.currentProduct.currentSku, ...rvData]);
            }
        });
    }

    componentDidMount() {
        this.calculatePreventPageRenderReportFlag();
        this.props.processSkuId(this);
        this.handleResize();
        this.setKohlsStore();
        this.scrollToAnchorIfNeeded();
        window.addEventListener(DebouncedResize, this.handleResize);

        this.getProductCounts();

        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                const displayOrderCutoffCountdown = safelyReadProp('testTarget.offers.displayOrderCutoffCountdown.show', newOffers);
                const isFrench = localeUtils.isFrench();
                const isBopisFirstOption = !!newOffers?.testTarget?.offers?.reorderFulfillmentOptionsPdp?.show;
                const showPreviouslyPurchasedPdp = !!newOffers?.testTarget?.offers?.previouslyPurchasedPdp?.show;

                if (displayOrderCutoffCountdown && !isFrench) {
                    this.setState({ displayOrderCutoffCountdown: displayOrderCutoffCountdown });
                }

                this.setState({
                    isBopisFirstOption,
                    showPreviouslyPurchasedPdp
                });

                if (showPreviouslyPurchasedPdp) {
                    this.loadPurchaseHistoryIfNeeded();
                }
            });
        });

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            this.getProductMatch();

            const sampleModalProduct = Storage.local.getItem(LOCAL_STORAGE.PDP_SAMPLES_MODAL);

            if (sampleModalProduct?.productId && this.state.currentProduct?.productDetails?.productId === sampleModalProduct.productId) {
                SampleProductsUtils.openSamplesModal(sampleModalProduct);
            }
        });

        store.setAndWatch('user.preferredZipCode', this, data => {
            this.setState({
                preferredZipCode: data.preferredZipCode
            });
        });

        // sometimes reserveAndPickupClick function returns disabled state as
        // preferred store info is not yet set for the user by the time the option
        // is clicked. we call the function manually when the user is anonymous
        // and if its reserve and pickup state and when we have storeId set.
        store.setAndWatch('user.preferredStoreInfo', this, data => {
            if (
                userUtils.isAnonymous() &&
                this.state.reserveAndPickup &&
                !this.state.productExtraDetailsLoaded &&
                data?.preferredStoreInfo?.storeId
            ) {
                this.reserveAndPickupClick(undefined, true);
            }
        });

        this.setState({
            regularProductHasMounted: true
        });

        if (isRmnCombinedCallFeatureEnabled()) {
            const brandDisplayName = this.state.currentProduct?.productDetails?.brand?.displayName?.toLowerCase() || '';
            const isCAUnreleasedPlacementsVisible = Sephora.configurationSettings?.isCAUnreleasedPlacementsVisible;
            const showMidPageBannerAndPlas = localeUtils.isCanada() ? isCAUnreleasedPlacementsVisible : true;

            if (brandDisplayName !== CHANEL && showMidPageBannerAndPlas) {
                this.responsiveCheck = new ComponentResponsiveChangeCheck(MOBILE_VIEW, this.requestPageBannersAndPlas);

                // Resets any digitalData sponsor banner information from previous pages.
                RmnAndPlaUtils.resetBanners();
            }
        } else {
            // Resets any digitalData sponsor banner information from previous pages.
            RmnUtils.resetBanners();
        }

        store.watchAction(ZIP_CODE_CHANGED_FROM_HEADER, action => {
            if (this.state.sameDayDelivery) {
                const sameDayAvailable = action?.payload?.sameDayAvailable;

                this.sameDayDeliveryClick(sameDayAvailable, true);
            }
        });
    }

    getProductCounts = () => {
        const { currentProduct } = this.state;
        const isAnySkuAvailable = !currentProduct?.currentSku?.isOutOfStock || currentProduct?.regularChildSkus?.some(sku => !sku.isOutOfStock);
        const isUSAndEnabled = localeUtils.isUS() && Sephora.configurationSettings.isSocialProofEnabled;
        const isCAAndEnabled = localeUtils.isCanada() && Sephora.configurationSettings.isSocialProofEnabledCan;
        const isGiftCard = skuUtils.isGiftCard(currentProduct.currentSku);
        const isSubscription = skuUtils.isSubscription(currentProduct.currentSku);
        const isSample = skuUtils.isSample(currentProduct.currentSku);
        const isBirthdayGift = skuUtils.isBirthdayGift(currentProduct.currentSku);

        if (
            (isUSAndEnabled || isCAAndEnabled) &&
            currentProduct?.productDetails?.productId &&
            isAnySkuAvailable &&
            !isGiftCard &&
            !isSubscription &&
            !isSample &&
            !isBirthdayGift
        ) {
            SessionAI.getProductsCount(this.state.currentProduct.productDetails.productId).then(data => {
                store.dispatch(ProductActions.setProductViews(data));
            });
        }
    };

    scrollToAnchorIfNeeded = () => {
        const hash = window.location.hash.replace('#', '');

        if (!hash) {
            return;
        }

        const tryScroll = () => {
            const target = document.getElementById(`${hash}`);
            const lazyLoadingOffset = 250;
            const { isSmallView } = this.state;

            if (target) {
                UI.scrollTo({ elementId: `${hash}`, hasOffset: isSmallView, extraOffset: isSmallView ? lazyLoadingOffset : 0 });
            } else {
                // Retry after LazyLoad finishes
                setTimeout(tryScroll, 2000);
            }
        };

        tryScroll();
    };

    requestPageBannersAndPlas = async isMobile => {
        const { currentProduct } = this.state;
        const { maxProducts } = this.props;
        const slotPrefix = localeUtils.isUS() ? '25' : '26';
        const { productDetails = {}, currentSku = {} } = currentProduct;
        // eslint-disable-next-line camelcase
        const targets = { match_products: [productDetails.productId] };

        const slot = isMobile ? `${slotPrefix}04212` : `${slotPrefix}04112`;
        const type = isMobile ? TYPES.MOBILE_LEADERBOARD.NAME : TYPES.SUPER_LEADERBOARD.NAME;
        const section = RMN_BANNER_TYPES.SECTIONS.MAIN;

        const plaSponsoredProductOpts = {
            targets,
            slot,
            count: maxProducts,
            // eslint-disable-next-line camelcase
            count_fill: maxProducts,
            shouldDisplayPlas: !!cookieUtils.read(cookieUtils.KEYS.SEPH_SESSION)
        };

        const requestParams = RmnAndPlaUtils.mountRequestParams({
            targets,
            slot,
            type,
            section,
            contextId: productDetails.productId,
            count: maxProducts,
            skuId: currentSku?.skuId || '',
            skuPrice: currentSku?.salePrice || currentSku?.listPrice || '',
            skuAvailability: Number(!currentSku?.isOutOfStock) // converts the boolean (true or false) to 1 or 0, and handles undefined safely with !
        });

        this.setState({ showSkeleton: true });

        RmnAndPlaUtils.initializeBannersAndPlas({
            ...requestParams,
            isMobile,
            plaSponsoredProductOpts
        })
            .then(response => {
                const bannerData = response?.[BANNER_AND_PLA_TYPES.LEADERBOARD]?.[LEADERBOARD_POSITION_INDEX.TOP];

                if (bannerData) {
                    this.setState({
                        rmnMidPageBannerPayload: bannerData,
                        showSkeleton: false
                    });
                } else {
                    this.handleFallback(slot);
                }
            })
            .catch(() => {
                this.handleFallback(slot);
            });
    };

    handleFallback = slot => {
        this.setState({ showSkeleton: true });

        const state = store.getState();
        const rmnBanners = state?.rmnBanners || {};
        const bannersSlot = rmnBanners[slot];
        const fallbackBanner = bannersSlot?.fallback || {};

        this.setState(prevState => {
            if (!deepEqual(fallbackBanner, prevState.fallbackBannerPayload)) {
                return {
                    fallbackBannerPayload: fallbackBanner,
                    showSkeleton: false
                };
            }

            return { showSkeleton: false };
        });
    };

    getProductMatch = () => {
        store.setAndWatch('user', this, ({ user }) => {
            const { currentProduct } = this.state;
            const biSkinTones = user.beautyInsiderAccount?.skinTones?.length;

            if (biSkinTones) {
                this.getMatchCallCounter = biSkinTones;
            }

            this.getMatchCallCounter >= 1 &&
                skuUtils.showRWDColorIQOnPage(currentProduct) &&
                !this.hasProductMatchBeenFetched &&
                skuUtils.getCurrentProductColorIQMatch(currentProduct).then(match => {
                    this.hasProductMatchBeenFetched = true;
                    this.setState({
                        profileColorIQ: match
                    });
                });
        });

        if (this.state.currentProduct?.currentSku) {
            this.setState({
                replenishmentFreqNum: this.state.currentProduct?.currentSku?.replenishmentFreqNum,
                replenishmentFreqType: this.state.currentProduct?.currentSku?.replenishmentFreqType,
                isAutoReplenMostCommon: this.isAutoReplenMostCommon()
            });
        }
    };

    componentDidUpdate = (_prevProps, prevState) => {
        this.calculatePreventPageRenderReportFlag();
        this.setKohlsStore();

        if (
            prevState.currentProduct?.currentSku?.skuId !== this.state.currentProduct?.currentSku?.skuId ||
            prevState.currentProduct?.currentSku?.replenishmentFreqNum !== this.state.currentProduct?.currentSku?.replenishmentFreqNum ||
            prevState.currentProduct?.currentSku?.replenishmentFreqType !== this.state.currentProduct?.currentSku?.replenishmentFreqType
        ) {
            this.setState({
                replenishmentFreqNum: this.state.currentProduct?.currentSku?.replenishmentFreqNum,
                replenishmentFreqType: this.state.currentProduct?.currentSku?.replenishmentFreqType,
                isAutoReplenMostCommon: this.isAutoReplenMostCommon(),
                quantity: prevState.currentProduct?.currentSku?.skuId !== this.state.currentProduct?.currentSku?.skuId ? 1 : this.state.quantity,
                autoReplenishChecked:
                    prevState.currentProduct?.productDetails?.productId === this.state.currentProduct?.productDetails?.productId &&
                    prevState.currentProduct?.currentSku?.skuId !== this.state.currentProduct?.currentSku?.skuId &&
                    this.state.currentProduct?.currentSku?.isReplenishmentEligible
                        ? this.state.autoReplenishChecked
                        : false
            });
            this.requestPageBannersAndPlas(Sephora.isMobile());
        }

        if (prevState.currentProduct?.productDetails?.productId !== this.state.currentProduct?.productDetails?.productId) {
            !this.state.isBopisFirstOption && this.getItShippedClick();
            this.resetMatches();
            this.getProductMatch();
            this.getProductCounts();
        }

        if (this.state.autoReplenishChecked && prevState.autoReplenishChecked !== this.state.autoReplenishChecked && this.state.quantity >= 2) {
            this.showQuantityWarning();
        }

        Sephora.Util.onLastLoadEvent(window, [TestTargetReady], () => {
            store.setAndWatch('testTarget', this, newOffers => {
                this.setState({
                    showCarousel: Boolean(newOffers.testTarget.offers?.PDPCarousel?.showCarousel)
                });
            });
        });

        if (
            (this.state.preferredZipCode && prevState.preferredZipCode !== this.state.preferredZipCode) ||
            prevState.currentProduct?.productDetails?.productId !== this.state.currentProduct?.productDetails?.productId
        ) {
            store.dispatch(getFulfillmentOptions());
        }
    };

    resetMatches = () => {
        this.getMatchCallCounter = 0;
        this.hasProductMatchBeenFetched = false;
    };

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
        this.resetMatches();
    }

    calculatePreventPageRenderReportFlag = () => {
        const skuId = urlUtils.getParamValueAsSingleString('skuId');
        const { currentProduct } = this.state;
        const pageRenderedWithDefaultSku = !skuId;
        const pageRenderedWithNonDefaultSkuFromUrl = currentProduct?.currentSku.skuId === skuId;

        if (!this.preventPageRenderReport && (pageRenderedWithDefaultSku || pageRenderedWithNonDefaultSkuFromUrl)) {
            this.preventPageRenderReport = true;
        }
    };

    showQuantityWarning = () => {
        const showInfoModalAction = Actions.showInfoModal({
            isOpen: true,
            title: getText('quantityWarningTitle'),
            message: getText('quantityWarningMessage'),
            buttonText: getText('quantityWarningButtonText'),
            callback: () => {
                this.setState({ quantity: 1 });
            },
            showCloseButton: true
        });
        store.dispatch(showInfoModalAction);
    };

    handleResize = () => {
        const { isSmallView } = this.state;
        const showSmallView = window.matchMedia(breakpoints.smMax).matches;

        if (!isSmallView && showSmallView) {
            this.setState({ isSmallView: true });
        } else if (isSmallView && !showSmallView) {
            this.setState({ isSmallView: false });
        }
    };

    scrollToQandA = e => {
        e.preventDefault();
        UI.scrollTo({ elementId: 'QandA' });
    };

    setKohlsStore = () => {
        const preferredStoreInfo = store.getState().user.preferredStoreInfo;
        const isKohlsStore = storeUtils.isKohlsStore(preferredStoreInfo);

        if (this.state.isKohlsStore !== isKohlsStore) {
            this.setState({ isKohlsStore });
        }
    };

    setIsSentimentSelectedFromHighlyRated = () => {
        this.setState({ isSentimentSelectedFromHighlyRated: true });
    };

    setProductSamplesBanner = banner => {
        const { currentProduct } = this.state;
        const { currentSku = {}, productDetails = {} } = currentProduct;
        store.dispatch(
            productSamplesActions.setSampleProduct({
                product: { ...currentSku, productId: productDetails.productId, packetImage: banner?.media?.src }
            })
        );

        // Only show the banner if the user is BI
        this.setState({
            isProductSampleEnabled: true
        });
    };

    shouldShowSamplesBanner = () => {
        return (Sephora.configurationSettings.isPDPBannerCANEnabled || localeUtils.isUS()) && userUtils.isBI();
    };

    flagRmnBannerViewableImpression = rmnObj => {
        rmnObj['impressionFired'] = true;
    };

    renderRmnMidPageBanner = slotPrefix => {
        const { rmnMidPageBannerPayload, fallbackBannerPayload, isSmallView } = this.state;

        if (!Object.keys(rmnMidPageBannerPayload)?.length) {
            return null;
        }

        const slot = isSmallView ? `${slotPrefix}04223` : `${slotPrefix}04123`;
        const type = isSmallView ? TYPES.MOBILE_LEADERBOARD.NAME : TYPES.SUPER_LEADERBOARD.NAME;

        const clickEventName = mountBannerEventData({
            section: SECTIONS.MAIN,
            targetPage: anaConsts.RMN_PAGE_NAMES.pdp,
            type: anaConsts.EVENTS_TYPES_NAME.CLICK
        });
        const viewableEventName = mountBannerEventData({
            section: SECTIONS.MAIN,
            targetPage: anaConsts.RMN_PAGE_NAMES.pdp,
            type: anaConsts.EVENTS_TYPES_NAME.VIEW
        });

        const leaderboardProps = {
            slot,
            type,
            section: SECTIONS.MAIN,
            position: POSITIONS.TOP,
            source: RmnAndPlaUtils.RMN_SOURCES.PDP,
            clickEventName,
            viewableEventName
        };

        return (
            <RmnMidPageBanner
                position={POSITIONS.MID}
                rmnBannerPayload={rmnMidPageBannerPayload}
                fallbackBannerPayload={fallbackBannerPayload}
                bannerProps={leaderboardProps}
                bannerMobileProps={leaderboardProps}
            />
        );
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            currentProduct,
            getItShipped,
            reserveAndPickup,
            sameDayDelivery,
            sameDayAvailable,
            serviceUnavailable,
            sameDayNotAvailableForZip,
            cashMessagingResult,
            showHighlyRatedFor,
            isSentimentSelectedFromHighlyRated,
            regularProductHasMounted,
            isProductSampleEnabled,
            showPreviouslyPurchasedPdp
        } = this.state;

        const { highlightValueHidden, highlightLayerWithPDP, showAIBeautyChat, showSMNEnabled } = this.props;

        const isChallengerOneFragrance = highlightLayerWithPDP.challengerOne && skuUtils.isFragrance(currentProduct, currentProduct.currentSku);

        const displayQuantityPickerInATB = Location.isProductPage();
        const isPXSEnabled = true;

        const {
            hoveredSku,
            currentSku = {},
            regularChildSkus,
            productDetails = {},
            combinedMiddleProductBanner,
            combinedProductBanner,
            content = {},
            hasProductSamples
        } = currentProduct;

        // eslint-disable-next-line camelcase
        const targets = { match_products: [productDetails.productId] };

        let displayedMiddleProductBanner = combinedMiddleProductBanner;
        let displayedProductBanner = combinedProductBanner;
        let displayedBottomProductBanner = [];

        if (combinedMiddleProductBanner?.length > 1 && cashMessagingResult) {
            displayedMiddleProductBanner = [combinedMiddleProductBanner[1]];
        }

        if (combinedProductBanner?.length > 1 && cashMessagingResult) {
            displayedProductBanner = [combinedProductBanner[1]];
        }

        if (isPXSEnabled && Object.keys(content).length) {
            displayedProductBanner = content.zone1?.[0] || {};
            displayedMiddleProductBanner = content.zone2?.[0] || {};
            displayedBottomProductBanner = content.zone3?.[0] || {};

            if (displayedMiddleProductBanner?.action?.actionType === CUSTOM_ACTION_TYPES.PDP_SAMPLE) {
                if (Sephora.configurationSettings.isPDPSamplingEnabled && hasProductSamples) {
                    if (this.shouldShowSamplesBanner()) {
                        this.setProductSamplesBanner(displayedMiddleProductBanner);
                    } else {
                        displayedMiddleProductBanner = {};
                    }
                } else {
                    displayedMiddleProductBanner = {};
                }
            }
        }

        const focusedSku = hoveredSku || currentSku;
        let callToActionSku = currentSku;

        if (Sephora.isAgent && Sephora.isAgentAuthorizedRole) {
            //If it is Sephora Mirror and extension is installed then agents can see app exclusive products as regular products
            callToActionSku = { ...currentSku, isAppExclusive: false };
        }

        const isGiftCard = skuUtils.isGiftCard(focusedSku);

        const { listPrice, salePrice, valuePrice, actionFlags } = focusedSku;

        const loveIcon = isGiftCard ? null : (
            <LoveIcon
                quantity={this.state.quantity}
                currentProduct={currentProduct}
                sku={currentSku}
                loveSource='productPage'
            />
        );

        const isBazaarVoiceEnabled = Sephora.configurationSettings.isBazaarVoiceEnabled;
        const isRatingsEnabled = isBazaarVoiceEnabled && Sephora.configurationSettings.productPageConfigurations.isPpageRatingsEnabled;
        const isQandAEnabled = isBazaarVoiceEnabled && Sephora.configurationSettings.enableQandA;

        const { isSmallView } = this.state;

        const params = { itemIds: currentProduct?.productDetails?.productId };
        const similarProductsCarouselParams = { ...params, numResults: RESULTS_COUNT.SIMILAR_PRODUCTS };

        const useItWithCarousel = (
            <ProductCardCarousel
                carouselContextId={productDetails.productId}
                title={currentProduct.useItWithTitle || getText('useItWithTitle')}
                showAddToBasket={true}
                isHorizontal={true}
                skus={currentProduct.ancillarySkus}
                analyticsContext={anaConsts.CONTEXT.USE_IT_WITH}
            />
        );

        const frequentlyBoughtTogetherCarousel = (
            <FrequentlyBoughtTogether
                currentSku={currentSku}
                currentProduct={currentProduct}
                isCarousel={true}
            />
        );

        const similarProductsCarousel = (
            <ConstructorCarousel
                params={params}
                podId={CONSTRUCTOR_PODS.SIMILAR_PRODUCTS}
                isSmallView={isSmallView}
                currentProduct={currentProduct}
                carouselContextId={productDetails.productId}
                isCAMobile={true}
                link={
                    skuUtils.isCleanProduct(currentProduct.specialProdCategories) && {
                        href: `/shop/${currentProduct.specialProdCategories[0].seoName}`,
                        onClick: () => {
                            const categoryName = currentProduct.specialProdCategories[0].seoName;
                            Location.navigateTo(e, `/shop/${categoryName}`);
                            anaUtils.setNextPageData({ linkData: `view more clean beauty:${categoryName}` });
                        },
                        children: getText('viewMoreCleanBeauty'),
                        fontSize: localeUtils.isFrench() ? ['sm', 'base'] : 'base',
                        'data-at': Sephora.debug.dataAt('view_more_clean_beauty_link')
                    }
                }
                productDetails={productDetails}
                deduplicateRecommendedProducts={true}
            />
        );

        const ymalCarousel = (
            <ConstructorCarousel
                params={params}
                podId={CONSTRUCTOR_PODS.YMAL}
                grouping={GROUPING.YMAL}
                carouselContextId={productDetails.productId}
            />
        );
        const basketType = reserveAndPickup ? BasketType.BOPIS : sameDayDelivery ? BasketType.SameDay : BasketType.Standard;

        const isCanada = localeUtils.isCanada();
        const isUsa = localeUtils.isUS();
        const isFrench = localeUtils.isFrench();
        const brandData = Object.assign({}, productDetails.brand || currentProduct.brand);
        const isChanel = productDetails.brand?.brandId === BRAND_ID_CHANEL;
        const slotPrefix = isUsa ? '25' : '26';
        // Deleting brand ref property so that it does not get confused by React with the
        // ref property (reference)
        delete brandData.ref;

        const { isExternallySellable } = currentSku;
        const brandDisplayName = productDetails.brand?.displayName?.toLowerCase() || '';
        const isRmnExperience = brandDisplayName !== CHANEL;
        const isCAUnreleasedPlacementsVisible = Sephora.configurationSettings?.isCAUnreleasedPlacementsVisible;
        const showRmnBanners = showSMNEnabled && (isCanada ? isRmnExperience && isCAUnreleasedPlacementsVisible : isRmnExperience);
        const hasSentiments = currentProduct.sentiments?.length > 0 && Sephora.configurationSettings.highlyRatedFor && showHighlyRatedFor;
        const showRmnCarousel = showSMNEnabled && (isCanada ? isRmnExperience && isCAUnreleasedPlacementsVisible : isRmnExperience);
        const displayFrequentlyBoughtTogether = brandDisplayName === SEPHORA_COLLECTION;

        const isShowProductBeforeSkuReady = Sephora.configurationSettings.isShowProductBeforeSkuReadyEnabled;
        const hideProductTillSkuReady = !isShowProductBeforeSkuReady ? !this.isSkuReady : false;

        return (
            <section className={hideProductTillSkuReady ? 'isDefault' : null}>
                <LayoutTop
                    regularProductHasMounted={regularProductHasMounted}
                    showMiddleProductBanner={!isSmallView}
                    sku={focusedSku}
                    product={currentProduct}
                    isPXSEnabled={isPXSEnabled}
                    displayedProductBanner={displayedProductBanner}
                    displayedMiddleProductBanner={displayedMiddleProductBanner}
                    displayedBottomProductBanner={displayedBottomProductBanner}
                    preventPageRenderReport={this.preventPageRenderReport && !Sephora.Util.Perf.firstSpaLoadRender}
                    content={{
                        top: (
                            <Fragment>
                                <DisplayName
                                    productDisplayNameDataAt={Sephora.debug.dataAt('product_name')}
                                    product={{
                                        brand: productDetails.brand || currentProduct.brand,
                                        displayName: productDetails.displayName || currentProduct.displayName
                                    }}
                                />
                                <Flex
                                    flexDirection='column'
                                    gap='.5em'
                                    fontSize='sm'
                                    marginBottom={[2, 4]}
                                    {...(hasSentiments && {
                                        backgroundColor: 'nearWhite',
                                        padding: 2,
                                        borderRadius: 2
                                    })}
                                >
                                    <Flex
                                        alignItems='center'
                                        lineHeight='none'
                                    >
                                        {isRatingsEnabled && (
                                            <ReviewsAnchor
                                                rating={productDetails.rating}
                                                reviews={productDetails.reviews}
                                            />
                                        )}
                                        {isQandAEnabled && (
                                            <Fragment>
                                                {isRatingsEnabled && (
                                                    <Text
                                                        marginX='.5em'
                                                        color='midGray'
                                                        children='|'
                                                    />
                                                )}
                                                <Link
                                                    data-at={Sephora.debug.dataAt('ask_question')}
                                                    padding='.5em'
                                                    margin='-.5em'
                                                    href='#QandA'
                                                    onClick={this.scrollToQandA}
                                                    css={{
                                                        position: 'relative',
                                                        top: 1
                                                    }}
                                                    children={getText('askAQuestion')}
                                                />
                                            </Fragment>
                                        )}
                                        {isGiftCard || (
                                            <Fragment>
                                                {(isRatingsEnabled || isQandAEnabled) && (
                                                    <Text
                                                        marginX='.5em'
                                                        color='midGray'
                                                        children='|'
                                                    />
                                                )}
                                                <LovesCount
                                                    product={{
                                                        lovesCount: productDetails.lovesCount,
                                                        skuId: currentSku.skuId,
                                                        regularChildSkus
                                                    }}
                                                />
                                            </Fragment>
                                        )}
                                    </Flex>
                                    {hasSentiments && <HighlyRatedFor onSentimentApply={this.setIsSentimentSelectedFromHighlyRated} />}
                                </Flex>
                                {!isCanada && (
                                    <Flex
                                        fontSize='sm'
                                        lineHeight='none'
                                        alignItems='center'
                                        {...styles.priceContainer}
                                    >
                                        <Price
                                            isFrench={isFrench}
                                            isCanada={isCanada}
                                            isSmallView={isSmallView}
                                            isExternallySellable={isExternallySellable}
                                            isReplenishmentEligible={focusedSku.isReplenishmentEligible}
                                            replenishMessage={() => this.replenishMessage(focusedSku)}
                                            highlightValueHidden={highlightValueHidden}
                                            sku={{
                                                listPrice,
                                                salePrice,
                                                valuePrice,
                                                actionFlags
                                            }}
                                        />
                                    </Flex>
                                )}
                            </Fragment>
                        ),
                        bottom: (
                            <Fragment>
                                {isCanada && (
                                    <Flex
                                        fontSize='sm'
                                        lineHeight='none'
                                        alignItems='center'
                                        {...styles.priceContainer}
                                    >
                                        <Price
                                            isFrench={isFrench}
                                            isCanada={isCanada}
                                            isSmallView={isSmallView}
                                            isExternallySellable={isExternallySellable}
                                            isReplenishmentEligible={focusedSku.isReplenishmentEligible}
                                            replenishMessage={() => this.replenishMessage(focusedSku)}
                                            highlightValueHidden={highlightValueHidden}
                                            sku={{
                                                listPrice,
                                                salePrice,
                                                valuePrice,
                                                actionFlags
                                            }}
                                        />
                                    </Flex>
                                )}
                                <Swatches
                                    isSmallView={isSmallView}
                                    isSkuReady={this.isSkuReady}
                                    isCustomSet={!!currentSku.configurableOptions}
                                    loveIcon={loveIcon}
                                    currentProduct={currentProduct}
                                    colorIQMatch={{ skuId: this.state.profileColorIQ }}
                                    basketType={basketType}
                                    quantity={this.state.quantity}
                                    storeId={store.getState().user.preferredStoreInfo?.storeId}
                                />
                                {!!currentSku.configurableOptions && (
                                    <CustomSets
                                        isSmallView={isSmallView}
                                        currentSku={currentSku}
                                        isSkuReady={this.isSkuReady}
                                        currentProduct={currentProduct}
                                        addToBasketDataAt='add_to_basket_btn_large_view'
                                        addToBasketDataAtSm='add_to_basket_btn_small_view'
                                        isRopis={reserveAndPickup}
                                        loveIcon={loveIcon}
                                    />
                                )}
                                {showPreviouslyPurchasedPdp && !userUtils.isAnonymous() && (
                                    <PreviouslyPurchased productId={productDetails.productId} />
                                )}

                                {isSmallView && !isPXSEnabled && (
                                    <BccRwdComponentList
                                        context='inline'
                                        items={displayedMiddleProductBanner}
                                        baseStyleProps={{
                                            marginY: 4
                                        }}
                                    />
                                )}
                                <Media lessThan='md'>
                                    <ProductViewsCount />
                                </Media>
                                {isExternallySellable ? null : (
                                    <DeliveryOptions
                                        displayOrderCutoffCountdown={this.state.displayOrderCutoffCountdown}
                                        getItShipped={getItShipped}
                                        getItShippedClick={this.getItShippedClick}
                                        sameDayDelivery={sameDayDelivery}
                                        sameDayDeliveryClick={this.sameDayDeliveryClick}
                                        serviceUnavailable={serviceUnavailable}
                                        sameDayNotAvailableForZip={sameDayNotAvailableForZip}
                                        sameDayAvailable={sameDayAvailable}
                                        currentProduct={currentProduct}
                                        reserveAndPickupClick={this.reserveAndPickupClick}
                                        reserveAndPickup={reserveAndPickup}
                                        autoReplenishClick={this.autoReplenishClick}
                                        autoReplenishChecked={this.state.autoReplenishChecked}
                                        isAutoReplenMostCommon={this.isAutoReplenMostCommon()}
                                        replenishmentFreqNum={this.state.replenishmentFreqNum}
                                        replenishmentFreqType={this.state.replenishmentFreqType}
                                        quantity={this.state.quantity}
                                        openDeliveryFrequencyModal={this.toggleDeliveryFrequencyModal}
                                        skuTrialEligibility={this.state.skuTrialEligibility}
                                        skuTrialPeriod={this.state.skuTrialPeriod}
                                        isUserSDUTrialEligible={this.state.isUserSDUTrialEligible}
                                        resetGetItShipped={this.resetGetItShipped}
                                    />
                                )}
                                {this.state.isFrequencyModalOpen && !isExternallySellable && (
                                    <DeliveryFrequencyModal
                                        isOpen={this.state.isFrequencyModalOpen}
                                        onDismiss={() => this.toggleDeliveryFrequencyModal(false)}
                                        title={getAutoReplenText('deliveryFrequency')}
                                        currentProduct={currentProduct}
                                        replenishmentFreqNum={parseInt(this.state.replenishmentFreqNum)}
                                        replenishmentFreqType={this.state.replenishmentFreqType}
                                        quantity={this.state.quantity}
                                        updateFrequencyModal={this.updateFrequencyModal}
                                        isBasket={false}
                                    />
                                )}
                                {!currentSku.configurableOptions && this.isSkuReady ? (
                                    <>
                                        <CallToAction
                                            viewSimilarProducts={this.state.viewSimilarProductsLink}
                                            isSmallView={isSmallView}
                                            addToBasketDataAt='add_to_basket_btn'
                                            addToBasketDataAtSm='add_to_basket_btn_small_view'
                                            displayQuantityPickerInATB={displayQuantityPickerInATB}
                                            basketType={basketType}
                                            isSameDayAvailable={sameDayAvailable && currentSku.isSameDayEligibleSku}
                                            sku={callToActionSku}
                                            product={currentProduct}
                                            productExtraDetailsLoaded={this.state.productExtraDetailsLoaded}
                                            loveIcon={loveIcon}
                                            replenishmentFreqNum={this.state.replenishmentFreqNum}
                                            replenishmentFreqType={this.state.replenishmentFreqType}
                                            autoReplenishChecked={this.state.autoReplenishChecked}
                                            autoReplenishQuantity={this.state.quantity}
                                            updateFrequencyModal={this.updateFrequencyModal}
                                            isAutoReplenMostCommon={this.isAutoReplenMostCommon()}
                                            isKohlsStore={this.state.isKohlsStore}
                                        />
                                        <Media greaterThan='sm'>
                                            <ProductViewsCount />
                                        </Media>
                                    </>
                                ) : !this.isSkuReady ? (
                                    <SkeletonBanner />
                                ) : null}
                            </Fragment>
                        )
                    }}
                    isProductSampleEnabled={isProductSampleEnabled}
                />

                {this.isSkuReady && (
                    <>
                        <div id='details'>
                            <Highlights
                                itemId={productDetails.productId}
                                showCleanModal={true}
                                items={currentSku.highlights}
                            />

                            {isChallengerOneFragrance && !displayFrequentlyBoughtTogether && !isExternallySellable && useItWithCarousel}

                            <Info
                                title={getText('aboutTheProduct')}
                                currentSku={currentSku}
                                product={currentProduct}
                                isRegularProductSmallView={isSmallView}
                                description={productDetails.longDescription || currentProduct.longDescription}
                                dataAt='about_the_product_title'
                            />
                        </div>

                        <Ingredients content={currentSku.ingredientDesc} />

                        <HowToUse
                            currentSku={currentSku}
                            content={productDetails.suggestedUsage}
                        />

                        {!isChallengerOneFragrance &&
                            !isSmallView &&
                            isCanada &&
                            !displayFrequentlyBoughtTogether &&
                            !isExternallySellable &&
                            useItWithCarousel}

                        {!isSmallView && isCanada && displayFrequentlyBoughtTogether && !isExternallySellable && frequentlyBoughtTogetherCarousel}
                        <div id='similar'>
                            {isCanada && isSmallView && similarProductsCarousel}
                            {isUsa && !isExternallySellable && (
                                <ConstructorCarousel
                                    params={similarProductsCarouselParams}
                                    podId={CONSTRUCTOR_PODS.SIMILAR_PRODUCTS}
                                    isSmallView={isSmallView}
                                    currentProduct={currentProduct}
                                />
                            )}
                        </div>

                        {(isSmallView || (isUsa && !isSmallView)) && !isExternallySellable && ymalCarousel}

                        {showRmnCarousel && (
                            <LazyLoad
                                component={RMNCarousel}
                                targets={targets}
                                source={RmnUtils.RMN_SOURCES.PDP}
                                currentProductId={productDetails.productId}
                            />
                        )}

                        {isRmnCombinedCallFeatureEnabled() && showRmnBanners && this.renderRmnMidPageBanner(slotPrefix)}

                        {!isRmnCombinedCallFeatureEnabled() && showRmnBanners && isSmallView ? (
                            <LazyLoad
                                component={RmnBanner}
                                type={RMN_BANNER_TYPES.TYPES.MOBILE_LEADERBOARD.NAME}
                                isCentered={true}
                                marginBottom={4}
                                contextId={productDetails.productId}
                                slot={`${slotPrefix}04223`}
                                targets={targets}
                                section='main'
                                handleRmnBanner={RmnUtils.addBannerToDigitalData}
                                flagViewableImpression={this.flagRmnBannerViewableImpression}
                            />
                        ) : null}

                        {!isRmnCombinedCallFeatureEnabled() && showRmnBanners && !isSmallView ? (
                            <LazyLoad
                                component={RmnBanner}
                                type={RMN_BANNER_TYPES.TYPES.SUPER_LEADERBOARD.NAME}
                                isCentered={true}
                                marginBottom={5}
                                contextId={productDetails.productId}
                                slot={`${slotPrefix}04123`}
                                targets={targets}
                                section='main'
                                handleRmnBanner={RmnUtils.addBannerToDigitalData}
                                flagViewableImpression={this.flagRmnBannerViewableImpression}
                            />
                        ) : null}

                        {!isChallengerOneFragrance &&
                            (isSmallView || (isUsa && !isSmallView)) &&
                            !displayFrequentlyBoughtTogether &&
                            !isExternallySellable &&
                            useItWithCarousel}

                        {(isSmallView || (isUsa && !isSmallView)) &&
                            displayFrequentlyBoughtTogether &&
                            !isExternallySellable &&
                            frequentlyBoughtTogetherCarousel}

                        <div id='QandA'>
                            {isQandAEnabled && (
                                <LazyLoad
                                    component={QuestionsAndAnswers}
                                    productId={productDetails.productId}
                                    skuId={currentSku.skuId}
                                />
                            )}
                        </div>
                        {showAIBeautyChat && isAIBeautyChatEnabledPDP(currentProduct) && (
                            <>
                                {!isSmallView && <Divider marginBottom={24} />}
                                <ProductPage giftFinder={isAIBeautyChatGiftFinderEnabledPDP(currentProduct)} />
                            </>
                        )}
                        <div id='ratings-reviews-container'>
                            {isRatingsEnabled && !isSentimentSelectedFromHighlyRated ? (
                                <LazyLoad
                                    component={RatingsAndReviews}
                                    isSmallView={isSmallView}
                                    productId={productDetails.productId}
                                    currentProduct={currentProduct}
                                />
                            ) : (
                                <RatingsAndReviews
                                    isSmallView={isSmallView}
                                    productId={productDetails.productId}
                                    currentProduct={currentProduct}
                                />
                            )}
                        </div>

                        {isChanel && isSmallView && <ChanelBottomBanner marginBottom={4} />}

                        {!isSmallView && isCanada && !isExternallySellable && (
                            <ConstructorCarousel
                                params={similarProductsCarouselParams}
                                podId={CONSTRUCTOR_PODS.SIMILAR_PRODUCTS}
                                isSmallView={isSmallView}
                                currentProduct={currentProduct}
                            />
                        )}

                        {productDetails.brand && skuUtils.brandShowUserGeneratedContent(productDetails.brand.brandId) && (
                            <GalleryCardCarousel
                                currentProduct={currentProduct}
                                brandId={productDetails.brand.brandId}
                                skuType={currentSku.type}
                                productId={productDetails.productId}
                            />
                        )}

                        {!isSmallView && isCanada && !isExternallySellable && ymalCarousel}

                        <ProductCardCarousel
                            carouselContextId={productDetails.productId}
                            title={getText('recentlyViewedLabel')}
                            skus={currentProduct.recentlyViewedSkus}
                        />

                        {isGiftCard || !!currentSku.configurableOptions || (
                            <AboutTheBrand
                                productId={productDetails.productId}
                                {...brandData}
                            />
                        )}

                        {isChanel && !isSmallView && (
                            <>
                                <Divider />
                                <ChanelBottomBanner marginY={4} />
                            </>
                        )}

                        <RelatedLinks
                            links={
                                isCanada
                                    ? currentProduct?.linkEquityBlock?.links
                                    : currentProduct?.relatedLinks || currentProduct?.linkEquityBlock?.links
                            }
                        />

                        {isCanada && (
                            <RelatedLinks
                                links={currentProduct?.relatedLinks}
                                isExploreMore={true}
                            />
                        )}
                    </>
                )}
            </section>
        );
    }

    getCurrentAvailability = productData => {
        const {
            currentProduct: { currentSku }
        } = this.state;
        const noExtraPropertiesProduct = store.getState().page.product.noExtraPropertiesProduct;

        const productAvailability = productData?.currentSku?.actionFlags?.availabilityStatus;
        const sameDayAvailability = productData?.currentSku?.actionFlags?.sameDayAvailabilityStatus;
        const currentSkuAvailability = currentSku?.actionFlags?.availabilityStatus;
        const extraProductSku = noExtraPropertiesProduct?.currentSku;

        // Get the availabilityStatus primarily from the productData. If not available, then try to get
        // sameDayAvailabilityStatus from productData. If not available, then try to get availabilityStatus
        // from the state's currentSku.
        // Finally if none of them are available, get the availabilityStatus from the noExtraPropertiesProduct,
        // which contains the currentSku for non ROPIS and non Same Day Delivery data.
        const stockAvailability =
            productAvailability ||
            sameDayAvailability ||
            ExtraProductDetailsUtils.getStockAvailabilityStatus(extraProductSku) ||
            currentSkuAvailability;

        const isInStock = ExtraProductDetailsUtils.isinStock(stockAvailability);

        return { isInStock, stockAvailability };
    };

    // Fire the analytics event for the shipping method selected. productData is passed to get the
    // availabilityStatus of the currentSku for the shipping method just selected.
    fireShippingAnalytics = (value, productData) => {
        const {
            currentProduct: { currentSku }
        } = this.state;

        const { isInStock, stockAvailability } = this.getCurrentAvailability(productData);

        const data = {
            linkName: 'D=c55',
            actionInfo: 'Shipping Option',
            sku: {
                skuId: currentSku.skuId
            },
            shippingMethod: value,
            preferredStoreId: store.getState().user.preferredStoreInfo?.storeId,
            customerZipCode: userUtils.getZipCode(),
            stockAvailability
        };

        if (value === anaConsts.DELIVERY_OPTIONS_MAP.Pickup) {
            data.availablePreferredForBopis = isInStock ? 'Yes' : 'No';
            digitalData.page.attributes.isAvailablePreferredStore = isInStock ? 'Yes' : 'No';
        }

        if (value === anaConsts.DELIVERY_OPTIONS_MAP.Sameday) {
            if (this.state.isSDUBannerVisible) {
                data.linkName = anaConsts.EVENT_NAMES.SAME_DAY_DELIVERY_RADIO_BUTTON_CLICK;
                data.actionInfo = anaConsts.EVENT_NAMES.SAME_DAY_DELIVERY_RADIO_BUTTON_CLICK;
            }

            data.eventStrings = [`${anaConsts.Event.EVENT_257}=${this.state.isSDUBannerVisible ? 1 : 0}`];
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data });
    };

    resetGetItShipped = callback => {
        this.setState(
            {
                getItShipped: false
            },
            () => {
                if (callback) {
                    callback();
                }
            }
        );
    };

    getItShippedClick = () => {
        if (this.state.getItShipped) {
            return;
        }

        // The noExtraPropertiesProduct has the state of product object BEFORE
        // the user selected either BOPIS or Same Day Delivery, which augment
        // product object. Therefore, we restore said product object to get rid
        // of BOPIS or SDD properties
        if (store.getState().page.product.noExtraPropertiesProduct) {
            store.dispatch(ProductActions.restoreProductWithNoExtraDetails());
        }

        this.setState(
            {
                getItShipped: true,
                sameDayDelivery: false,
                reserveAndPickup: false,
                productExtraDetailsLoaded: true
            },
            this.fireShippingAnalytics(anaConsts.DELIVERY_OPTIONS_MAP.Standard)
        );
    };

    isAutoReplenMostCommon = () => {
        return (
            this.state.replenishmentFreqNum === this.state.currentProduct?.currentSku?.replenishmentFreqNum &&
            this.state.replenishmentFreqType === this.state.currentProduct?.currentSku?.replenishmentFreqType
        );
    };

    replenishMessage = currentSku => {
        const { isAutoReplenishmentEnabled } = Sephora.configurationSettings;
        const isFrench = localeUtils.isFrench();
        const autoReplenPromoText = isFrench ? 'avec l’aubaine autoprovision*' : 'with Auto-Replenish Hot Deal*';

        if (!isAutoReplenishmentEnabled) {
            return null;
        }

        return (
            <Text
                is='span'
                css={{ flex: '85%' }}
                fontSize='sm'
                {...{ css: styles.autoReplenishLabel }}
            >
                {getAutoReplenText('getItFor')}{' '}
                <Text
                    is='span'
                    color='red'
                    fontWeight='bold'
                    children={`${formatSavingAmountString(currentSku)} `}
                />
                {currentSku?.acceleratedPromotion ? autoReplenPromoText : getAutoReplenText('withAutoReplen')}
            </Text>
        );
    };

    disableAddToBasketButtonForPickup = () => {
        this.setState({
            getItShipped: false,
            sameDayDelivery: false,
            reserveAndPickup: true,
            productExtraDetailsLoaded: false
        });
    };

    reserveAndPickupClick = (event, ignoreReserveAndPickupState = false) => {
        if (!ignoreReserveAndPickupState && this.state.reserveAndPickup && !this.state.isBopisFirstOption) {
            return;
        }

        this.setState({ trackedStoreId: '' });

        // As the user can switch back and forth between BOPIS and Same Day Delivery, make sure
        // we get rid of all extra properties (for BOPIS, pickupMessage and inventory; for instance
        // and sameDayDeliveryMessage for SDD) so that we have accurate stock and delivery messages
        if (ExtraProductDetailsUtils.hasProductExtraProps(this.state.currentProduct)) {
            store.dispatch(ProductActions.restoreProductWithNoExtraDetails());
        }

        const userProfileId = store.getState().user.profileId;
        const preferredStoreInfo = store.getState().user.preferredStoreInfo;
        const storeId = preferredStoreInfo?.storeId;
        const cachedPickupStore = basketUtils.getCachedPickupStore();

        // Ensure the user's current session to have a preferred store selected on CE side.
        // When an anomymous user session is expired, the API returns 'Out of Stock'
        //  messages because of the lack of an store selected.
        const shouldSwitchStore = userUtils.isAnonymous() && (!cachedPickupStore || storeId !== cachedPickupStore.storeId);
        const switchPreferredStore = shouldSwitchStore ? profileApi.switchPreferredStore : () => Promise.resolve();

        // When there is no preferred store, The Switch Preferred Store API will fail
        // and the GET ROPIS Specific Product Details API won't be called, thus
        // we won't execute rest of the code if this condition met.
        if (!storeId && shouldSwitchStore) {
            this.disableAddToBasketButtonForPickup();

            return;
        }

        let skuId;

        if (this.state.currentProduct.currentSku) {
            skuId = this.state.currentProduct.currentSku.skuId;
        }

        switchPreferredStore(storeId, true)
            .then(switchPreferredStoreResponse => {
                if (switchPreferredStoreResponse?.success) {
                    basketUtils.cachePickupStore(preferredStoreInfo, true);

                    if (Sephora.configurationSettings.setZipStoreCookie) {
                        cookieUtils.write(cookieUtils.KEYS.PREFERRED_STORE, preferredStoreInfo.storeId, null, false, false);
                    }
                }

                profileApi
                    .getRopisSpecificProductDetails(userProfileId, this.state.currentProduct.productDetails.productId, skuId, 'pdp')
                    .then(data => {
                        if (
                            data.currentSku.actionFlags?.isBopisableStore &&
                            data.currentSku.actionFlags?.isBopisableStore !== preferredStoreInfo.isBopisable
                        ) {
                            storeUtils.cacheStoreData({
                                ...preferredStoreInfo,
                                isBopisable: true
                            });
                            store.dispatch(
                                userActions.updatePreferredStore({
                                    preferredStoreInfo: {
                                        ...preferredStoreInfo,
                                        isBopisable: true
                                    }
                                })
                            );
                        }

                        store.dispatch(ProductActions.updateReserveOnlinePickUpInStoreProductDetails(data));

                        this.setState(
                            {
                                getItShipped: false,
                                sameDayDelivery: false,
                                reserveAndPickup: true,
                                productExtraDetailsLoaded: true
                            },
                            this.fireShippingAnalytics(anaConsts.DELIVERY_OPTIONS_MAP.Pickup, data)
                        );
                    })
                    .catch(() => {
                        this.disableAddToBasketButtonForPickup();
                    });
            })
            .catch(() => {
                this.disableAddToBasketButtonForPickup();
            });
    };

    autoReplenishClick = isAutoReplenish => {
        this.setState({
            autoReplenishChecked: isAutoReplenish,
            isAutoReplenMostCommon: isAutoReplenish ? this.isAutoReplenMostCommon() : false
        });
    };

    fireDeliveryFrequencyModalTracking = isOpen => {
        const linkData = isOpen ? anaConsts.LinkData.AUTO_REPLENISH_FREQUENCY_OPEN : anaConsts.LinkData.AUTO_REPLENISH_FREQUENCY_CLOSE;
        const pageType = anaConsts.PAGE_TYPES.AUTO_REPLENISH;
        const pageDetail = anaConsts.PAGE_DETAIL.DELIVERY_FREQUENCY;
        const productStrings = anaUtils.buildSingleProductString({ sku: this.state?.currentProduct?.currentSku });
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${pageType}:${pageDetail}:n/a:*`,
                pageType,
                pageDetail,
                linkData,
                productStrings
            }
        });
    };

    updateFrequencyModal = ({
        replenishmentFreqNum = this.state.replenishmentFreqNum,
        replenishmentFreqType = this.state.replenishmentFreqType,
        quantity
    }) => {
        this.setState({
            isFrequencyModalOpen: false,
            replenishmentFreqNum,
            replenishmentFreqType,
            quantity
        });
    };

    toggleDeliveryFrequencyModal = isOpen => {
        this.setState({
            isFrequencyModalOpen: isOpen
        });
        this.fireDeliveryFrequencyModalTracking(isOpen);
    };

    sameDayDeliveryClick = (sameDayAvailable, isUpdatedZipCode) => {
        if (this.state.sameDayDelivery && !isUpdatedZipCode) {
            return;
        }

        this.setState(
            {
                getItShipped: false,
                sameDayDelivery: true,
                reserveAndPickup: false,
                productExtraDetailsLoaded: false,
                sameDayAvailable,
                serviceUnavailable: false,
                sameDayNotAvailableForZip: false
            },
            this.callSameDaySpecificProductDetails
        );
    };

    callSameDaySpecificProductDetails = () => {
        // As the user can switch back and forth between BOPIS and Same Day Delivery, make sure
        // we get rid of all extra properties (for BOPIS, pickupMessage and inventory; for instance
        // and sameDayDeliveryMessage for SDD) so that we have accurate stock and delivery messages
        if (ExtraProductDetailsUtils.hasProductExtraProps(this.state.currentProduct)) {
            store.dispatch(ProductActions.restoreProductWithNoExtraDetails());
        }

        const userProfileId = store.getState().user.profileId;
        const productId = this.state.currentProduct.productDetails.productId;
        let skuId;

        if (this.state.currentProduct.currentSku) {
            skuId = this.state.currentProduct.currentSku.skuId;
        }

        // If user is recognized and has a preferredZipcode, their zipcode is not yet
        // initialized, so we must update it before procceeding, or else, we'll get
        // «Same Day Deliver not available for thiz zipcode» error from BE
        const isRecognized = userUtils.isRecognized();
        const zipCode = userUtils.getZipCode();
        const promise = isRecognized && zipCode ? userLocationUtils.updatePreferredZipCode({ postalCode: zipCode }) : Promise.resolve();

        // TODO: More eficient way to work around recognized user's not set zipcode,
        // so that we don't need to update it until they sign in
        promise.then(() => {
            profileApi
                .getSameDaySpecificProductDetails(userProfileId, productId, skuId, 'pdp')
                .then(data => {
                    store.dispatch(ProductActions.updateSameDayDeliveryProductDetails(data));
                    const user = store.getState().user;
                    const { userSubscriptions } = user;

                    const SDUSubscription = userSubscriptions?.filter(subscription => subscription.type === 'SDU') || Empty.Array;
                    const isUserSDUTrialEligible = userUtils.isAnonymous() ? true : SDUSubscription.length > 0 && SDUSubscription[0].isTrialEligible;
                    const isUserEligibleForSubscription =
                        SDUSubscription.length > 0 && !SDUSubscription[0].isTrialEligible && SDUSubscription[0].status === 'INACTIVE';
                    const isSDUBannerVisible = isUserSDUTrialEligible || data.SDUProduct.isSDUAddedToBasket || isUserEligibleForSubscription;

                    this.setState(
                        {
                            productExtraDetailsLoaded: true,
                            isSDUAddedToBasket: data.SDUProduct?.isSDUAddedToBasket,
                            skuTrialEligibility: data.SDUProduct?.skuTrialEligibility,
                            skuTrialPeriod: data.SDUProduct?.skuTrialPeriod,
                            isUserSDUTrialEligible,
                            isSDUBannerVisible
                        },
                        () => this.fireShippingAnalytics(anaConsts.DELIVERY_OPTIONS_MAP.Sameday, data)
                    );
                })
                .catch(err => {
                    this.sameDayAPIError(err);
                });
        });
    };

    sameDayAPIError = err => {
        const exception = err?.errorMessages;
        const serviceUnavailableErrors = err?.errors?.serviceUnavailable?.length > 0;
        const serviceExceptionErrors = err?.errors?.serviceException?.length > 0;
        const invalidInputErrors = err?.errors?.invalidInput?.length > 0;
        const ZipcodeException = err?.errors?.ZipcodeException?.length > 0;

        if (exception) {
            this.setState({
                sameDayAvailable: false,
                serviceUnavailable: serviceExceptionErrors || serviceUnavailableErrors,
                sameDayNotAvailableForZip: ZipcodeException || invalidInputErrors
            });
        }
    };

    loadPurchaseHistoryIfNeeded = () => {
        const { showPreviouslyPurchasedPdp } = this.state;
        const user = userUtils.getProfileId();
        const completePurchaseHistoryItems = store.getState().completePurchaseHistoryItems || [];

        // Only load if the A/B test is enabled, user is BI, and data is not already available
        if (showPreviouslyPurchasedPdp && user && completePurchaseHistoryItems.length === 0) {
            store
                .dispatch(
                    userActions.fetchCompletePurchaseHistory(
                        { userId: user },
                        {
                            showPreviouslyPurchasedPdp: true,
                            useIndexedDB: true,
                            cacheKey: `purchaseHistory_${user}`
                        }
                    )
                )
                .catch(err => {
                    // Don't fail the component if purchase history fetch fails
                    console.error('[RegularProduct Purchase History Fetch Error]:', err);
                });
        }
    };
}

RegularProduct.prototype.shouldUpdateStateOn = [
    'currentProduct.currentSku.actionFlags',
    'currentProduct.currentSku.skuId',
    'currentProduct.currentSkuQuantity',
    'currentProduct.customSetsChoices',
    'currentProduct.hoveredSku.skuId',
    'currentProduct.pickupMessage',
    'currentProduct.productDetails.productId',
    'currentProduct.relatedLinks',
    'currentProduct.ancillarySkus'
];

const styles = {
    priceContainer: {
        flexDirection: 'column',
        alignItems: 'baseline'
    },
    autoReplenishLabel: {
        textTransform: 'capitalize',
        marginTop: 0,
        [mediaQueries.xsMax]: {
            marginTop: '5px'
        }
    }
};

RegularProduct.defaultProps = {
    minProducts: 1,
    maxProducts: 1,
    isHomePage: false,
    highlightValueHidden: false
};

export default wrapComponent(RegularProduct, 'RegularProduct', true);
