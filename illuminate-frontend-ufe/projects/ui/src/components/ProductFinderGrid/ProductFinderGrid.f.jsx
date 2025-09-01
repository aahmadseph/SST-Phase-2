/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import ProductItem from 'components/Product/ProductItem';
import bccUtils from 'utils/BCC';

const { IMAGE_SIZES } = bccUtils;

function ProductFinderGrid(fullProps) {
    const isMobile = Sephora.isMobile();
    const { products } = fullProps;

    return (
        <LegacyGrid gutter={5}>
            {products.length &&
                products.map(product => (
                    <LegacyGrid.Cell
                        key={product.skuId}
                        display='flex'
                        marginY={isMobile ? 4 : 5}
                        width={isMobile ? 1 / 2 : 1 / 4}
                    >
                        <ProductItem
                            showMarketingFlags={true}
                            showReviews={true}
                            showLoves={true}
                            showPrice={true}
                            useAddToBasket={true}
                            disableLazyLoad={true}
                            imageSize={IMAGE_SIZES[135]}
                            {...product}
                        />
                    </LegacyGrid.Cell>
                ))}
        </LegacyGrid>
    );
}

export default wrapFunctionalComponent(ProductFinderGrid, 'ProductFinderGrid');
