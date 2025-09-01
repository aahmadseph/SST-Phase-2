import React from 'react';
import RmnUtils from 'utils/rmn';
import RmnAndPlaUtils from 'utils/rmnAndPla';
import PropTypes from 'prop-types';
import { Text } from 'components/ui';
import anaUtils from 'analytics/utils';
import catalogUtils from 'utils/Catalog';
import FrameworkUtils from 'utils/framework';
import Location from 'utils/Location';
import BaseClass from 'components/BaseClass';
import RMN_BANNER_TYPES_CONSTANTS from 'components/Rmn/constants';
import { RmnMainBanner, RmnSideBanner } from 'components/Rmn/RmnBanner';
import LanguageLocale from 'utils/LanguageLocale';
import LazyLoad from 'components/LazyLoad';
import RegularProductGrid from 'components/Catalog/ProductGrid';
import RegularFilters from 'components/Catalog/Filters/Filters';
import NullSearch from 'components/Search/NullSearch/NullSearch';
import BreadCrumbs from 'components/Catalog/BreadCrumbs/BreadCrumbs';
import CatalogLayout from 'components/Catalog/CatalogLayout/CatalogLayout';
import { withUpperFunnelProps } from 'viewModel/catalog/upperFunnel/withUpperFunnelProps';
import SearchCategories from 'components/Catalog/Search/SearchCategories';
import CatalogPageBindings from 'analytics/bindingMethods/pages/catalog/catalogPageBindings';
import ComponentResponsiveChangeCheck from 'utils/ComponentResponsiveChangeCheck';
import { breakpoints } from 'style/config';
import Empty from 'constants/empty';
import localeUtils from 'utils/LanguageLocale';

import RmnLeaderboardBanner from 'components/Rmn/RmnLeaderboardBanner';
import RmnSiderailBanner from 'components/Rmn/RmnSiderailBanner';
import RmnBottomBanner from 'components/Rmn/RmnBottomBanner';
import { mountBannerEventData } from 'analytics/utils/eventName';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';
import store from 'store/Store';
import anaConsts from 'analytics/constants';

const Filters = withUpperFunnelProps(RegularFilters);
const { getLocaleResourceFile } = LanguageLocale;
const ProductGrid = withUpperFunnelProps(RegularProductGrid);

const getText = getLocaleResourceFile('components/Search/locales', 'Search');
const SELECTED_OPTIONS = {
    parameter: 'isSelected',
    value: true
};

const {
    PAGE_TYPES, POSITIONS, SECTIONS, MOBILE_VIEW, TYPES, LEADERBOARD_POSITION_INDEX, BANNER_AND_PLA_TYPES
} = RMN_BANNER_TYPES_CONSTANTS;
const { wrapComponent } = FrameworkUtils;

const isSmallView = () => window.matchMedia(breakpoints.smMax).matches;

class Search extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            prevContextId: null,
            trackContextId: null,
            selectedFilters: {},
            appliedFilters: {},
            refinements: [],
            prevCatalogWithOutContextId: {},
            isSalePage: false,
            isSearchPage: false,
            sidebarTitle: '',
            productGridResultCount: 0,
            bannerLoading: true,
            filtersAppliedFlag: false,
            rmnSideRailBannerPayload: {},
            rmnLeaderboardBannerPayload: {},
            rmnMidPageBannerPayload: {},
            rmnBottomBannerPayload: {},
            fallbackBannerPayload: {}
        };
        this.responsiveCheck = null;
        this.lastKeyword = null;
        this.layoutWrapRef = React.createRef();
    }

    // Create a skeleton while catalog is being loaded
    renderSkeletonList = () => {
        return (
            <div
                css={[
                    {
                        height: '100vh',
                        width: '100%',
                        maxWidth: 1280,
                        paddingLeft: 16,
                        paddingRight: 16,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        overflowY: 'hidden'
                    }
                ]}
            >
                &nbsp;
            </div>
        );
    };

    // Used to extract all available category names.
    categoryReducer = (arr, value) => {
        if (value?.displayName) {
            arr.push(value.displayName);
        }

        if (value?.subCategories) {
            arr.concat(value.subCategories.reduce(this.categoryReducer, arr));
        }

        return arr;
    };

    // Gets the categories available for this page.
    getPageCategoriesList = () => {
        const { catalog } = this.props;

        return !catalog.categories ? [] : catalog.categories.reduce(this.categoryReducer, []);
    };

    // Gets the meni items from the connected HOC.
    getMenuItemsList = () => {
        const { menuItems = [] } = this.props;
        const result = [];
        // Pulls the Makeup category.
        const categoryMenuItems = menuItems.filter(menu => menu.targetUrl === '/shop/makeup-cosmetics');

        // Verifies that there is at least one item to check.
        if (categoryMenuItems.length === 0) {
            return [];
        }

        // Adds the first level of the allowed categories.
        result.push(categoryMenuItems[0].titleText);

        // Extracts all categories that allow sponsor banners.
        categoryMenuItems[0].componentList.forEach(menuItem => {
            result.push(menuItem.titleText);
        });

        return result;
    };

    static getDerivedStateFromProps(props, state) {
        const { catalog, isSalePage, isSearchPage } = props;

        const sidebarTitle = catalogUtils.getTextSidebarTitle(isSearchPage, isSalePage, state.sidebarTitle);

        if (catalogUtils.checkNullCaseForDerivedStateFromProps(catalog, state.prevContextId)) {
            if (isSalePage !== state.isSalePage || isSearchPage !== state.isSearchPage) {
                return {
                    isSalePage,
                    isSearchPage,
                    sidebarTitle
                };
            }

            return null;
        }

        const { contextId, ...catalogWithOutContextId } = catalog;
        let trackContextId = null;
        const currentCategory = catalogUtils.getCategoryInfoFromCategories(catalog.categories, SELECTED_OPTIONS) || {};
        const pageId = `${currentCategory.nodeValue || currentCategory.nodeStr || ''}${catalog.keyword}`;
        const isSamePage = pageId === state.prevPageId;
        // isDiferentCatalog prevents firing s.t calls when the same catalog object is received apart from contextId.
        const isDifferentCatalog = JSON.stringify(catalogWithOutContextId) !== JSON.stringify(state.prevCatalogWithOutContextId);
        const result = catalogUtils.createFiltersWithSortRefinements(catalog, state.selectedFilters, isSamePage);
        const fireAnalytics = state.prevContextId !== null; // always true except hard load case

        if (fireAnalytics && isDifferentCatalog) {
            if (isSamePage || Object.keys(currentCategory).length > 0) {
                CatalogPageBindings.fireAsyncPageLoadAnalytics(catalog, result.categoryFilters || []); // on filters change
            } else {
                CatalogPageBindings.setSearchPageLoadAnalytics(catalog, result.categoryFilters || []); // spa navigation analytics
            }
        } else if (catalog && Object.keys(catalog).length > 0 && state.prevContextId === null) {
            CatalogPageBindings.setSearchPageLoadAnalytics(catalog, result.categoryFilters || []);
        }

        if (!state.prevContextId || state.trackContextId !== state.prevContextId) {
            trackContextId = catalog.contextId;

            // Fires generic search event to be used with the tag manager vendors.
            anaUtils.fireEventForTagManager('searchEvent');
        }

        return {
            prevPageId: pageId,
            prevContextId: catalog.contextId,
            selectedFilters: result.filters,
            appliedFilters: result.filters,
            refinements: result.withSortRefinements,
            categoryFilters: result.categoryFilters,
            prevCatalogWithOutContextId: catalogWithOutContextId,
            trackContextId,
            isSalePage,
            isSearchPage,
            sidebarTitle
        };
    }

    mountPIQBannersAndPlas() {
        this.responsiveCheck = new ComponentResponsiveChangeCheck(MOBILE_VIEW, this.requestPageBanners);

        // Resets any digitalData sponsor banner information from previous pages.
        RmnUtils.resetBanners();
    }

    componentDidMount() {
        const { catalog, onStoreChangedFromHeader, onZipCodeChangedFromHeader, queryParams } = this.props;
        const { categoryFilters } = this.state;

        if (catalog && Object.keys(catalog).length !== 0) {
            CatalogPageBindings.setSearchPageLoadAnalytics(catalog, categoryFilters); // hardload analytics
        }

        this.unsubscribe = onStoreChangedFromHeader();
        this.unsubscribeZipCode = onZipCodeChangedFromHeader();
        this.props.dispatchMarketingParams();

        if (isRmnCombinedCallFeatureEnabled()) {
            this.lastKeyword = global.decodeURIComponent((catalog?.keyword ? catalog.keyword : queryParams?.keyword?.[0]) || '');

            this.responsiveCheck = new ComponentResponsiveChangeCheck(MOBILE_VIEW, this.requestPageBannersAndPlas);

            // Resets any digitalData sponsor banner information from previous pages.
            RmnAndPlaUtils.resetBanners();
        } else {
            this.mountPIQBannersAndPlas();
        }
    }

    componentDidUpdate(prevProps) {
        const { catalog, isSearchPage, queryParams } = this.props;
        const { filtersAppliedFlag } = this.state;

        const currentCategory = catalogUtils.getCategoryInfoFromCategories(catalog.categories, SELECTED_OPTIONS) || {};
        const pageId = `${currentCategory.nodeValue || currentCategory.nodeStr || ''}${catalog.keyword}`;
        const prevCategory = catalogUtils.getCategoryInfoFromCategories(prevProps.catalog.categories, SELECTED_OPTIONS) || {};
        const prevPageId = `${prevCategory.nodeValue || prevCategory.nodeStr || ''}${prevProps.catalog.keyword}`;
        const resultsKeyword = global.decodeURIComponent(catalog?.keyword ? catalog.keyword : queryParams?.keyword?.[0]);
        const prevResultsKeyword = prevProps?.catalog?.keyword ? prevProps.catalog.keyword : prevProps?.queryParams?.keyword?.[0];
        const isKeywordChanged = prevResultsKeyword !== resultsKeyword;

        if (pageId !== prevPageId || (isKeywordChanged && !prevProps.isSearchPage && isSearchPage) || (isKeywordChanged && filtersAppliedFlag)) {
            // Resets any digitalData sponsor banner information from previous pages.

            if (isRmnCombinedCallFeatureEnabled()) {
                this.lastKeyword = resultsKeyword;

                this.updateBannersAndPlas();
            } else {
                this.updatePIQBannersAndPlas();
            }

            this.setState({ filtersAppliedFlag: false });
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
        }

        if (this.unsubscribeZipCode) {
            this.unsubscribeZipCode();
        }

        if (this.responsiveCheck) {
            this.responsiveCheck.cleanup();
        }

        if (isRmnCombinedCallFeatureEnabled()) {
            RmnAndPlaUtils.resetBanners();
        } else {
            RmnUtils.resetBanners();
        }
    }

    updatePIQBannersAndPlas() {
        RmnUtils.resetBanners();
        this.requestPageBanners(Sephora.isMobile());
    }

    updateBannersAndPlas() {
        RmnAndPlaUtils.resetBanners();
        this.requestPageBannersAndPlas(Sephora.isMobile());
    }

    setLoading = loading => {
        this.setState({ bannerLoading: loading });
    };

    requestPageBanners = async isMobile => {
        const { catalog } = this.props;

        const matchProducts = catalog && catalog.products ? catalog.products.map(product => product?.productId || '').slice(0, 10) : [];

        this.setLoading(true);

        // eslint-disable-next-line camelcase
        const targets = { match_products: matchProducts };

        await RmnUtils.handleBannerData({
            targets,
            isMobile,
            setLoading: this.setLoading,
            pageType: PAGE_TYPES.SEARCH,
            contextId: catalog.contextId,
            productCount: catalog?.products?.length || 0
        });
    };

    requestPageBannersAndPlas = async isMobile => {
        const { catalog } = this.props;
        const targetUrl = catalog.targetUrl || '';
        const matchProducts = catalog && catalog.products ? catalog.products.map(product => product?.productId || '').slice(0, 10) : Empty.Array;

        if (!matchProducts?.length) {
            return;
        }

        // eslint-disable-next-line camelcase
        const targets = { match_products: matchProducts };

        const productCount = catalog?.products?.length || 0;

        const plaSponsoredProductOpts = {
            targetUrl: catalog?.targetUrl || '',
            products: catalog?.products || Empty.Array,
            categoryId: catalog?.categoryId || ''
        };

        this.setLoading(true);

        const slot = await RmnAndPlaUtils.handleBannerAndPlaData({
            contextId: catalog.categoryId,
            targets,
            isMobile,
            setLoading: this.setLoading,
            pageType: PAGE_TYPES.SEARCH,
            targetUrl,
            productCount,
            searchTerm: this.lastKeyword,
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
            fallbackBannerPayload: fallbackBanner,
            bannerLoading: false
        });
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
        const { selectedFilters } = this.state;
        const newSelectedFilters = catalogUtils.resetSelection(selectedFilters, resetSortToDefault);
        this.applySelectionIfChanged(newSelectedFilters, applyFilters);
    };

    discardSelection = (applyFilters = false) => {
        this.applySelectionIfChanged(this.state.appliedFilters, applyFilters);
    };

    applySelectionIfChanged = (newSelectedFilters, applyFilters = false) => {
        const { selectedFilters: currentSelectedFilters } = this.state;

        if (JSON.stringify(newSelectedFilters) !== JSON.stringify(currentSelectedFilters)) {
            this.setState(
                {
                    selectedFilters: newSelectedFilters,
                    filtersAppliedFlag: true
                },
                () => {
                    if (applyFilters) {
                        this.applySelectedFilters();
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

    flagRmnBannerViewableImpression = rmnObj => {
        rmnObj['impressionFired'] = true;
    };

    setProductGridResultCount = count => {
        this.setState({ productGridResultCount: count });
    };

    renderRmnLeaderboardBanner = slotPrefix => {
        const { rmnLeaderboardBannerPayload, fallbackBannerPayload } = this.state;

        return (
            <RmnLeaderboardBanner
                position={POSITIONS.TOP}
                pageType={PAGE_TYPES.SEARCH}
                rmnBannerPayload={rmnLeaderboardBannerPayload}
                fallbackBannerPayload={fallbackBannerPayload}
                bannerProps={{
                    slot: rmnLeaderboardBannerPayload?.slot || `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[PAGE_TYPES.SEARCH]}`,
                    section: SECTIONS.MAIN,
                    type: TYPES.SUPER_LEADERBOARD.NAME,
                    position: POSITIONS.TOP,
                    source: PAGE_TYPES.SEARCH,
                    clickEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.search,
                        type: anaConsts.EVENTS_TYPES_NAME.CLICK
                    }),
                    viewableEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.search,
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
                position={POSITIONS.BOTTOM}
                pageType={PAGE_TYPES.SEARCH}
                rmnBannerPayload={rmnBottomBannerPayload}
                fallbackBannerPayload={fallbackBannerPayload}
                bannerMobileProps={{
                    slot: rmnBottomBannerPayload?.slot || `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[PAGE_TYPES.SEARCH]}`,
                    section: SECTIONS.MAIN,
                    type: TYPES.SUPER_LEADERBOARD.NAME,
                    position: POSITIONS.BOTTOM,
                    source: PAGE_TYPES.SEARCH,
                    clickEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.search,
                        type: anaConsts.EVENTS_TYPES_NAME.CLICK
                    }),
                    viewableEventName: mountBannerEventData({
                        section: SECTIONS.MAIN,
                        targetPage: anaConsts.RMN_PAGE_NAMES.search,
                        type: anaConsts.EVENTS_TYPES_NAME.VIEW
                    })
                }}
            />
        );
    };

    renderRmnSiderailBanner = slotPrefix => {
        const { rmnSideRailBannerPayload, fallbackBannerPayload } = this.state;

        if (!Object.keys(rmnSideRailBannerPayload)?.length) {
            return null;
        }

        // Get the slot value from payload or use the default
        const slot = rmnSideRailBannerPayload?.slot || `${slotPrefix}${TYPES.WIDE_SIDESCRAPER.SLOT[PAGE_TYPES.SEARCH]}`;

        // Create the banner props object required for click tracking
        const sideBannerProps = {
            slot,
            section: SECTIONS.SIDEBAR,
            type: TYPES.WIDE_SIDESCRAPER.NAME,
            position: POSITIONS.TOP,
            source: PAGE_TYPES.SEARCH,
            clickEventName: mountBannerEventData({
                section: SECTIONS.SIDEBAR,
                targetPage: anaConsts.RMN_PAGE_NAMES.search,
                type: anaConsts.EVENTS_TYPES_NAME.CLICK
            }),
            viewableEventName: mountBannerEventData({
                section: SECTIONS.SIDEBAR,
                targetPage: anaConsts.RMN_PAGE_NAMES.search,
                type: anaConsts.EVENTS_TYPES_NAME.VIEW
            })
        };

        return (
            <RmnSiderailBanner
                pageType={PAGE_TYPES.SEARCH}
                rmnBannerPayload={rmnSideRailBannerPayload}
                bannerProps={sideBannerProps}
                fallbackBannerPayload={fallbackBannerPayload}
            />
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const {
            catalog,
            isSearchPage,
            showMidPageBanner,
            queryParams,
            showDynamicStickyFilter,
            setFilterBarVisibility,
            filterBarHidden,
            showNthCategoryChicletsInFilter
        } = this.props;

        if (!catalog || (catalog && Object.keys(catalog).length === 0)) {
            return this.renderSkeletonList();
        }

        if (catalog.errorCode) {
            return <NullSearch catalog={catalog} />;
        }

        const slotPrefix = localeUtils.isUS() ? '25' : '26';

        const { keyword, contextId, categories } = catalog;

        const resultsKeyword = catalog.keyword ? keyword : queryParams?.keyword[0];

        const {
            selectedFilters = {}, appliedFilters = {}, refinements, sidebarTitle, rmnMidPageBannerPayload, fallbackBannerPayload
        } = this.state;

        const tilesGridResultCount = (catalog?.products?.length || 0) + (catalog?.content?.marketingTiles?.length || 0);

        const matchProducts = catalog && catalog.products ? catalog.products.map(product => product?.productId || '').slice(0, 10) : [];

        // eslint-disable-next-line camelcase
        const targetsForSideRail = { match_products: matchProducts };

        const isSalePage = Location.isSalePage();

        return (
            <section ref={this.layoutWrapRef}>
                <CatalogLayout
                    showDynamicStickyFilter={showDynamicStickyFilter}
                    filterBarHidden={filterBarHidden}
                    currentPage={this.getCurrentPageFromCatalog(catalog)}
                    isSearch={true}
                    content={{
                        top: (
                            <BreadCrumbs
                                categories={categories}
                                contextId={contextId}
                                keyword={resultsKeyword}
                                pageType='search'
                            />
                        ),
                        sidebar: (
                            <CatalogLayout.SideBar>
                                <Text
                                    is='h1'
                                    fontSize={['lg', 'xl']}
                                    lineHeight='tight'
                                    marginBottom={[null, null, '1em']}
                                    fontWeight='bold'
                                    css={{ order: -1 }}
                                    children={getText(sidebarTitle)}
                                />

                                {categories && categories.length > 0 && (!showNthCategoryChicletsInFilter || isSalePage) && (
                                    <SearchCategories categories={categories} />
                                )}
                                <Filters
                                    pageId={keyword}
                                    contextId={contextId}
                                    selectedFilters={selectedFilters}
                                    appliedFilters={appliedFilters}
                                    refinements={refinements}
                                    selectFilters={this.selectFilters}
                                    discardSelection={this.discardSelection}
                                    clearFiltersSelection={this.clearFiltersSelection}
                                    applySelectedFilters={this.applySelectedFilters}
                                    removeFilterValue={this.removeFilterValue}
                                    showDynamicStickyFilter={showDynamicStickyFilter}
                                    setFilterBarVisibility={setFilterBarVisibility}
                                    filterBarHidden={filterBarHidden}
                                    categories={categories}
                                    showCompactPills
                                    {...(showDynamicStickyFilter && { shouldStickySideBar: true })}
                                />
                                {isSearchPage &&
                                    !isSmallView() &&
                                    (isRmnCombinedCallFeatureEnabled() ? (
                                        this.renderRmnSiderailBanner(slotPrefix)
                                    ) : (
                                        <LazyLoad
                                            component={RmnSideBanner}
                                            pageType={PAGE_TYPES.SEARCH}
                                            targets={targetsForSideRail}
                                        />
                                    ))}
                            </CatalogLayout.SideBar>
                        ),
                        main: (
                            <>
                                {isSearchPage &&
                                    (isRmnCombinedCallFeatureEnabled() ? (
                                        this.renderRmnLeaderboardBanner(slotPrefix)
                                    ) : (
                                        <LazyLoad
                                            component={RmnMainBanner}
                                            pageType={PAGE_TYPES.SEARCH}
                                            position={POSITIONS.TOP}
                                        />
                                    ))}
                                <ProductGrid
                                    isSearch={true}
                                    pageType={sidebarTitle}
                                    layoutWrapRef={this.layoutWrapRef}
                                    selectedFilters={selectedFilters}
                                    appliedFilters={appliedFilters}
                                    refinements={refinements}
                                    selectFilters={this.selectFilters}
                                    removeFilterValue={this.removeFilterValue}
                                    clearAllFilters={this.clearFiltersSelection}
                                    contextId={contextId}
                                    showMidPageBanner={showMidPageBanner}
                                    // To handle the display of the bottom banner when less than 12 results are received.
                                    source={'search'}
                                    setResultsCount={this.setProductGridResultCount}
                                    rmnBannerPayload={rmnMidPageBannerPayload}
                                    fallbackBannerPayload={fallbackBannerPayload}
                                    midPageBannerProps={{
                                        slot:
                                            rmnMidPageBannerPayload?.slot ||
                                            `${slotPrefix}${TYPES.SUPER_LEADERBOARD.SLOT[RMN_BANNER_TYPES_CONSTANTS.PAGE_TYPES.CATEGORY]}`,
                                        section: SECTIONS.MAIN,
                                        type: TYPES.SUPER_LEADERBOARD.NAME,
                                        position: POSITIONS.MID,
                                        source: RMN_BANNER_TYPES_CONSTANTS.PAGE_TYPES.SEARCH,
                                        clickEventName: mountBannerEventData({
                                            section: SECTIONS.MAIN,
                                            targetPage: anaConsts.RMN_PAGE_NAMES.search,
                                            type: anaConsts.EVENTS_TYPES_NAME.CLICK
                                        }),
                                        viewableEventName: mountBannerEventData({
                                            section: SECTIONS.MAIN,
                                            targetPage: anaConsts.RMN_PAGE_NAMES.search,
                                            type: anaConsts.EVENTS_TYPES_NAME.VIEW
                                        })
                                    }}
                                />
                                {isSearchPage &&
                                    tilesGridResultCount > 12 &&
                                    (isRmnCombinedCallFeatureEnabled() ? (
                                        this.renderRmnBottomBanner(slotPrefix)
                                    ) : (
                                        <LazyLoad
                                            component={RmnMainBanner}
                                            pageType={PAGE_TYPES.SEARCH}
                                            position={POSITIONS.BOTTOM}
                                        />
                                    ))}
                            </>
                        )
                    }}
                />
            </section>
        );
    }
}

Search.propTypes = {
    onStoreChangedFromHeader: PropTypes.func,
    onZipCodeChangedFromHeader: PropTypes.func,
    refreshSearchResults: PropTypes.func
};

Search.defaultProps = {
    onStoreChangedFromHeader: () => {},
    onZipCodeChangedFromHeader: () => {},
    refreshSearchResults: () => {},
    showDynamicStickyFilter: false
};

export default wrapComponent(Search, 'Search', true);
