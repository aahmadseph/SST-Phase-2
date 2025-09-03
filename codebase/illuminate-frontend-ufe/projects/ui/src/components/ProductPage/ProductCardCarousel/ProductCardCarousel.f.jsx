import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Grid, Box, Text, Divider, Link, Flex
} from 'components/ui';
// eslint-disable-next-line no-unused-vars
import LazyLoad from 'components/LazyLoad/LazyLoad';
import ProductCard from 'components/Product/ProductCard';
import { CARD_GAP, CARD_WIDTH } from 'constants/productCard';
import Carousel from 'components/Carousel';
import {
    lineHeights, space, site, fontSizes, colors, fontWeights
} from 'style/config';

function ProductCardCarousel({
    carouselContextId,
    title,
    showAddToBasket,
    skus = [],
    onScroll,
    link,
    analyticsContext,
    isHorizontal,
    subTitle,
    onClick,
    source,
    urlImage,
    isAccountMenuBuyItAgain=false
}) {
    const items = [];
    let hasVariationValue = false;

    if (skus.length > 0) {
        skus.forEach(item => {
            if (!hasVariationValue) {
                hasVariationValue = !!item.variationValue;
            }

            items.push(item);
        });
    } else {
        return null;
    }

    const cards = items.map((item, index) => (
        <ProductCard
            isHorizontal={isHorizontal}
            sku={item}
            analyticsContext={analyticsContext}
            showAddButton={showAddToBasket}
            imageSize={isHorizontal ? [60, 100] : 160}
            hasVariationValue={hasVariationValue}
            parentTitle={title}
            onClick={onClick}
            key={index}
            position={index}
            source={source}
            urlImage={urlImage}
            isCarousel={true}
            isAccountMenuBuyItAgain
        />
    ));

    return (
        <Box
            marginBottom={isAccountMenuBuyItAgain ? [4] : [6, 8]}
            {...(isAccountMenuBuyItAgain && {
                marginLeft: [4],
                marginRight: [4]
            })}
            data-at={Sephora.debug.dataAt('product_carousel')}
        >
            {
                !isAccountMenuBuyItAgain &&
                <>
                    <Divider />
                    <Grid
                        alignItems='baseline'
                        columns='1fr auto'
                        lineHeight={lineHeights.tight}
                        gap={3}
                    >
                        <Flex alignItems='baseline'>
                            <Text
                                is='h2'
                                marginY={space[4]}
                                fontSize={[fontSizes.mg, fontSizes.lg]}
                                fontWeight={fontWeights.bold}
                                children={title}
                                data-at={Sephora.debug.dataAt('product_carousel_title')}
                            />
                            {subTitle && (
                                <Text
                                    is='p'
                                    color={colors.gray}
                                    fontSize={fontSizes.sm}
                                    children={subTitle}
                                    marginLeft='1em'
                                />
                            )}
                        </Flex>
                        {link && (
                            <Link
                                padding={2}
                                margin={-2}
                                color={colors.blue}
                                {...link}
                            />
                        )}
                    </Grid>
                </>
            }
            <LazyLoad
                contextId={carouselContextId}
                component={Carousel}
                gap={CARD_GAP}
                paddingY={4}
                marginX='-container'
                scrollPadding={[2, 'container']}
                {...(isHorizontal
                    ? {
                        itemWidth: [287, (site.containerMax - space[CARD_GAP[1]] * 2) / 3]
                    }
                    : {
                        itemWidth: CARD_WIDTH
                    })}
                items={cards}
                onScroll={onScroll}
                title={title}
                hasShadowHack={true}
            />
        </Box>
    );
}

ProductCardCarousel.shouldUpdatePropsOn = ['carouselContextId', 'skus'];

export default wrapFunctionalComponent(ProductCardCarousel, 'ProductCardCarousel');
