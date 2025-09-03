import React from 'react';
import BCC from 'utils/BCC';
import { space } from 'style/config';
import anaConsts from 'analytics/constants';
import FrameworkUtils from 'utils/framework';
import LazyLoad from 'components/LazyLoad/LazyLoad';
import ProductItem from 'components/Product/ProductItem';

const GUTTER_PADDING = space[3];
const MAX_NUM_PRODUCTS_TO_AUGMENT_WITH_SOASTA_PAGE_RENDER_FLAG = Sephora.isMobile() ? 8 : 12;

const { IMAGE_SIZES } = BCC;
const { wrapFunctionalComponent } = FrameworkUtils;

const ProductGrid = ({ deliveryOptions, checkedRefinements, isShadeFinderResults = false, ...props }) => {
    const isDesktop = Sephora.isDesktop();

    const getRows = (products, shouldRunSoasta) => {
        const serverRenderLimit = isDesktop ? 12 : 8;
        const rows = [];
        let rowItems = [];

        /* serverRenderLimit dictates how many products are rendered server-side,
        the rest being lazy loaded client-side. Products are also grouped in sets of 3
        rows so that they can be lazy loaded per their container. */
        for (let x = 0, max = products.length; x < max; x++) {
            const isLazyLoaded = x >= serverRenderLimit;
            const Component = isLazyLoaded ? LazyLoad : ProductItem;
            const product = products[x];
            const hasSoastaFlag = x < MAX_NUM_PRODUCTS_TO_AUGMENT_WITH_SOASTA_PAGE_RENDER_FLAG;

            rowItems.push(
                <div
                    css={isDesktop ? styles.itemFS : styles.itemMW}
                    key={product.productId}
                >
                    <Component
                        disableLazyLoad={!isLazyLoaded}
                        showBadges={true}
                        showMarketingFlags={true}
                        showReviews={true}
                        showLoves={true}
                        showPrice={true}
                        formatValuePrice={true}
                        imageSize={IMAGE_SIZES[162]}
                        key={product.productId}
                        targetUrl={product.targetUrl}
                        productId={product.productId}
                        productReviewCount={product.reviews}
                        brandName={product.brandName}
                        productName={product.displayName}
                        starRatings={product.rating}
                        moreColors={product.moreColors}
                        skuImages={{
                            image162: product.image162,
                            image450: product.image450
                        }}
                        //HERE
                        component={ProductItem}
                        isPageRenderImg={shouldRunSoasta && hasSoastaFlag}
                        rootContainerName={anaConsts.COMPONENT_TITLE.SKUGRID}
                        productStringContainerName={anaConsts.COMPONENT_TITLE.SKUGRID}
                        heroImageAltText={product.heroImageAltText}
                        checkedRefinements={checkedRefinements}
                        deliveryOptions={deliveryOptions}
                        pickupEligible={product.pickupEligible}
                        sameDayEligible={product.sameDayEligible}
                        shipToHomeEligible={product.shipToHomeEligible}
                        {...product.currentSku}
                        variationValue={product.variationValue}
                        variationDesc={product.variationDesc}
                        isShadeFinderResults={isShadeFinderResults}
                    />
                </div>
            );

            // Flush products into new row once there's enough of them
            if (rowItems.length % serverRenderLimit === 0) {
                rows.push(
                    <div
                        key={product.productId}
                        css={styles.row}
                        data-lload={isLazyLoaded ? 'comp' : 'false'}
                    >
                        {rowItems.slice()}
                    </div>
                );
                rowItems = [];
            }
        }

        // Flush any left over products
        if (rowItems.length) {
            rows.push(
                <div
                    css={styles.row}
                    data-lload='comp'
                >
                    {rowItems.slice()}
                </div>
            );
        }

        return rows;
    };

    return <div>{props.products ? getRows(props.products, props.shouldRunSoasta) : null}</div>;
};

const itemStyle = {
    display: 'flex',
    paddingLeft: GUTTER_PADDING,
    paddingRight: GUTTER_PADDING
};

const styles = {
    row: {
        display: 'flex',
        flexFlow: 'row wrap',
        marginLeft: -GUTTER_PADDING,
        marginRight: -GUTTER_PADDING
    },
    itemMW: [
        itemStyle,
        {
            width: '50%',
            marginTop: space[4],
            marginBottom: space[4]
        }
    ],
    itemFS: [
        itemStyle,
        {
            width: '25%',
            marginTop: space[5],
            marginBottom: space[5]
        }
    ]
};

export default wrapFunctionalComponent(ProductGrid, 'ProductGrid');
