/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import ProductGrid from 'components/Catalog/ProductGrid/ProductGrid';
import getStyles from 'components/Catalog/ProductGrid/styles';
import ProductTile from 'components/Catalog/ProductGrid/ProductTile';
import LazyLoad from 'components/LazyLoad';
import localUtils from 'utils/LanguageLocale';
import {
    Box, Flex, Text, Button, Grid, Container
} from 'components/ui';
import { CSF_PAGE_TYPES } from 'constants/actionTypes/creatorStoreFront';
import { createVisibilityTracker, trackProductView, trackProductClick } from 'components/CreatorStoreFront/helpers/csfEventHelpers';
import { updateAttributionForDetailsPage, updateAttributionWithProductId } from 'components/CreatorStoreFront/helpers/csfAttribution';

const { getLocaleResourceFile } = localUtils;
const getText = getLocaleResourceFile('components/CreatorStoreFront/CSFProductGrid/locales', 'CSFProductGrid');

const SERVER_RENDER_LIMIT = 60;

class CSFProductGrid extends ProductGrid {
    constructor(props) {
        super(props);

        this.state = {
            pageNum: 1,
            isLoading: false
        };

        this.observerRef = React.createRef();
    }

    fetchMoreProducts = async pageNum => {
        const { handle, pageType, collectionId } = this.props;

        const args = pageType === CSF_PAGE_TYPES.COLLECTION ? [collectionId, handle, pageNum] : [handle, pageNum];

        this.setState({ isLoading: true });

        try {
            await this.props.fetchProductData(...args);

            this.setState({ pageNum });
        } catch (error) {
            Sephora.logger.error(`Error during fetching ${pageType} page ${pageNum}:`, error);
        } finally {
            this.setState({ isLoading: false });
        }
    };

    handleLoadMore = () => {
        const nextPage = this.state.pageNum + 1;

        this.fetchMoreProducts(nextPage);
    };

    // Helper function to render a product item (either product or tile)
    renderProducts = () => {
        const {
            products, increaseImageSizeGrid, source, textResources, creatorProfileData, pageType
        } = this.props;
        const addToBasketText = textResources?.addToBasket || getText('addToBasket');
        const styles = getStyles(increaseImageSizeGrid);
        const creatorProfile = creatorProfileData?.creatorProfile;
        const referralOwnerId = creatorProfile?.creatorId;

        return products.map((product, index) => {
            const isLazyLoaded = index >= SERVER_RENDER_LIMIT;
            const Component = isLazyLoaded ? LazyLoad : ProductTile;
            const itemId = product?.productId || index;
            const motomProductId = product?.motomProductId;

            const trackCSFProductClick = () => {
                trackProductClick({
                    referralOwnerId,
                    productId: itemId,
                    targetUrl: product?.targetUrl,
                    motomProductId
                });
            };

            const updateAttributionData = () => {
                const isCollectionDetailsView = pageType === CSF_PAGE_TYPES.COLLECTION;

                if (isCollectionDetailsView) {
                    updateAttributionForDetailsPage(creatorProfile, motomProductId);
                } else {
                    updateAttributionWithProductId(motomProductId);
                }
            };

            return (
                <div
                    key={`csfProductGridItem_${itemId}`}
                    css={[styles.item, isLazyLoaded && styles.itemLazy]}
                    style={{ order: index }}
                    data-tracking-id={itemId}
                    data-motom-tracking-id={motomProductId}
                >
                    <Component
                        {...(isLazyLoaded && {
                            isLazyLoaded: true,
                            component: ProductTile
                        })}
                        source={source}
                        product={product}
                        isSkeleton={!product}
                        flagViewableImpression={this.flagViewableImpression}
                        index={index}
                        increaseImageSizeGrid={increaseImageSizeGrid}
                        displayAddToBasketCta={true}
                        showVariationValue={true}
                        customMarginTop={1}
                        addToBasket={addToBasketText}
                        customStyle={{ width: 110 }}
                        trackCSFProductClick={trackCSFProductClick}
                        updateAttributionData={updateAttributionData}
                    />
                </div>
            );
        });
    };

    setProductTilesVisibilityTracking = () => {
        const { isLoading } = this.state;
        const { products, creatorProfileData, postId, collectionId } = this.props;
        const referralOwnerId = creatorProfileData?.creatorProfile?.creatorId;

        // Add visibility tracking for products
        if (!isLoading && products.length > 0) {
            // Clean up previous observer
            if (this.observerRef.current) {
                this.observerRef.current.disconnect();
            }

            // Setup new intersection observer for product tracking
            this.observerRef.current = createVisibilityTracker({
                onVisible: (productId, element) => {
                    const motomProductId = element?.getAttribute('data-motom-tracking-id');

                    trackProductView({
                        referralOwnerId,
                        productId,
                        postId,
                        collectionId,
                        motomProductId
                    });
                },
                threshold: 0.5, // This is per jira spec
                trackOnce: false // Allow re-tracking for product views - needed for csf product tile click sot event
            });

            // Small delay to ensure DOM is updated after render
            setTimeout(() => {
                const tiles = document.querySelectorAll('[data-tracking-id]');
                tiles.forEach(tile => {
                    const productId = tile.getAttribute('data-tracking-id');

                    if (productId) {
                        // Set data-tracking-id for the visibility tracker
                        tile.setAttribute('data-tracking-id', productId);
                        this.observerRef.current.observe(tile);
                    }
                });
            }, 100);
        }
    };

    componentDidMount() {
        this.setProductTilesVisibilityTracking();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.products.length !== this.props.products.length) {
            this.setProductTilesVisibilityTracking();
        }
    }

    componentWillUnmount() {
        if (this.observerRef.current) {
            this.observerRef.current.disconnect();
        }
    }

    render() {
        const {
            increaseImageSizeGrid, textResources, pageType, products, totalProductCount
        } = this.props;

        const { isLoading } = this.state;

        const count = products?.length;
        const styles = getStyles(increaseImageSizeGrid);

        const totalLoadedProducts = `${count} ${getText('of')} ${totalProductCount} ${getText(totalProductCount === 1 ? 'product' : 'products')}`;
        const totalItems = `${totalProductCount} ${getText(totalProductCount === 1 ? 'item' : 'items')}`;

        // Determine if we're inside a collection details view
        const isCollectionDetailsView = pageType === CSF_PAGE_TYPES.COLLECTION;

        const isShowMoreCentered = products?.length % 4 === 0;
        const isShowMoreItemsTile = count < totalProductCount;

        return (
            <Container ref={this.rootRef}>
                {/* Only show heading and grid if not in collection details view */}
                {!isCollectionDetailsView && (
                    <>
                        <Text
                            is={'h2'}
                            fontSize={['md', null, 'lg']}
                            fontWeight={'bold'}
                            lineHeight={['20px', null, '22px']}
                            marginBottom={[1, null, 2]}
                            children={textResources.allProducts}
                        />
                        <Grid
                            gap={[2, null, 3]}
                            marginBottom={[3, null, 5]}
                        >
                            {this.renderResultsText({
                                resultsText: totalItems
                            })}
                        </Grid>
                    </>
                )}
                {count > 0 ? (
                    <div css={styles.root}>
                        {this.renderProducts()}

                        {/* show more items tile */}
                        {isShowMoreItemsTile && (
                            <Flex
                                flexDirection={'column'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                gap={'10px'}
                                width={['100%', null, 240]}
                                paddingY={[5, null, 7]}
                                flex={['none', null, isShowMoreCentered ? 'auto' : 'none']}
                                order={9999}
                            >
                                <Text
                                    is='p'
                                    color='gray'
                                    lineHeight='tight'
                                    fontSize={['sm', 'base']}
                                    children={totalLoadedProducts}
                                />
                                <Button
                                    disabled={isLoading}
                                    variant='secondary'
                                    width={200}
                                    onClick={this.handleLoadMore}
                                    children={getText('showMoreProducts')}
                                />
                            </Flex>
                        )}
                    </div>
                ) : (
                    <Box lineHeight='tight'>
                        <Text
                            is='h2'
                            fontWeight='bold'
                            fontSize={['md', 'lg']}
                            marginBottom='.25em'
                            children={getText('noResults1')}
                        />
                        <Text
                            is='p'
                            fontSize={[null, 'md']}
                            css={{ whiteSpace: 'normal' }}
                            children={getText('noResults2')}
                        />
                    </Box>
                )}
            </Container>
        );
    }
}

export default wrapComponent(CSFProductGrid, 'CSFProductGrid', true);
