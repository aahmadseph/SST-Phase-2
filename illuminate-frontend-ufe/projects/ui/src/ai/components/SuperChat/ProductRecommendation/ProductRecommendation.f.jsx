import React, { useState } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Button, Divider, Flex, Icon, Image, Text
} from 'components/ui';
import {
    borders, colors, fontSizes, fontWeights, lineHeights, radii, shadows, space
} from 'style/config';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

// Helper function to format review numbers
const formatReviewCount = count => {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }

    return count.toString();
};

function ProductRecommendation({
    products = [], localization, addToBasket, addToLovesList, shoppingListIds = []
}) {
    const [addedToBasket, setAddedToBasket] = useState({});

    // Helper function to check if a product is loved using Redux state
    const isProductLoved = product => {
        const skuId = product.default_sku;

        return shoppingListIds.some(elem => elem === skuId);
    };

    const sendAnalyticsAddToBasket = skuId => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`,
                actionInfo: `${anaConsts.SUPER_CHAT.SUPERCHAT_BASKET}`, // prop55
                eventStrings: 'scAdd',
                productStrings: `;${skuId};;;;eVar26=${skuId}|eVar23=superchat|eVar72=superchat|eVar133=standard`
            }
        });
    };

    const handleAddToBasket = async product => {
        const productKey = product.id || product.default_sku;

        try {
            const productData = {
                skuList: [
                    {
                        productId: product.id,
                        skuId: product.default_sku,
                        qty: 1,
                        replenishmentSelected: false,
                        replenishmentFrequency: '',
                        isAcceptTerms: false
                    }
                ]
            };
            sendAnalyticsAddToBasket(product.default_sku);

            await addToBasket(productData);

            // Show success state
            setAddedToBasket(prev => ({
                ...prev,
                [productKey]: true
            }));

            // Revert to default state after 1 second
            setTimeout(() => {
                setAddedToBasket(prev => ({
                    ...prev,
                    [productKey]: false
                }));
            }, 1000);
        } catch (error) {
            Sephora.logger.error('Failed to add product to basket:', error);
        }
    };
    const sendAnalyticsAddToLovesList = skuId => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`,
                eventStrings: anaConsts.Event.EVENT_27, //event27
                productStrings: `;${skuId};;;;eVar26=${skuId}`
            }
        });
    };
    const sendAnalyticsRemoveToLovesList = skuId => {
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`,
                eventStrings: anaConsts.Event.EVENT_28, //event28
                productStrings: `;${skuId};;;;eVar26=${skuId}`
            }
        });
    };

    const handleCallAnalytics = product => {
        const skuId = product.default_sku;

        if (!isProductLoved(product)) {
            sendAnalyticsAddToLovesList(skuId);
        } else {
            sendAnalyticsRemoveToLovesList(skuId);
        }
    };
    const handleAddToLovesList = async product => {
        try {
            handleCallAnalytics(product);
            // Always call addToLovesList - it will open the MyLists modal
            // which handles both add and remove scenarios
            await addToLovesList(product);
        } catch (error) {
            Sephora.logger.error('Failed to open loves modal:', error);
        }
    };

    if (!products || products.length === 0) {
        return null;
    }

    return (
        <Box css={styles.productContainer}>
            {products.map((product, index) => (
                <Box
                    key={product.id || index}
                    marginBottom={space[4]}
                >
                    <Flex
                        alignItems='flex-start'
                        css={styles.productContent}
                    >
                        {/* Product Image */}
                        <Box css={styles.imageContainer}>
                            {product.isNew && <Box css={styles.newBadge}>{localization.new}</Box>}
                            <Image
                                src={product.image_url}
                                alt={product.title}
                                css={styles.productImage}
                            />
                        </Box>

                        {/* Product Details */}
                        <Flex
                            flexDirection='column'
                            flex='1'
                            css={styles.productDetails}
                        >
                            {/* Brand and Product Name */}
                            <Box>
                                <Text
                                    fontSize='sm'
                                    fontWeight='bold'
                                    color='black'
                                >
                                    {product.brand_name}
                                </Text>
                                <Text
                                    fontSize='sm'
                                    color='black'
                                    css={styles.productName}
                                >
                                    {product.title}
                                </Text>
                            </Box>

                            {/* Rating */}
                            <Flex
                                alignItems='center'
                                css={styles.ratingContainer}
                            >
                                <Flex css={styles.starsContainer}>
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            css={{
                                                ...styles.star,
                                                color: i < Math.floor(product.product_ratings) ? colors.black : colors.lightGray
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </Flex>
                                <Text
                                    fontSize='xs'
                                    marginLeft={space[3]}
                                >
                                    {formatReviewCount(product.total_reviews)}
                                </Text>
                            </Flex>

                            {/* Price */}
                            <Text
                                fontWeight='bold'
                                css={styles.priceText}
                            >
                                {product.price_info_formatted}
                            </Text>

                            {/* Size */}
                            {product.size && (
                                <Text
                                    fontSize='sm'
                                    marginBottom={space[3]}
                                >
                                    {localization.size} {product.size}
                                </Text>
                            )}

                            {/* Action Buttons */}
                            <Flex css={styles.actionButtons}>
                                <Button
                                    variant='special'
                                    size='sm'
                                    css={styles.addToBasketButton}
                                    onClick={() => handleAddToBasket(product)}
                                >
                                    {addedToBasket[product.id || product.default_sku] ? (
                                        <Flex
                                            alignItems='center'
                                            justifyContent='center'
                                            gap={2}
                                        >
                                            Added
                                            <Image
                                                width={20}
                                                height={20}
                                                src='/img/ufe/success-login.svg'
                                            />
                                        </Flex>
                                    ) : (
                                        localization.addToBasket
                                    )}
                                </Button>
                                <Button
                                    variant='secondary'
                                    css={styles.wishlistButton}
                                    onClick={() => handleAddToLovesList(product)}
                                >
                                    <Icon
                                        name={isProductLoved(product) ? 'heart' : 'heartOutline'}
                                        size={[20, 20]}
                                        color={isProductLoved(product) ? 'red' : 'black'}
                                    />
                                </Button>
                            </Flex>
                        </Flex>
                    </Flex>
                    {index < products.length - 1 && (
                        <Divider
                            marginTop={20}
                            marginBottom={20}
                        />
                    )}
                </Box>
            ))}
        </Box>
    );
}

const styles = {
    productContainer: {
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: space[3],
        boxShadow: shadows.light,
        marginBottom: space[2]
    },
    productContent: {
        gap: space[3]
    },
    imageContainer: {
        flexShrink: 0
    },
    newBadge: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: colors.black,
        color: colors.white,
        fontSize: fontSizes.xs,
        fontWeight: fontWeights.bold,
        padding: `${space[1]}px ${space[2]}px`,
        borderRadius: `${radii[1]}px`,
        zIndex: 1
    },
    productImage: {
        width: 120,
        height: 120,
        objectFit: 'cover',
        borderRadius: `${radii[1]}px`
    },
    productDetails: {
        gap: 0
    },
    productName: {
        display: 'flex',
        lineHeight: lineHeights.tight,
        overflow: 'hidden',
        marginTop: 2
    },
    ratingContainer: {
        marginTop: space[1],
        gap: 0
    },
    starsContainer: {
        display: 'flex',
        gap: 1
    },
    star: {
        fontSize: fontSizes.sm,
        lineHeight: lineHeights.none
    },
    priceText: {
        marginTop: space[1],
        marginBottom: space[1]
    },
    actionButtons: {
        gap: space[3],
        alignItems: 'center'
    },
    addToBasketButton: {
        width: 155,
        fontSize: fontSizes.sm,
        paddingTop: space[2],
        paddingBottom: space[2]
    },
    wishlistButton: {
        minWidth: 20,
        border: borders[0],
        padding: space[0],
        minHeight: space[6],
        height: 36,
        width: 36,
        borderRadius: radii.full,
        '&:hover, :focus': {
            backgroundColor: colors.nearWhite
        }
    }
};

export default wrapFunctionalComponent(ProductRecommendation, 'ProductRecommendation');
