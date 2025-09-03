/* eslint-disable complexity */

import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import BaseClass from 'components/BaseClass';

import { mediaQueries, screenReaderOnlyStyle } from 'style/config';
import {
    Box, Flex, Image, Text, Divider
} from 'components/ui';
import BreadCrumbs from 'components/Catalog/BreadCrumbs';
import CatalogLayout from 'components/Catalog/CatalogLayout';
import RegularFilters from 'components/Catalog/Filters';
import { withUpperFunnelProps } from 'viewModel/catalog/upperFunnel/withUpperFunnelProps';
import Categories from 'components/Catalog/Categories';
import RegularProductGrid from 'components/Catalog/ProductGrid';
import SeoText from 'components/Catalog/SeoText';
import SoftLinks from 'components/Catalog/SoftLinks';
import RelatedContent from 'components/RelatedContent';
import Copy from 'components/Content/Copy';
import ChanelBottomBanner from 'components/ChanelBottomBanner';
import MediaUtils from 'utils/Media';
import { PAGE_TYPES } from 'utils/CatalogConstants';
import PixleeUtils from 'utils/pixlee';
import LazyLoad from 'components/LazyLoad';
import localeUtils from 'utils/LanguageLocale';
import catalogUtils from 'utils/Catalog';
import CatalogPageBindings from 'analytics/bindingMethods/pages/catalog/catalogPageBindings';
import PixleeContainer from 'components/Catalog/PixleeContainer/PixleeContainer';
import { PostLoad } from 'constants/events';
import contentConstants from 'constants/content';

const Filters = withUpperFunnelProps(RegularFilters);
const ProductGrid = withUpperFunnelProps(RegularProductGrid);
const BRAND_ID_CHANEL = '1065';

const { FILTERS_SIDEBAR_WIDTH } = contentConstants;
const { wrapComponent } = FrameworkUtils;
const { loadPixlee } = PixleeUtils;
const { Media } = MediaUtils;

class NthBrandsPage extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            prevContextId: null,
            selectedFilters: {},
            appliedFilters: {},
            showUpdateDefaultSort: props.showUpdateDefaultSort
        };

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

        const currentCategory = catalogUtils.getCategoryInfoFromCategories(catalog.categories, {
            parameter: 'targetUrl',
            value: catalog.seoCanonicalUrl
        });
        const pageId = currentCategory?.nodeValue || currentCategory?.nodeStr || catalog.seoCanonicalUrl;

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

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribeZipCode();
        window.removeEventListener(PostLoad, this.initPixlee);
    }

    componentDidMount() {
        const { catalog, onStoreChangedFromHeader, onZipCodeChangedFromHeader } = this.props;

        const { categoryFilters } = this.state;

        if (catalog?.categories) {
            CatalogPageBindings.setPageLoadAnalytics(catalog, categoryFilters); // hardload analytics
        }

        this.props.dispatchMarketingParams();
        this.unsubscribe = onStoreChangedFromHeader();
        this.unsubscribeZipCode = onZipCodeChangedFromHeader();

        if (this.isPixleeEnabled()) {
            window.addEventListener(PostLoad, this.initPixlee);
        }
    }

    componentDidUpdate(prevProps) {
        const { isStoreIdAndZipCodeReady, validateUpperFunnelParams, getFulfillmentOptions } = this.props;

        if (!prevProps.isStoreIdAndZipCodeReady && isStoreIdAndZipCodeReady) {
            validateUpperFunnelParams(getFulfillmentOptions);
        }

        if (Sephora.Util?.InflatorComps?.services?.CatalogService) {
            Sephora.Util.InflatorComps.services.CatalogService.catalogEngine = this.props.catalog?.responseSource;
        }
    }

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
                    selectedFilters: newSelectedFilters
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

    isPixleeEnabled = () => {
        const { catalog } = this.props;

        // remove `brandUGCWidget` after successful contentful A/B test - ECOM-1601
        return Sephora.configurationSettings.enableUGCWidget && (catalog.content?.ugcWidget?.widgetId || catalog.brandUGCWidget);
    };

    initPixlee = () => {
        loadPixlee();
    };

    getPixleeWidgetId = () => {
        if (this.isPixleeEnabled() && !this.props.isAnonymous) {
            const { catalog } = this.props;
            // remove `locale` + `brandUGCWidget` after successful contentful A/B test - ECOM-1602
            const locale = `${localeUtils.getCurrentCountry().toLowerCase()}-${localeUtils.getCurrentLanguage().toLowerCase()}`;

            return catalog.content?.ugcWidget?.widgetId || catalog.brandUGCWidget?.[locale];
        } else {
            return null;
        }
    };

    render() {
        const {
            catalog, showDynamicStickyFilter, setFilterBarVisibility, filterBarHidden, showNthCategoryChicletsInFilter
        } = this.props;
        const {
            categories,
            brandId,
            contextId,
            linkEquityBlock = {},
            quickFilter,
            pageType,
            displayName,
            targetUrl,
            seoCanonicalUrl,
            schemas,
            content
        } = catalog;
        const { selectedFilters, appliedFilters, refinements } = this.state;

        const seoContent = catalog.seoMetaContent || catalog.seoContent || [];
        const hasSeoContent = seoContent.length > 0 || catalog?.seoText;
        const currentCategory = catalogUtils.getCategoryInfoFromCategories(categories, {
            parameter: 'targetUrl',
            value: seoCanonicalUrl
        });
        const pageId = currentCategory?.nodeValue || currentCategory?.nodeStr || seoCanonicalUrl;

        const categoriesProps = {
            pageType,
            categories,
            categoryId: currentCategory?.nodeValue || currentCategory?.nodeStr
        };

        const filters = (
            <Filters
                pageId={pageId}
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
                targetShadowScrollY={235}
                showDynamicStickyFilter={showDynamicStickyFilter}
                setFilterBarVisibility={setFilterBarVisibility}
                filterBarHidden={filterBarHidden}
                categoriesProps={categoriesProps}
                showCompactPills
            />
        );

        const showBreadcrumb = pageType !== PAGE_TYPES.TOP_CATEGORY;

        const breadcrumbProps = {
            categories,
            categoryId: currentCategory?.nodeValue || currentCategory?.nodeStr,
            pageType: 'brand',
            brand: {
                displayName,
                targetUrl
            }
        };

        const isChanel = brandId === BRAND_ID_CHANEL;
        const pixleeWidgetId = this.getPixleeWidgetId();

        return (
            <div ref={this.layoutWrapRef}>
                <CatalogLayout
                    showDynamicStickyFilter={showDynamicStickyFilter}
                    filterBarHidden={filterBarHidden}
                    content={{
                        top: showBreadcrumb && <BreadCrumbs {...breadcrumbProps} />,
                        sidebar: (
                            <CatalogLayout.SideBar shouldStickySideBar>
                                <Text
                                    is='div'
                                    fontSize={['lg', 'xl']}
                                    lineHeight='tight'
                                    marginBottom={[null, null, '1em']}
                                    fontWeight='bold'
                                    css={[{ order: -1 }, isChanel && { [mediaQueries.smMax]: screenReaderOnlyStyle }]}
                                    children={catalog.displayName}
                                />
                                {pageType === PAGE_TYPES.NTH_CATEGORY_PAGE ? (
                                    <>
                                        {filters}
                                        <Media greaterThan='sm'>
                                            <Categories
                                                {...categoriesProps}
                                                showHeading={true}
                                            />
                                        </Media>
                                    </>
                                ) : (
                                    <>
                                        {!showNthCategoryChicletsInFilter && <Categories {...categoriesProps} />}
                                        {filters}
                                    </>
                                )}
                            </CatalogLayout.SideBar>
                        ),
                        main: (
                            <>
                                {isChanel && (
                                    <Flex
                                        alignItems='center'
                                        marginX={['-container', 0]}
                                        paddingX={['container', 5]}
                                        marginBottom={[null, 3]}
                                        borderTop={'6px solid black'}
                                        justifyContent='center'
                                        height={[42, 82]}
                                        order={[-1, 0]}
                                    >
                                        <Image
                                            display='block'
                                            disableLazyLoad={true}
                                            src='/img/ufe/logo-chanel.svg'
                                            width={[74, 127]}
                                            height={[12, 20]}
                                        />
                                    </Flex>
                                )}
                                <ProductGrid
                                    h1={catalog.seoTitle ? catalog.seoTitle.replace(' | Sephora', '') : catalog.displayName}
                                    isBrand={true}
                                    source={'brand'}
                                    layoutWrapRef={this.layoutWrapRef}
                                    selectedFilters={selectedFilters}
                                    appliedFilters={appliedFilters}
                                    refinements={refinements}
                                    selectFilters={this.selectFilters}
                                    removeFilterValue={this.removeFilterValue}
                                    clearAllFilters={this.clearFiltersSelection}
                                    increaseImageSizeGrid={true}
                                />
                                {isChanel && <ChanelBottomBanner marginTop={[null, 5]} />}
                            </>
                        ),
                        bottom: (
                            <>
                                <SoftLinks
                                    isBottom={true}
                                    links={content?.softLinks || quickFilter}
                                />
                                {showBreadcrumb && (
                                    <BreadCrumbs
                                        {...breadcrumbProps}
                                        isBottom={true}
                                    />
                                )}
                                {pixleeWidgetId && (
                                    <LazyLoad
                                        component={PixleeContainer}
                                        categoryId={brandId}
                                        widgetId={pixleeWidgetId}
                                        containerId='PixleeContainer'
                                    />
                                )}
                                <Categories
                                    {...categoriesProps}
                                    title={catalog.displayName}
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
                                            contextId={pageId}
                                            content={seoContent}
                                            text={catalog?.seoText}
                                        />
                                    </Box>
                                )}
                                <RelatedContent
                                    hasDivider={hasSeoContent || content?.copy?.length > 0 || categoriesProps?.categories?.length > 0}
                                    links={linkEquityBlock.links}
                                />
                            </>
                        )
                    }}
                    currentPage={this.getCurrentPageFromCatalog(catalog)}
                    isBrand={true}
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

NthBrandsPage.propTypes = {
    getFulfillmentOptions: PropTypes.func,
    onStoreChangedFromHeader: PropTypes.func,
    onZipCodeChangedFromHeader: PropTypes.func
};

NthBrandsPage.defaultProps = {
    getFulfillmentOptions: () => {},
    onStoreChangedFromHeader: () => {},
    onZipCodeChangedFromHeader: () => {},
    showDynamicStickyFilter: false
};

export default wrapComponent(NthBrandsPage, 'NthBrandsPage', true);
