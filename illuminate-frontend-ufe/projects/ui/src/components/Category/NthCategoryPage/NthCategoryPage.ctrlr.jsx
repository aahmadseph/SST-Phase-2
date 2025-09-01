import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'store/Store';

import { Box, Text, Divider } from 'components/ui';
import BreadCrumbs from 'components/Catalog/BreadCrumbs';
import CatalogLayout from 'components/Catalog/CatalogLayout';
import RegularFilters from 'components/Catalog/Filters';
import { withUpperFunnelProps } from 'viewModel/catalog/upperFunnel/withUpperFunnelProps';
const Filters = withUpperFunnelProps(RegularFilters);
import Categories from 'components/Catalog/Categories';
import RegularProductGrid from 'components/Catalog/ProductGrid';
const ProductGrid = withUpperFunnelProps(RegularProductGrid);
import SeoText from 'components/Catalog/SeoText';
import SoftLinks from 'components/Catalog/SoftLinks';
import RelatedContent from 'components/RelatedContent';
import mediaUtils from 'utils/Media';
import { PAGE_TYPES } from 'utils/CatalogConstants';
import catalogUtils from 'utils/Catalog';
import CatalogPageBindings from 'analytics/bindingMethods/pages/catalog/catalogPageBindings';
import pixleeUtils from 'utils/pixlee';
import LazyLoad from 'components/LazyLoad';
import localeUtils from 'utils/LanguageLocale';
import Copy from 'components/Content/Copy';
import userUtils from 'utils/User';
import { CLICK_TRACKER_ID_FIELD } from 'constants/sponsoredProducts';
import RMN_BANNER_TYPES from 'components/Rmn/constants';
import spaUtils from 'utils/Spa';
import RmnUtils from 'utils/rmn';
import RmnAndPlaUtils from 'utils/rmnAndPla';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { RmnMainBanner, RmnSideBanner } from 'components/Rmn/RmnBanner';
import PixleeContainer from 'components/Catalog/PixleeContainer/PixleeContainer';
import nthCategoryBindings from 'analytics/bindingMethods/pages/nthCategory/NthCategoryBindings';
import { PostLoad } from 'constants/events';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';
import contentConstants from 'constants/content';
import BeautyPreferenceSpoke from 'components/BeautyPreferenceSpoke';
import { getMatchReferer } from 'analytics/utils/cmsReferer';
import ComponentResponsiveChangeCheck from 'utils/ComponentResponsiveChangeCheck';
import Empty from 'constants/empty';
import bpRedesignedUtils from 'utils/BeautyPreferencesRedesigned.js';

import RmnLeaderboardBanner from 'components/Rmn/RmnLeaderboardBanner';
import RmnSiderailBanner from 'components/Rmn/RmnSiderailBanner';
import RmnBottomBanner from 'components/Rmn/RmnBottomBanner';
import { mountBannerEventData } from 'analytics/utils/eventName';
import anaConsts from 'analytics/constants';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';

const { FILTERS_SIDEBAR_WIDTH } = contentConstants;
const { Media } = mediaUtils;
const { loadPixlee } = pixleeUtils;

const COLLAPSED_ACCORDION_HEIGHT = 50;
const DEFAULT_SIDEBAR_HEIGHT = 1000;
const EXTRA_HEIGHT_WHEN_ALL_FILTERS_SHOWN = 200;

const {
    POSITIONS, MOBILE_VIEW, SECTIONS, TYPES, LEADERBOARD_POSITION_INDEX, BANNER_AND_PLA_TYPES
} = RMN_BANNER_TYPES;
const BANNER_POSITIONS = POSITIONS;

const RenderSidebar = ({
    catalog,
    pageType,
    categoriesProps,
    filters,
    isMobile,
    rmnBannerPayload,
    fallbackBannerPayload,
    slotPrefix,
    showNthCategoryChicletsInFilter,
    rootRef
}) => {
    const renderRmnSiderailBanner = () => {
        if (!Object.keys(rmnBannerPayload)?.length) {
            return null;
        }

        // Get the slot value from payload or use the default
        const slot = rmnBannerPayload?.slot || `${slotPrefix}${TYPES.WIDE_SIDESCRAPER.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`;

        // Create the banner props object required for click tracking
        const sideBannerProps = {
            slot,
            section: SECTIONS.SIDEBAR,
            type: TYPES.WIDE_SIDESCRAPER.NAME,
            position: POSITIONS.TOP,
            source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
            clickEventName: mountBannerEventData({
                section: SECTIONS.SIDEBAR,
                targetPage: anaConsts.RMN_PAGE_NAMES.category,
                type: anaConsts.EVENTS_TYPES_NAME.CLICK
            }),
            viewableEventName: mountBannerEventData({
                section: SECTIONS.SIDEBAR,
                targetPage: anaConsts.RMN_PAGE_NAMES.category,
                type: anaConsts.EVENTS_TYPES_NAME.VIEW
            })
        };

        return (
            <RmnSiderailBanner
                pageType={RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY}
                rmnBannerPayload={rmnBannerPayload}
                bannerProps={sideBannerProps}
                fallbackBannerPayload={fallbackBannerPayload}
            />
        );
    };
    const RmnBannerSidescraper = () => {
        return isRmnCombinedCallFeatureEnabled() ? (
            renderRmnSiderailBanner()
        ) : (
            <RmnSideBanner
                pageType={RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY}
                rootRef={rootRef}
            />
        );
    };

    return (
        <>
            <Text
                is='div'
                fontSize={['lg', 'xl']}
                lineHeight='tight'
                marginBottom={[null, null, '1em']}
                fontWeight='bold'
                css={{ order: -1 }}
            >
                {catalog.displayName}
            </Text>
            {pageType === PAGE_TYPES.NTH_CATEGORY_PAGE ? (
                <>
                    {filters}
                    {!isMobile && (
                        <Categories
                            {...categoriesProps}
                            showHeading={true}
                        />
                    )}
                </>
            ) : (
                <>
                    {!showNthCategoryChicletsInFilter && <Categories {...categoriesProps} />}
                    {filters}
                </>
            )}
            <LazyLoad component={RmnBannerSidescraper} />
        </>
    );
};

class NthCategoryPage extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            prevContextId: null,
            selectedFilters: {},
            appliedFilters: {},
            isPaginationFirstPage: props.isPaginationFirstPage,
            bannerLoading: true,
            isBeautyPreferencesSpokeDisabled: true,
            showUpdateDefaultSort: props.showUpdateDefaultSort,
            rmnSideRailBannerPayload: {},
            rmnLeaderboardBannerPayload: {},
            rmnMidPageBannerPayload: {},
            rmnBottomBannerPayload: {},
            fallbackBannerPayload: {}
        };

        this.responsiveCheck = null;

        if (Sephora.Util?.InflatorComps?.services?.CatalogService) {
            Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = props.catalog?.responseSource;
        }

        this.layoutWrapRef = React.createRef();
    }

    static getDerivedStateFromProps({ catalog, showUpdateDefaultSort }, state) {
        const pendingClientSideRender = catalog?.hasClientSideData && !state.hasClientSideData;

        if (catalog.contextId === state.prevContextId && !pendingClientSideRender) {
            return null;
        }

        const pageId = catalog.categoryId;
        const isSamePage = pageId === state.prevPageId;
        const result = catalogUtils.createFiltersWithSortRefinements(catalog, state.selectedFilters, isSamePage, showUpdateDefaultSort);
        const fireAnalytics = state.prevContextId !== null && !pendingClientSideRender; // always true except hard load case

        if (fireAnalytics) {
            if (isSamePage) {
                CatalogPageBindings.fireAsyncPageLoadAnalytics(catalog, result.categoryFilters); // on filters change
            } else {
                CatalogPageBindings.setPageLoadAnalytics(catalog, result.categoryFilters); // spa navigation analytics
            }
        }

        return {
            prevPageId: pageId,
            prevContextId: catalog.contextId,
            selectedFilters: result.filters,
            appliedFilters: result.filters,
            refinements: result.withSortRefinements,
            categoryFilters: result.categoryFilters,
            hasClientSideData: catalog?.hasClientSideData
        };
    }

    unmountPIQBannersAndPlas() {
        const { resetSponsorProducts } = this.props;

        resetSponsorProducts();

        if (this.responsiveCheck) {
            this.responsiveCheck.cleanup();
        }

        RmnUtils.resetBanners();
    }

    unmountBannersAndPlas() {
        RmnAndPlaUtils.resetPlaSponsorProducts();

        if (this.responsiveCheck) {
            this.responsiveCheck.cleanup();
        }

        RmnAndPlaUtils.resetBanners();
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        if (this.unsubscribeZipCode) {
            this.unsubscribeZipCode();
        }

        if (isRmnCombinedCallFeatureEnabled()) {
            this.unmountBannersAndPlas();
        } else {
            this.unmountPIQBannersAndPlas();
        }

        window.removeEventListener(PostLoad, this.initPixlee);
    }

    mountPIQBannersAndPlas() {
        const { catalog, getSponsorProducts, sponsoredProducts, plaEnabled } = this.props;
        const { isPaginationFirstPage } = this.state;

        const sponsoredProductOpts = {
            targetUrl: catalog?.targetUrl || '',
            products: catalog?.products || Empty.Array,
            categoryId: catalog?.categoryId || ''
        };

        this.responsiveCheck = new ComponentResponsiveChangeCheck(MOBILE_VIEW, this.requestPageBanners);

        if (plaEnabled && isPaginationFirstPage) {
            if (!sponsoredProducts.error) {
                getSponsorProducts(sponsoredProductOpts);
            }
        }

        // Resets any digitalData sponsor banner information from previous pages.
        RmnUtils.resetBanners();
    }

    buildBeautyPreferenceRefinements = ({ catalog, userInfo }) => {
        const { refinements } = this.state;
        const zeroProductsReturned = !catalog.products?.length;
        const parentCategoryId = catalog?.categories?.length && catalog.categories[0].categoryId;
        const categorySpecificMasterList = bpRedesignedUtils.getBeautyPreferencesWorldPageInfo(undefined, parentCategoryId);

        // Do not show BP Filter when
        // There are no products.
        // The category id is not in the master list
        if (!categorySpecificMasterList || zeroProductsReturned) {
            return;
        }

        if (categorySpecificMasterList && !zeroProductsReturned) {
            const newRefinements = refinements.map(refinement => {
                if (refinement.type === 'beautyPreferences') {
                    refinement.values = catalogUtils.getBeautyPreferencesRefinementValues({
                        userSavedBeautyPreferences: userInfo.customerPreference,
                        constructorRefinements: refinements,
                        categorySpecificMasterList
                    });
                }

                return refinement;
            });

            this.setState({ refinements: newRefinements, categorySpecificMasterList }, () => {
                const isSamePage = catalog.categoryId === this.state.prevPageId;
                const result = catalogUtils.createFiltersWithSortRefinements(catalog, this.state.selectedFilters, isSamePage);

                // Need to update applied filters based on latest props & send analytics call when updated
                this.setState({ appliedFilters: result.filters, selectedFilters: result.filters }, () => {
                    // Trigger analytics logic here
                    const fireAnalytics = this.state.prevContextId !== null; // Ensure this is true

                    if (fireAnalytics) {
                        if (isSamePage) {
                            CatalogPageBindings.fireAsyncPageLoadAnalytics(catalog, result.categoryFilters); // on filters change
                        } else {
                            CatalogPageBindings.setPageLoadAnalytics(catalog, result.categoryFilters); // spa navigation analytics
                        }
                    }
                });
            });
        }
    };

    componentDidMount() {
        const { catalog, onStoreChangedFromHeader, onZipCodeChangedFromHeader, userInfo } = this.props;
        const { categoryFilters } = this.state;

        this.buildBeautyPreferenceRefinements({ catalog, userInfo });

        this.setState({ isBeautyPreferencesSpokeDisabled: Storage.session.getItem(LOCAL_STORAGE.DISABLE_BEAUTY_PREFERENCES_SPOKE) });

        getMatchReferer();

        if (catalog?.categories) {
            CatalogPageBindings.setPageLoadAnalytics(catalog, categoryFilters); // hardload analytics
        }

        this.props.dispatchMarketingParams();

        this.unsubscribe = onStoreChangedFromHeader();

        this.unsubscribeZipCode = onZipCodeChangedFromHeader();

        if (isRmnCombinedCallFeatureEnabled()) {
            this.responsiveCheck = new ComponentResponsiveChangeCheck(MOBILE_VIEW, this.requestPageBannersAndPlas);

            // Resets any digitalData sponsor banner information from previous pages.
            RmnAndPlaUtils.resetBanners();
        } else {
            this.mountPIQBannersAndPlas();
        }

        if (this.isPixleeEnabled()) {
            window.addEventListener(PostLoad, this.initPixlee);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            isStoreIdAndZipCodeReady, validateUpperFunnelParams, getFulfillmentOptions, sponsoredProducts, totalBasketCount, catalog, userInfo
        } =
            this.props;

        if (!prevProps.isStoreIdAndZipCodeReady && isStoreIdAndZipCodeReady) {
            validateUpperFunnelParams(getFulfillmentOptions);
        }

        if (isRmnCombinedCallFeatureEnabled()) {
            this.updateBannersAndPlas(prevProps);
        } else {
            this.updatePIQBannersAndPlas(prevProps);
        }

        if (
            JSON.stringify(prevProps.userInfo?.customerPreference) !== JSON.stringify(userInfo?.customerPreference) ||
            JSON.stringify(prevProps.catalog.refinements) !== JSON.stringify(catalog.refinements)
        ) {
            // If refinements or user's beauty preferences have changed, we need to re-check the logic to build the BP section
            this.buildBeautyPreferenceRefinements({ catalog, userInfo });
        }

        // Adding sponsored products information on the digitalData object.
        const sponsorProducts = (sponsoredProducts?.products || []).map(product => {
            return {
                skuId: product?.currentSku?.skuId,
                clickTrackerId: product[CLICK_TRACKER_ID_FIELD] || '',
                impressionTrackerId: product?.impression_id || '',
                impressionPayload: product?.impression_payload || '',
                clickPayload: product?.click_payload || ''
            };
        });
        digitalData.page.category.sponsoredProducts = sponsorProducts;

        if (Sephora.Util?.InflatorComps?.services?.CatalogService) {
            Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = this.props.catalog?.responseSource;
        }

        digitalData.page.attributes.totalBasketCount = totalBasketCount;

        if (this.props.userInfo.isAnonymous && !digitalData.anonymousUserId) {
            digitalData.anonymousUserId = Sephora.Util.getBasketCache()?.profileId;
        }
    }

    updatePIQBannersAndPlas(prevProps) {
        const { catalog, resetSponsorProducts } = this.props;

        const sponsoredProductOpts = {
            targetUrl: catalog?.targetUrl || '',
            products: catalog?.products || []
        };

        if (prevProps.catalog?.targetUrl !== sponsoredProductOpts.targetUrl) {
            resetSponsorProducts();

            // Resets any digitalData sponsor banner information from previous pages.
            RmnUtils.resetBanners();
            this.responsiveCheck.triggerCallback();
        }
    }

    updateBannersAndPlas(prevProps) {
        const { catalog } = this.props;

        const targetUrl = catalog?.targetUrl || '';

        if (prevProps.catalog?.targetUrl !== targetUrl) {
            RmnAndPlaUtils.resetPlaSponsorProducts();

            // Resets any digitalData sponsor banner information from previous pages.
            RmnAndPlaUtils.resetBanners();
            this.responsiveCheck.triggerCallback();
        }
    }

    setLoading = loading => {
        this.setState({ bannerLoading: loading });
    };

    requestPageBanners = async isMobile => {
        const { catalog } = this.props;

        const targetUrl = catalog.targetUrl || '';
        const { routes } = spaUtils.getSpaTemplateInfoByTemplate(Sephora.template) || {};
        const category = catalogUtils.getCatalogName(targetUrl, routes?.[0]);
        const targets = { category: [category] };

        const productCount = catalog?.products?.length || 0;

        await RmnUtils.handleBannerData({
            contextId: catalog.categoryId,
            targets,
            isMobile,
            setLoading: this.setLoading,
            pageType: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
            targetUrl,
            productCount
        });
    };

    requestPageBannersAndPlas = async isMobile => {
        const { catalog } = this.props;
        const targetUrl = catalog.targetUrl || '';
        const { routes } = spaUtils.getSpaTemplateInfoByTemplate(Sephora.template) || {};
        const category = catalogUtils.getCatalogName(targetUrl, routes?.[0]);
        const targets = { category: [category] };

        const productCount = catalog?.products?.length || 0;

        const plaSponsoredProductOpts = {
            targetUrl: catalog?.targetUrl || '',
            products: catalog?.products || Empty.Array,
            categoryId: catalog?.categoryId || ''
        };

        const slot = await RmnAndPlaUtils.handleBannerAndPlaData({
            contextId: catalog.categoryId,
            targets,
            isMobile,
            setLoading: this.setLoading,
            pageType: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
            targetUrl,
            productCount,
            plaSponsoredProductOpts
        });

        const state = store.getState();

        const rmnBanners = state?.rmnBanners || {};

        // Gets the Side Rail Banner
        const bannersSlot = rmnBanners[slot];
        const bannerObjects = bannersSlot?.banners || {};
        const fallbackBanner = bannersSlot?.fallback || {};

        const getBannerPayload = (key, bannerPosition = 0) => {
            const banner = bannerObjects?.[key]?.[bannerPosition] || {};

            if (Object.keys(banner).length > 0) {
                return { ...banner, slot };
            }

            return {};
        };

        this.setState({
            rmnSideRailBannerPayload: getBannerPayload(BANNER_AND_PLA_TYPES.SIDERAIL),
            rmnLeaderboardBannerPayload: getBannerPayload(BANNER_AND_PLA_TYPES.LEADERBOARD, LEADERBOARD_POSITION_INDEX.TOP),
            rmnMidPageBannerPayload: getBannerPayload(BANNER_AND_PLA_TYPES.LEADERBOARD, LEADERBOARD_POSITION_INDEX.MID),
            rmnBottomBannerPayload: getBannerPayload(BANNER_AND_PLA_TYPES.LEADERBOARD, LEADERBOARD_POSITION_INDEX.BOTTOM),
            fallbackBannerPayload: fallbackBanner
        });

        const { getSponsorProducts, sponsoredProducts } = this.props;

        const sponsoredProductOpts = {
            targetUrl: catalog?.targetUrl || '',
            products: catalog?.products || Empty.Array,
            categoryId: catalog?.categoryId || ''
        };

        if (!sponsoredProducts.error) {
            getSponsorProducts(sponsoredProductOpts);
        }
    };

    selectFilters = (filtersToSelect, applyFilters = false) => {
        const newSelectedFilters = catalogUtils.addToSelection(this.state.selectedFilters, filtersToSelect);
        this.applySelectionIfChanged(newSelectedFilters, applyFilters);
    };

    removeFilterValue = (filterKey, filterValue, applyFilters = false) => {
        const newSelectedFilters = catalogUtils.removeValueFromSelection(this.state.selectedFilters, filterKey, filterValue);
        this.applySelectionIfChanged(newSelectedFilters, applyFilters);
    };

    clearFiltersSelection = (applyFilters, resetSortToDefault) => {
        nthCategoryBindings.clearAllChiclets();
        const { selectedFilters } = this.state;
        const newSelectedFilters = catalogUtils.resetSelection(selectedFilters, resetSortToDefault);
        this.applySelectionIfChanged(newSelectedFilters, applyFilters);
    };

    discardSelection = (applyFilters = false) => {
        this.applySelectionIfChanged(this.state.appliedFilters, applyFilters);
    };

    transformFiltersForAnalytics = filters => {
        const formattedFilters = [];

        for (const filterName in filters) {
            if (filters[filterName].length > 0) {
                const formattedFilterName = filterName.toLowerCase();
                const values = filters[filterName].map(value => {
                    // Regular filters have the following format:
                    // filters[Brand]=MILK MAKEUP
                    // but price range has this one
                    // pl=0&ph=250&ptype=manual

                    if (formattedFilterName === 'price range') {
                        return value;
                    } else {
                        const parts = value.split('=');

                        return parts.length > 1 ? parts[1].toLowerCase() : '';
                    }
                });

                formattedFilters.push(`${formattedFilterName}=${values.join(',')}`);
            }
        }

        return formattedFilters.join(';');
    };

    applySelectionIfChanged = (newSelectedFilters, applyFilters = false) => {
        const { selectedFilters: currentSelectedFilters } = this.state;

        if (JSON.stringify(newSelectedFilters) !== JSON.stringify(currentSelectedFilters)) {
            this.setState(
                {
                    selectedFilters: newSelectedFilters
                },
                () => {
                    if (applyFilters) {
                        this.applySelectedFilters();
                        const tappedChiclets = this.transformFiltersForAnalytics(newSelectedFilters);
                        nthCategoryBindings.selectFilter({ tappedChiclets });
                    }
                }
            );
        }
    };

    applySelectedFilters = () => {
        const { selectedFilters, refinements } = this.state;
        const filtersToApply = catalogUtils.createFiltersToApply(selectedFilters, refinements);
        this.props.applyFilters(filtersToApply);
    };

    getCurrentPageFromCatalog = ({ currentPage }) => {
        return currentPage || 1;
    };

    isPixleeEnabled = () => {
        const { catalog } = this.props;

        // remove `categoryUGCWidget` after successful contentful A/B test - ECOM-1601
        return Sephora.configurationSettings.enableUGCWidget && (catalog.content?.ugcWidget?.widgetId || catalog.categoryUGCWidget);
    };

    initPixlee = () => {
        loadPixlee();
    };

    getPixleeWidgetId = () => {
        const isUSInsider = userUtils.isInsider() && localeUtils.isUS();

        if (this.isPixleeEnabled() && !this.props.userInfo.isAnonymous && !isUSInsider) {
            const { catalog } = this.props;
            // remove `locale` + `categoryUGCWidget` after successful contentful A/B test - ECOM-1601
            const locale = `${localeUtils.getCurrentCountry().toLowerCase()}-${localeUtils.getCurrentLanguage().toLowerCase()}`;

            return catalog.content?.ugcWidget?.widgetId || catalog.categoryUGCWidget?.[locale];
        } else {
            return null;
        }
    };

    isFiltered = () => catalogUtils.isFiltered(this.state.appliedFilters);

    flagRmnBannerViewableImpression = rmnObj => {
        rmnObj['impressionFired'] = true;
    };

    hideBeautyPreferencesSpoke = () => {
        this.setState({ isBeautyPreferencesSpokeDisabled: true });
    };

    renderRmnLeaderboardBanner = slotPrefix => {
        const { rmnLeaderboardBannerPayload, fallbackBannerPayload } = this.state;

        return (
            <RmnLeaderboardBanner
                position={BANNER_POSITIONS.TOP}
                pageType={RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY}
                rmnBannerPayload={rmnLeaderboardBannerPayload}
                fallbackBannerPayload={fallbackBannerPayload}
                bannerProps={{
                    slot: rmnLeaderboardBannerPayload?.slot || `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`,
                    section: SECTIONS.MAIN,
                    type: TYPES.SUPER_LEADERBOARD.NAME,
                    position: BANNER_POSITIONS.TOP,
                    source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
                    clickEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.category,
                        type: anaConsts.EVENTS_TYPES_NAME.CLICK
                    }),
                    viewableEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.category,
                        type: anaConsts.EVENTS_TYPES_NAME.VIEW
                    })
                }}
            />
        );
    };

    renderRmnBottomBanner = slotPrefix => {
        const { rmnBottomBannerPayload, fallbackBannerPayload } = this.state;

        if (!Object.keys(rmnBottomBannerPayload)?.length) {
            return null;
        }

        return (
            <RmnBottomBanner
                position={BANNER_POSITIONS.BOTTOM}
                pageType={RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY}
                rmnBannerPayload={rmnBottomBannerPayload}
                fallbackBannerPayload={fallbackBannerPayload}
                bannerMobileProps={{
                    slot: rmnBottomBannerPayload?.slot || `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`,
                    section: SECTIONS.MAIN,
                    type: TYPES.SUPER_LEADERBOARD.NAME,
                    position: BANNER_POSITIONS.BOTTOM,
                    source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
                    clickEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.category,
                        type: anaConsts.EVENTS_TYPES_NAME.CLICK
                    }),
                    viewableEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.category,
                        type: anaConsts.EVENTS_TYPES_NAME.VIEW
                    })
                }}
            />
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            catalog,
            plaEnabled,
            userInfo,
            updateCustomerPreference,
            showMidPageBanner,
            showDynamicStickyFilter,
            setFilterBarVisibility,
            filterBarHidden,
            showNthCategoryChicletsInFilter = false
        } = this.props;
        const {
            categories, categoryId, contextId, linkEquityBlock = {}, quickFilter, pageType, parentCategory, schemas, content
        } = catalog;
        const {
            selectedFilters,
            appliedFilters,
            refinements,
            isPaginationFirstPage,
            bannerLoading,
            isBeautyPreferencesSpokeDisabled,
            categorySpecificMasterList
        } = this.state;

        const seoContent = catalog.seoMetaContent || catalog.seoContent || [];
        const hasSeoContent = seoContent.length > 0 || catalog?.seoText;
        const showBeautyPreferencesSpoke = !isBeautyPreferencesSpokeDisabled && !userInfo?.isAnonymous;
        const categoriesProps = {
            pageType,
            categories,
            parentCategory,
            categoryId
        };

        const filters = (
            <Filters
                pageId={categoryId}
                contextId={contextId}
                selectedFilters={selectedFilters}
                appliedFilters={appliedFilters}
                refinements={refinements}
                selectFilters={this.selectFilters}
                discardSelection={this.discardSelection}
                clearFiltersSelection={this.clearFiltersSelection}
                applySelectedFilters={this.applySelectedFilters}
                removeFilterValue={this.removeFilterValue}
                shouldStickySideBar
                userInfo={userInfo}
                categorySpecificMasterList={categorySpecificMasterList}
                showDynamicStickyFilter={showDynamicStickyFilter}
                setFilterBarVisibility={setFilterBarVisibility}
                filterBarHidden={filterBarHidden}
                categoriesProps={categoriesProps}
                showCompactPills
            />
        );

        const breadcrumbProps = {
            categories,
            categoryId,
            pageType: 'category'
        };

        const h1SeoName = catalogUtils.getCategoryDisplayName(categories, categoryId);
        const pixleeWidgetId = this.getPixleeWidgetId();
        const targetUrl = catalog.targetUrl || '';
        const { routes } = spaUtils.getSpaTemplateInfoByTemplate(Sephora.template) || {};
        const category = catalogUtils.getCatalogName(targetUrl, routes?.[0]);
        const targets = { category: [category] };
        const slotPrefix = localeUtils.isUS() ? '25' : '26';
        const filtered = this.isFiltered();
        const showSponsorProducts = plaEnabled && !filtered && isPaginationFirstPage;
        const allAppliedFiltersAreEmpty = Object.values(appliedFilters).every(filter => filter.length === 0);
        const sideBarSkeletonHeight = allAppliedFiltersAreEmpty
            ? refinements.length * COLLAPSED_ACCORDION_HEIGHT + EXTRA_HEIGHT_WHEN_ALL_FILTERS_SHOWN
            : DEFAULT_SIDEBAR_HEIGHT;
        const mobileSidebarSkeletonHeight = 174;
        const categoryNameSkeletonHeight = 25;
        const beautyPreferencesToSave = showBeautyPreferencesSpoke
            ? catalogUtils.getBeautyPreferencesSpokeValues({
                userSavedBeautyPreferences: userInfo.customerPreference,
                constructorRefinements: refinements,
                categorySpecificMasterList
            })
            : {};

        const tilesGridResultCount = (catalog?.products?.length || 0) + (catalog?.content?.marketingTiles?.length || 0);

        const { rmnSideRailBannerPayload, rmnMidPageBannerPayload, fallbackBannerPayload } = this.state;

        return (
            <div ref={this.layoutWrapRef}>
                <CatalogLayout
                    showDynamicStickyFilter={showDynamicStickyFilter}
                    filterBarHidden={filterBarHidden}
                    content={{
                        top: <BreadCrumbs {...breadcrumbProps} />,
                        sidebar: (
                            <CatalogLayout.SideBar shouldStickySideBar>
                                <Media greaterThan='sm'>
                                    {bannerLoading ? (
                                        <SkeletonBanner height={[null, mobileSidebarSkeletonHeight, sideBarSkeletonHeight]} />
                                    ) : (
                                        <RenderSidebar
                                            catalog={catalog}
                                            categoryId={categoryId}
                                            targets={targets}
                                            pageType={pageType}
                                            categoriesProps={categoriesProps}
                                            slotPrefix={slotPrefix}
                                            filters={filters}
                                            isMobile={false}
                                            flagViewableImpression={this.flagRmnBannerViewableImpression}
                                            rmnObj={{ impressionFired: false }}
                                            rmnBannerPayload={rmnSideRailBannerPayload}
                                            fallbackBannerPayload={fallbackBannerPayload}
                                            rootRef={this.layoutWrapRef}
                                        />
                                    )}
                                </Media>
                                <Media
                                    lessThan='md'
                                    css={{ display: 'contents' }}
                                >
                                    {bannerLoading ? (
                                        <>
                                            <SkeletonBanner
                                                height={[mobileSidebarSkeletonHeight - categoryNameSkeletonHeight, 66, sideBarSkeletonHeight]}
                                            />
                                            <div css={{ order: -1 }}>
                                                <SkeletonBanner height={categoryNameSkeletonHeight} />
                                            </div>
                                        </>
                                    ) : (
                                        <RenderSidebar
                                            catalog={catalog}
                                            categoryId={categoryId}
                                            targets={targets}
                                            pageType={pageType}
                                            categoriesProps={categoriesProps}
                                            slotPrefix={slotPrefix}
                                            filters={filters}
                                            isMobile={true}
                                            flagViewableImpression={this.flagRmnBannerViewableImpression}
                                            bannerLoading={bannerLoading}
                                            rmnObj={{ impressionFired: false }}
                                            rmnBannerPayload={rmnSideRailBannerPayload}
                                            fallbackBannerPayload={fallbackBannerPayload}
                                            showNthCategoryChicletsInFilter={showNthCategoryChicletsInFilter}
                                            rootRef={this.layoutWrapRef}
                                        />
                                    )}
                                </Media>
                            </CatalogLayout.SideBar>
                        ),
                        main: (
                            <>
                                {isRmnCombinedCallFeatureEnabled() ? (
                                    this.renderRmnLeaderboardBanner(slotPrefix)
                                ) : (
                                    <LazyLoad
                                        component={RmnMainBanner}
                                        position={BANNER_POSITIONS.TOP}
                                        pageType={RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY}
                                    />
                                )}
                                {pageType === PAGE_TYPES.TOP_CATEGORY && <SoftLinks links={content?.softLinks || quickFilter} />}
                                {showBeautyPreferencesSpoke && Object.keys(beautyPreferencesToSave).length > 0 ? (
                                    <BeautyPreferenceSpoke
                                        beautyPreferencesToSave={beautyPreferencesToSave}
                                        profileId={userInfo.profileId}
                                        customerPreference={userInfo.customerPreference}
                                        categorySpecificMasterList={categorySpecificMasterList}
                                        updateCustomerPreference={updateCustomerPreference}
                                        onHideSpoke={this.hideBeautyPreferencesSpoke}
                                    />
                                ) : null}
                                <ProductGrid
                                    h1={h1SeoName}
                                    layoutWrapRef={this.layoutWrapRef}
                                    selectedFilters={selectedFilters}
                                    appliedFilters={appliedFilters}
                                    refinements={refinements}
                                    selectFilters={this.selectFilters}
                                    source={'category'}
                                    removeFilterValue={this.removeFilterValue}
                                    clearAllFilters={this.clearFiltersSelection}
                                    showSponsorProducts={showSponsorProducts}
                                    showMidPageBanner={showMidPageBanner}
                                    increaseImageSizeGrid={true}
                                    rmnBannerPayload={rmnMidPageBannerPayload}
                                    fallbackBannerPayload={fallbackBannerPayload}
                                    midPageBannerProps={{
                                        slot:
                                            rmnMidPageBannerPayload?.slot ||
                                            `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY]}`,
                                        section: SECTIONS.MAIN,
                                        type: TYPES.SUPER_LEADERBOARD.NAME,
                                        position: BANNER_POSITIONS.MID,
                                        source: RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY,
                                        clickEventName: mountBannerEventData({
                                            section: SECTIONS.MAIN,
                                            targetPage: anaConsts.RMN_PAGE_NAMES.category,
                                            type: anaConsts.EVENTS_TYPES_NAME.CLICK
                                        }),
                                        viewableEventName: mountBannerEventData({
                                            section: SECTIONS.MAIN,
                                            targetPage: anaConsts.RMN_PAGE_NAMES.category,
                                            type: anaConsts.EVENTS_TYPES_NAME.VIEW
                                        })
                                    }}
                                    categoryId={categoryId}
                                />
                                {tilesGridResultCount > 12 &&
                                    (isRmnCombinedCallFeatureEnabled() ? (
                                        this.renderRmnBottomBanner(slotPrefix)
                                    ) : (
                                        <LazyLoad
                                            component={RmnMainBanner}
                                            position={BANNER_POSITIONS.BOTTOM}
                                            pageType={RMN_BANNER_TYPES.PAGE_TYPES.CATEGORY}
                                        />
                                    ))}
                            </>
                        ),
                        bottom: (
                            <>
                                {pageType === PAGE_TYPES.TOP_CATEGORY || (
                                    <BreadCrumbs
                                        {...breadcrumbProps}
                                        isBottom={true}
                                    />
                                )}
                                {pixleeWidgetId && (
                                    <LazyLoad
                                        component={PixleeContainer}
                                        categoryId={categoryId}
                                        widgetId={pixleeWidgetId}
                                        containerId='PixleeContainer'
                                    />
                                )}
                                <Categories
                                    {...categoriesProps}
                                    isBottom={true}
                                />
                                {content?.copy?.length > 0 && content?.copy?.[0]?.content && (
                                    <>
                                        <Divider
                                            marginTop={[4, 5]}
                                            marginBottom={0}
                                        />
                                        {content?.copy?.map((item, index) => (
                                            <Copy
                                                content={item.content}
                                                key={item.sid}
                                                marginTop={[4, index === 0 ? 5 : 4]}
                                                marginBottom={index === content.copy.length - 1 && hasSeoContent ? [4, 5] : 0}
                                            />
                                        ))}
                                    </>
                                )}
                                {hasSeoContent && (
                                    <Box>
                                        <Divider
                                            marginTop={[4, 5]}
                                            marginBottom={[4, 5]}
                                        />
                                        <SeoText
                                            contextId={categoryId}
                                            content={seoContent}
                                            text={catalog?.seoText}
                                        />
                                    </Box>
                                )}
                                <RelatedContent
                                    hasDivider={hasSeoContent || content?.copy?.length > 0 || categoriesProps?.categories?.length > 0}
                                    links={linkEquityBlock?.links}
                                />
                            </>
                        )
                    }}
                    currentPage={this.getCurrentPageFromCatalog(catalog)}
                    columnWidth={FILTERS_SIDEBAR_WIDTH.STICKY}
                    backToTopPosition={110}
                />

                {schemas?.length &&
                    schemas.map(schema => (
                        <script
                            key={schema['@type']}
                            type='application/ld+json'
                            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                        ></script>
                    ))}
            </div>
        );
    }
}

NthCategoryPage.propTypes = {
    getFulfillmentOptions: PropTypes.func,
    onStoreChangedFromHeader: PropTypes.func,
    onZipCodeChangedFromHeader: PropTypes.func,
    getSponsorProducts: PropTypes.func,
    isPaginationFirstPage: PropTypes.bool.isRequired,
    showStickyFilter: PropTypes.bool
};

NthCategoryPage.defaultProps = {
    getFulfillmentOptions: () => {},
    onStoreChangedFromHeader: () => {},
    onZipCodeChangedFromHeader: () => {},
    getSponsorProducts: () => {},
    isPaginationFirstPage: false,
    showDynamicStickyFilter: false,
    filterBarHidden: false
};

export default wrapComponent(NthCategoryPage, 'NthCategoryPage', true);
