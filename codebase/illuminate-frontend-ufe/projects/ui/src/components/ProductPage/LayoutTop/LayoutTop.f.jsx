import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid } from 'components/ui';
import { mediaQueries, space } from 'style/config';
import ProductMediaCarousel from 'components/ProductPage/ProductMediaCarousel/ProductMediaCarousel';
import BccRwdComponentList from 'components/Bcc/BccRwdComponentList';
import ProductBreadCrumbs from 'components/ProductPage/ProductBreadCrumbs/ProductBreadCrumbs';
import skuUtils from 'utils/Sku';
import Banner from 'components/Content/Banner';
import contentConstants from 'constants/content';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';

const { HIDDEN_CATEGORY_ID } = skuUtils;
const { BANNER_TYPES } = contentConstants;

function LayoutTop({
    sku = {},
    product,
    content = {},
    hideBreadcrumbs,
    showMiddleProductBanner,
    preventPageRenderReport,
    displayedMiddleProductBanner,
    displayedProductBanner,
    displayedBottomProductBanner,
    isPXSEnabled,
    regularProductHasMounted,
    isProductSampleEnabled = false
}) {
    const { rwdProductPageContent = {}, parentCategory } = product;
    const { regions = {} } = rwdProductPageContent;
    const isHiddenCategory = parentCategory && parentCategory.categoryId === HIDDEN_CATEGORY_ID;

    // Default to 150px height if not specified on incoming media from CMS.
    const DEFAULT_BANNER_HEIGHT = 150;
    const middleProductBannerHeight = displayedBottomProductBanner?.media?.height ?? DEFAULT_BANNER_HEIGHT;
    const topProductBannerHeight = displayedProductBanner?.media?.height ?? DEFAULT_BANNER_HEIGHT;

    return (
        <React.Fragment>
            {!isHiddenCategory && !hideBreadcrumbs ? (
                <ProductBreadCrumbs parentCategory={parentCategory} />
            ) : (
                <div
                    css={{
                        height: space[4],
                        [mediaQueries.sm]: {
                            height: space[5]
                        }
                    }}
                />
            )}
            {!regularProductHasMounted && isPXSEnabled ? (
                <SkeletonBanner height={topProductBannerHeight} />
            ) : isPXSEnabled ? (
                <section>
                    <Banner
                        enablePageRenderTracking={false}
                        {...displayedProductBanner}
                        bannerType={BANNER_TYPES.PDP}
                        marginTop={null}
                        marginBottom={[4, 5]}
                    />
                </section>
            ) : (
                showMiddleProductBanner && (
                    <BccRwdComponentList
                        // should be `container` but preference is for `inline` banner display here
                        // TODO: separate sm + lg image position props in CMS
                        context='inline'
                        items={displayedProductBanner}
                        baseStyleProps={{
                            marginBottom: [4, 5]
                        }}
                    />
                )
            )}
            <Grid
                marginTop={[null, null, 4]}
                marginBottom={[5, 6]}
                lineHeight='tight'
                columns={[null, null, 'minmax(432px, 565px) minmax(480px, 100%)']}
                gap={[3, 4, 2]}
                columnGap={[null, null, 7, 8]}
                gridTemplateRows={[null, null, 'auto 1fr']}
                css={{ position: 'relative' }}
            >
                <div>{content.top}</div>
                <div
                    css={{
                        [mediaQueries.md]: {
                            gridColumn: '1 / 2',
                            gridRow: '1 / 3'
                        }
                    }}
                >
                    <ProductMediaCarousel
                        sku={sku}
                        product={product}
                        preventPageRenderReport={preventPageRenderReport}
                    />
                </div>
                <div>
                    {/* Show skeleton if parent hasn't mounted */}
                    {!regularProductHasMounted && isPXSEnabled ? (
                        <SkeletonBanner height={middleProductBannerHeight} />
                    ) : isPXSEnabled ? (
                        <section>
                            <Banner
                                enablePageRenderTracking={false}
                                {...displayedMiddleProductBanner}
                                bannerType={isProductSampleEnabled ? BANNER_TYPES.PDP_SAMPLE : BANNER_TYPES.PDP}
                                marginTop={2}
                                marginBottom={3}
                                alignLeft
                            />
                        </section>
                    ) : (
                        showMiddleProductBanner && (
                            <BccRwdComponentList
                                context='inline'
                                items={displayedMiddleProductBanner}
                                baseStyleProps={{
                                    marginTop: 2,
                                    marginBottom: 3
                                }}
                            />
                        )
                    )}
                    {content.bottom}
                    {isPXSEnabled && displayedBottomProductBanner && (
                        <section>
                            <Banner
                                enablePageRenderTracking={false}
                                {...displayedBottomProductBanner}
                                bannerType={BANNER_TYPES.PDP}
                                marginTop={3}
                                marginBottom={3}
                            />
                        </section>
                    )}
                    <BccRwdComponentList
                        context='inline'
                        items={regions.bottom}
                        baseStyleProps={{
                            marginTop: 4
                        }}
                    />
                </div>
            </Grid>
        </React.Fragment>
    );
}

export default wrapFunctionalComponent(LayoutTop, 'LayoutTop');
