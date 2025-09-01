import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import ProductTile from 'components/Catalog/ProductGrid/ProductTile';
import MarketingTile from 'components/Catalog/ProductGrid/MarketingTile';
import LazyLoad from 'components/LazyLoad';
import {
    Flex, Grid, Box, Text, Button
} from 'components/ui';
import getStyles from 'components/Catalog/ProductGrid/styles';
import localUtils from 'utils/LanguageLocale';
import { mediaQueries } from 'style/config';

import userUtils from 'utils/User';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import ProductSort from 'components/Catalog/ProductSort';
import FilterChiclets from 'components/Catalog/Filters/FilterChiclets';
import mediaUtils from 'utils/Media';
import UI from 'utils/UI';
import VisuallyHidden from 'components/VisuallyHidden';
import { RmnMainBanner } from 'components/Rmn/RmnBanner';
const { getLocaleResourceFile, isFrench } = localUtils;
const { Media } = mediaUtils;
const getText = getLocaleResourceFile('components/Catalog/locales', 'Catalog');
const getTextNoResults = getLocaleResourceFile('components/Catalog/ProductGrid/NoResults/locales', 'NoResults');
import { REFINEMENT_TYPES, REFINEMENT_STATES } from 'utils/CatalogConstants';
import catalogUtils from 'utils/Catalog';
import cookieUtils from 'utils/Cookies';
import { SKIN_ANALYSIS_TOOL } from 'constants/arSkincare';
import ProductListPage from 'ai/components/EntryPoint/ProductListPage';
import isRmnCombinedCallFeatureEnabled from 'components/Rmn/utils';
import RmnMidPageBanner from 'components/Rmn/RmnMidPageBanner';
import rmnAndPla from 'utils/rmnAndPla';

const SERVER_RENDER_LIMIT = 6;
const GRID_TYPES = {
    MID_PAGE_BANNER: 'midPageBanner',
    MARKETING_TILE: 'marketingTile',
    PRODUCT_TILE: 'productTile',
    AI_PRODUCT_CHAT: 'aiProductChat'
};
const MID_BANNER_DEFAULT_POSITION = 12;
const MID_BANNER_LGUI_WITH_AI_CHAT = 11;
const MID_BANNER_SMUI_WITH_AI_CHAT = 14;
const AI_PRODUCT_CHAT_POSITION = 10;

// The default slots for the Content Grid Tiles should be as follows:
// P8, P17, P36, P49, P59
// https://jira.sephora.com/browse/SMC-2093
const DEFAULT_MARKETING_TILE_SLOTS = [8, 17, 36, 49, 59];

function getSelectedRefinements(refinements) {
    const checkedIds = [];
    const implicitIds = [];

    const { CHECKED, IMPLICIT } = REFINEMENT_STATES;

    if (refinements?.length) {
        refinements.forEach(ref => {
            const isCheckbox = ref.type === 'checkboxes' || ref.type === 'colors' || ref.type === 'multiple' || ref.type === 'checkboxesWithDropDown';
            const hasValues = ref.values && ref.values.length;

            if (isCheckbox && hasValues) {
                ref.values.forEach(value => {
                    const isChecked = value.refinementValueStatus === CHECKED;
                    const isImplicit = value.refinementValueStatus === IMPLICIT;
                    const refinementGroup = isChecked ? checkedIds : isImplicit ? implicitIds : null;

                    if (refinementGroup) {
                        refinementGroup.push(value.refinementValue);
                    }
                });
            }
        });
    }

    return {
        checkedIds,
        implicitIds
    };
}

export const MarketingTileComponent = React.memo(props => {
    const {
        tile, index, count, increaseImageSizeGrid, increaseServerRenderedMarketingTiles
    } = props;
    const tileStyles = getStyles(increaseImageSizeGrid);
    const order = index;
    const isIllinoisUser = cookieUtils.read(cookieUtils.KEYS.ILLINOIS_YES) === 'true';
    const isSkinAnalysisTool = tile?.action?.page?.slug === SKIN_ANALYSIS_TOOL;

    if (isIllinoisUser && isSkinAnalysisTool) {
        return null;
    }

    // The order is used to determine the position of the tile in the grid.
    if (order === undefined || isNaN(order)) {
        return null;
    }

    const isLazyLoaded = order >= SERVER_RENDER_LIMIT && count > SERVER_RENDER_LIMIT;

    if (!isLazyLoaded) {
        increaseServerRenderedMarketingTiles();
    }

    const Component = isLazyLoaded ? LazyLoad : MarketingTile;

    // Analytics Data.
    tile['slot'] = order;
    tile['isLazyLoaded'] = isLazyLoaded;

    const orderStyle = !isNaN(order) ? order : undefined;

    return (
        <div
            key={`marketingTile_${tile.name || tile.sid}`}
            css={[tileStyles.item, isLazyLoaded && tileStyles.itemLazy]}
            style={{ order: orderStyle, alignSelf: 'flex-start' }}
        >
            <Component
                {...(isLazyLoaded && {
                    isLazyLoaded: true,
                    component: MarketingTile
                })}
                content={tile}
            />
        </div>
    );
});

const BannerWrapper = React.memo(props => {
    const { position, children, increaseImageSizeGrid, styles: bannerStyles } = props;
    const styles = getStyles(increaseImageSizeGrid);

    const override = {
        order: position,
        height: 'auto',
        minHeight: 'auto',
        width: '100%'
    };

    return (
        <div
            key={`banner_${position}`}
            css={[styles.banner, bannerStyles]}
            style={override}
        >
            {children}
        </div>
    );
});

export const BannerComponent = React.memo(props => {
    const {
        showMidPageBanner, source, increaseImageSizeGrid, position, styles, rmnBannerPayload, fallbackBannerPayload, midPageBannerProps
    } = props;

    // Kill switch for mid page banner
    const hiddenMidPageBanner = !Sephora?.configurationSettings?.enableMidPageBanner;

    if (hiddenMidPageBanner || !showMidPageBanner) {
        return null;
    }

    const isLazyLoaded = position >= SERVER_RENDER_LIMIT && props.count > SERVER_RENDER_LIMIT;

    if (!isLazyLoaded) {
        props.increaseServerRenderedMarketingTiles();
    }

    if (isRmnCombinedCallFeatureEnabled()) {
        if (!Object.keys(rmnBannerPayload)?.length) {
            return null;
        }

        return (
            <BannerWrapper
                position={position}
                increaseImageSizeGrid={increaseImageSizeGrid}
                styles={styles}
            >
                <RmnMidPageBanner
                    position={position}
                    pageType={source}
                    rmnBannerPayload={rmnBannerPayload}
                    fallbackBannerPayload={fallbackBannerPayload}
                    bannerProps={midPageBannerProps}
                />
            </BannerWrapper>
        );
    }

    const Component = isLazyLoaded ? LazyLoad : RmnMainBanner;

    return (
        <BannerWrapper
            position={position}
            increaseImageSizeGrid={increaseImageSizeGrid}
            styles={styles}
        >
            <Component
                {...(isLazyLoaded && {
                    isLazyLoaded: true,
                    component: RmnMainBanner
                })}
                position='mid'
                hasFallback={false}
                pageType={source}
            />
        </BannerWrapper>
    );
});

class ProductGrid extends BaseClass {
    state = {
        isLoading: false,
        prevContextId: null,
        apiCalled: false
    };

    static getDerivedStateFromProps({ contextId }, state) {
        if (contextId === state.prevContextId) {
            return null;
        }

        return {
            prevContextId: contextId
        };
    }

    serverRenderedMarketingTiles = 0;

    rootRef = React.createRef();

    componentDidMount() {
        const { showPurchasedFlagOnGridPages, products } = this.props;

        if (showPurchasedFlagOnGridPages?.challengerOne || showPurchasedFlagOnGridPages?.challengerTwo) {
            const userId = userUtils.getProfileId();

            if (userId && !this.state.apiCalled) {
                this.loadPurchaseHistory();
                this.setState({ apiCalled: true });
            }
        }

        if (this.props.currentPage > 1) {
            UI.scrollToTop();
        }

        digitalData.page.pageInfo.eventPageName = this.props.pageName;

        // Fires the On Load Tracking Event for the PLAs
        rmnAndPla.firePlaOnLoadEvent((products || []).filter(p => p.sponsored));
    }

    componentDidUpdate(prevProps) {
        const { showPurchasedFlagOnGridPages, categoryName, products } = this.props;

        if (prevProps.products !== this.props.products) {
            this.setState({
                isLoading: false
            });

            const { setResultsCount } = this.props;

            if (setResultsCount) {
                setResultsCount(this.props?.products?.length || 0);
            }

            if (prevProps.currentPage - 1 === this.props.currentPage && window.scrollY > this.rootRef.current.offsetTop) {
                this.props.layoutWrapRef?.current?.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                });
            }

            if (digitalData.page.pageInfo.eventPageName !== this.props.pageName) {
                digitalData.page.pageInfo.eventPageName = this.props.pageName;
            }

            if (categoryName !== prevProps.categoryName) {
                // Fires the On Load Tracking Event for the PLAs
                rmnAndPla.firePlaOnLoadEvent((products || []).filter(p => p.sponsored));
            }
        }

        if (showPurchasedFlagOnGridPages?.challengerOne || showPurchasedFlagOnGridPages?.challengerTwo) {
            if (!prevProps.apiCalled && userUtils.getProfileId() && !this.state.apiCalled) {
                this.loadPurchaseHistory();
                this.setState({ apiCalled: true });
            }
        }
    }

    loadPurchaseHistory() {
        const { fetchCompletePurchaseHistory } = this.props;
        const userId = userUtils?.getProfileId();

        if (userId) {
            fetchCompletePurchaseHistory({
                userId
            });
        }

        this.setState({ userId });
    }

    handleLoadMore = () => {
        this.setState({ isLoading: true }, () => {
            this.props.setPageNumber(this.props.currentPage + 1);
        });

        // Analytics - EXP-1358
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'D=c55',
                actionInfo: anaConsts.LinkData.SHOW_MORE_PRODUCTS,
                eventStrings: [anaConsts.Event.EVENT_71]
            }
        });
    };

    renderResultsText = ({ resultsText, searchQuery, pageType }) => {
        return (
            <Text
                is='p'
                lineHeight='tight'
                color='gray'
                fontSize={['sm', 'base']}
                data-at={Sephora.debug.dataAt('number_of_products')}
            >
                {resultsText}
                {pageType === 'searchResults' && searchQuery && (
                    <>
                        {` ${getText('resultsFor')} `}
                        <Text
                            is='span'
                            color='black'
                            fontWeight='bold'
                            children={isFrench() ? `« ${searchQuery} »` : `“${searchQuery}”`}
                        />
                    </>
                )}
            </Text>
        );
    };

    getErrorMessages = (searchWarningMessages, refinements, checkedRefinements, count) => {
        let errorMessage1 = (searchWarningMessages && searchWarningMessages[0].messages[0].split('.')[0]) || '';
        let errorMessage2 = (searchWarningMessages && searchWarningMessages[0].messages[0].split('.')[1]) || '';

        if (count === 0) {
            const isSDDEnabled = Sephora.configurationSettings.isSameDayShippingEnabled;
            const sameDayDelivery = checkedRefinements.find(item => item.indexOf('filters[SameDay]') !== -1);
            const isSDDOnly = count === 0 && sameDayDelivery && checkedRefinements.length === 1;

            if (isSDDOnly && !isSDDEnabled) {
                errorMessage1 = getTextNoResults('SDDUnavailable');
                errorMessage2 = getTextNoResults('SDDUnavailable2');
            } else {
                let zipCode = '';

                if (isSDDOnly) {
                    zipCode = sameDayDelivery.split('=')[1];
                }

                errorMessage1 = isSDDOnly
                    ? getTextNoResults('noSDDResult', [zipCode])
                    : errorMessage1
                        ? errorMessage1 + '.'
                        : getTextNoResults('noResults1');
                errorMessage2 = isSDDOnly ? getTextNoResults('noSDDResult2') : errorMessage2 ? errorMessage2 + '.' : getTextNoResults('noResults2');
            }
        }

        return {
            errorMessage1,
            errorMessage2
        };
    };

    flagViewableImpression = product => {
        product['viewableImpressionFired'] = true;
    };

    increaseServerRenderedMarketingTiles = () => {
        this.serverRenderedMarketingTiles++;
    };

    getTilesAndMidBanner = (products = [], marketingTiles = []) => {
        const {
            isBrand, isSearch, marketingTilePositions = [], showMidPageBanner, isGenAIChatPLPEnabled
        } = this.props;
        const getMarketingTilePosition = (tile, tileIndex) => {
            const marketingTilePosition = tile?.slot ?? marketingTilePositions?.[tileIndex] ?? DEFAULT_MARKETING_TILE_SLOTS[tileIndex];

            if (marketingTilePosition !== undefined) {
                return Number(marketingTilePosition) - 1;
            }

            return tileIndex === 0 ? (isBrand ? 0 : isSearch ? 1 : 7) : tileIndex === 1 ? 15 : 33;
        };

        const prods = [...products];

        // There should not be more than 5 tiles on a category page, so a 6th tile shouldn't be shown.
        // https://jira.sephora.com/browse/SMC-2093
        const marketingTilesToRender = marketingTiles.slice(0, 5);
        const slotMap = new Map(marketingTilesToRender.map((tile, index) => [getMarketingTilePosition(tile, index), tile]));

        const result = [];
        let num = 0;

        // Kill switch for mid page banner
        const enableMidPageBanner = Sephora?.configurationSettings?.enableMidPageBanner;
        Sephora.logger.verbose('SuperChat: isGenAIChatPLPEnabled', isGenAIChatPLPEnabled);

        while (prods.length > 0 || slotMap.size > 0) {
            if (isGenAIChatPLPEnabled && num === AI_PRODUCT_CHAT_POSITION) {
                result.push({ type: GRID_TYPES.AI_PRODUCT_CHAT, position: AI_PRODUCT_CHAT_POSITION });
            }

            if ((enableMidPageBanner || showMidPageBanner) && num === MID_BANNER_DEFAULT_POSITION) {
                result.push({ type: GRID_TYPES.MID_PAGE_BANNER, position: MID_BANNER_DEFAULT_POSITION });
            }

            if (slotMap.has(num)) {
                result.push({ type: GRID_TYPES.MARKETING_TILE, ...slotMap.get(num) });
                slotMap.delete(num);
            } else if (prods.length > 0) {
                result.push({ type: GRID_TYPES.PRODUCT_TILE, ...prods.shift() });
            } else {
                // Handle non-slotted marketing tiles
                const firstKey = slotMap.keys().next().value; // Get first fallback key
                result.push({ type: GRID_TYPES.MARKETING_TILE, ...slotMap.get(firstKey) });
                slotMap.delete(firstKey);
            }

            num++;
        }

        if (isGenAIChatPLPEnabled && result.length <= AI_PRODUCT_CHAT_POSITION) {
            result.push({ type: GRID_TYPES.AI_PRODUCT_CHAT, position: result.length });
        }

        if ((enableMidPageBanner || showMidPageBanner) && result.length <= MID_BANNER_DEFAULT_POSITION) {
            result.push({ type: GRID_TYPES.MID_PAGE_BANNER, position: result.length });
        }

        return result;
    };

    render() {
        const {
            h1,
            products = [],
            appliedFilters,
            refinements,
            selectFilters,
            removeFilterValue,
            clearAllFilters,
            source,
            searchWarningMessages,
            searchQuery,
            deliveryOptions,
            pageType,
            sponsorProducts = [],
            sponsorProductsLoaded,
            showSponsorProducts = false,
            marketingTiles = [],
            resultsText,
            dontShowMoreProducts,
            currentTotalText,
            categoryName,
            parentCategoryName,
            increaseImageSizeGrid,
            showUpdateDefaultSort,
            isGenAIChatPLPEnabled,
            giftFinder
        } = this.props;
        const { isLoading } = this.state;
        const count = products.length;
        const styles = getStyles(increaseImageSizeGrid);
        const keysUsedforPickupAndDelivery = [
            'Ramassage et livraison',
            'In Store & Delivery',
            'Pickup & Delivery',
            'En magasin et pour la livraison'
        ];
        const isDeliveryFilterApplied = keysUsedforPickupAndDelivery.some(
            key => Array.isArray(appliedFilters[key]) && appliedFilters[key].length > 0
        );
        const checkedRefinements = getSelectedRefinements(refinements).checkedIds;
        const errorMessages = this.getErrorMessages(searchWarningMessages, refinements, checkedRefinements, count);
        const { productsWithSponsor } =
            (showSponsorProducts && catalogUtils.getProductsWithSponsors(products, sponsorProducts, sponsorProductsLoaded)) || {};

        const productsToMap = showSponsorProducts ? productsWithSponsor : products;
        const sortRefinement = refinements?.find(x => x.type === REFINEMENT_TYPES.SORT);
        const selectedOrDefaultOption = sortRefinement
            ? catalogUtils.getSelectedOrDefaultSortOption(sortRefinement.values, showUpdateDefaultSort)
            : null;

        const tilesAndMidBanner = this.getTilesAndMidBanner(productsToMap, marketingTiles);

        return (
            <div ref={this.rootRef}>
                {h1 && (
                    <VisuallyHidden
                        is='h1'
                        children={h1}
                        tabIndex='-1'
                    />
                )}
                <Grid
                    gap={[2, 3]}
                    marginTop={[null, 0]}
                    marginBottom={4}
                >
                    <FilterChiclets
                        showUpperFunnelChiclets
                        refinements={refinements}
                        filters={appliedFilters}
                        onRemoveChiclet={removeFilterValue}
                        onClearAllFilters={clearAllFilters}
                    />
                    <Flex
                        alignItems='baseline'
                        justifyContent='space-between'
                        order={[-1, null, 0]}
                    >
                        {this.renderResultsText({
                            resultsText,
                            searchQuery,
                            pageType
                        })}
                        {count > 0 && (
                            <Media greaterThan='sm'>
                                <ProductSort
                                    refinement={sortRefinement}
                                    selectFilters={selectFilters}
                                    selectedOrDefaultOption={selectedOrDefaultOption}
                                />
                            </Media>
                        )}
                    </Flex>
                </Grid>

                {count > 0 ? (
                    <div css={styles.root}>
                        {tilesAndMidBanner.map((product, index) => {
                            if (product?.type === GRID_TYPES.AI_PRODUCT_CHAT) {
                                return (
                                    <Box
                                        key={`productListPageTile_${this.state.prevContextId || 'default'}`}
                                        css={[styles.item, styles.productListContainer]}
                                        style={{ order: index }}
                                    >
                                        <ProductListPage
                                            products={tilesAndMidBanner}
                                            pageType={pageType}
                                            searchQuery={searchQuery}
                                            giftFinder={giftFinder}
                                        />
                                    </Box>
                                );
                            }

                            if (product?.type === GRID_TYPES.MID_PAGE_BANNER) {
                                return (
                                    <BannerComponent
                                        {...this.props}
                                        key={`midPageBanner_${product?.position || index}`}
                                        count={count}
                                        marketingTiles={marketingTiles}
                                        increaseServerRenderedMarketingTiles={this.increaseServerRenderedMarketingTiles}
                                        source={source}
                                        showMidPageBanner={this.props.showMidPageBanner}
                                        increaseImageSizeGrid={increaseImageSizeGrid}
                                        position={index || 12}
                                        styles={midBannerStyle(isGenAIChatPLPEnabled)}
                                    />
                                );
                            }

                            if (product?.type === GRID_TYPES.MARKETING_TILE) {
                                return (
                                    <MarketingTileComponent
                                        key={`marketingTile_${product?.sid || index}`}
                                        index={index}
                                        tile={product}
                                        count={count}
                                        increaseImageSizeGrid={increaseImageSizeGrid}
                                        increaseServerRenderedMarketingTiles={this.increaseServerRenderedMarketingTiles}
                                    />
                                );
                            }

                            const isLazyLoaded = index >= SERVER_RENDER_LIMIT - this.serverRenderedMarketingTiles;
                            const Component = isLazyLoaded ? LazyLoad : ProductTile;

                            return (
                                <div
                                    key={
                                        product?.sponsored
                                            ? `sponsoredProduct_${product?.productId || index}`
                                            : `productGridItem_${product?.productId || index}`
                                    }
                                    css={[styles.item, isLazyLoaded && styles.itemLazy]}
                                    style={{ order: index }}
                                >
                                    <Component
                                        {...(isLazyLoaded && {
                                            component: ProductTile
                                        })}
                                        isLazyLoaded={isLazyLoaded}
                                        source={source}
                                        deliveryOptions={deliveryOptions}
                                        checkedRefinements={checkedRefinements}
                                        contextId={this.state.prevContextId}
                                        product={product}
                                        products={products}
                                        isSkeleton={!product?.currentSku}
                                        flagViewableImpression={this.flagViewableImpression}
                                        index={index}
                                        categoryName={categoryName}
                                        parentCategoryName={parentCategoryName}
                                        increaseImageSizeGrid={increaseImageSizeGrid}
                                        isDeliveryFilterApplied={isDeliveryFilterApplied}
                                    />
                                </div>
                            );
                        })}
                        <div css={[styles.item, styles.showMore]}>
                            <Text
                                is='p'
                                color='gray'
                                lineHeight='tight'
                                fontSize={['sm', 'base']}
                                marginBottom={2}
                                children={currentTotalText}
                            />
                            {dontShowMoreProducts || (
                                <Button
                                    disabled={isLoading}
                                    variant='secondary'
                                    css={styles.showMoreButton}
                                    onClick={this.handleLoadMore}
                                    children={getText('showMoreProducts')}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <Box lineHeight='tight'>
                        <Text
                            is='h2'
                            fontWeight='bold'
                            fontSize={['md', 'lg']}
                            marginBottom='.25em'
                            data-at={Sephora.debug.dataAt('filter_error')}
                            children={errorMessages.errorMessage1}
                        />
                        <Text
                            is='p'
                            fontSize={[null, 'md']}
                            // messaging contains extraneous space before text
                            css={{ whiteSpace: 'normal' }}
                            children={errorMessages.errorMessage2}
                        />
                        <BannerComponent
                            {...this.props}
                            count={count}
                            marketingTiles={marketingTiles}
                            increaseServerRenderedMarketingTiles={this.increaseServerRenderedMarketingTiles}
                            source={source}
                            showMidPageBanner={this.props.showMidPageBanner}
                            increaseImageSizeGrid={increaseImageSizeGrid}
                            position={1}
                        />
                    </Box>
                )}
            </div>
        );
    }
}

const midBannerStyle = isGenAIChatPLPEnabled => {
    return {
        order: `${isGenAIChatPLPEnabled && MID_BANNER_LGUI_WITH_AI_CHAT} !important`,
        [mediaQueries.xsMax]: {
            order: `${isGenAIChatPLPEnabled ? MID_BANNER_SMUI_WITH_AI_CHAT : MID_BANNER_DEFAULT_POSITION} !important`
        }
    };
};

ProductGrid.defaultProps = {
    currentPage: 1,
    increaseImageSizeGrid: true
};

export default wrapComponent(ProductGrid, 'ProductGrid', true);
