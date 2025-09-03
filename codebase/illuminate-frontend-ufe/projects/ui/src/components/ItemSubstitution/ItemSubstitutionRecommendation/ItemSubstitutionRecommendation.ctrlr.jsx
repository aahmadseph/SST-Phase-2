import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Text, Flex, Grid, Link, Box
} from 'components/ui';
import StarRating from 'components/StarRating/StarRating';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import { getImageAltText } from 'utils/Accessibility';
import LocaleUtils from 'utils/LanguageLocale';
import Swatches from 'components/ProductPage/Swatches/Swatches';
import SwatchesSkeleton from 'components/ItemSubstitution/SwatchesSkeleton';
import { colors, fontSizes, mediaQueries } from 'style/config';
import Markdown from 'components/Markdown/Markdown';
const SKU_IMG_SIZE = 74;

const getText = LocaleUtils.getLocaleResourceFile(
    'components/ItemSubstitution/ItemSubstitutionRecommendation/locales',
    'ItemSubstitutionRecommendation'
);

class ItemSubstitutionRecommendation extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate() {
        if (this.props.isSelected && this.props.productRec?.productPage) {
            const data = {
                firstChoiceItem: this.props.firstChoiceItem,
                availableOptions: this.props.productRec.productPage
            };
            this.props.availableOptionsAnalytics(data);
        }
    }

    render() {
        const {
            productRec,
            availableOptionsCount,
            showFooter,
            showAvailableOptionsButton,
            isSelected,
            isLoading,
            selectProductRec,
            updateCurrentSku,
            hasVariation,
            isPartialSaleData,
            showSize,
            fulfillmentType,
            storeId,
            zipCode
        } = this.props;

        const payload = {
            fulfillmentType,
            storeId,
            zipCode
        };

        return (
            <Box
                id={productRec.productId}
                paddingTop={3}
            >
                <Grid
                    padding={3}
                    borderWidth={1}
                    borderColor={'midGray'}
                    borderRadius={2}
                    onClick={isSelected ? null : () => selectProductRec(productRec, showFooter, payload)}
                    columns={'auto 1fr'}
                    gap={3}
                    {...(isSelected && styles.isSelected)}
                >
                    <Flex
                        gap={2}
                        flexDirection='column'
                    >
                        <ProductImage
                            size={SKU_IMG_SIZE}
                            id={productRec.currentSku.skuId}
                            skuImages={productRec.heroImage}
                            altText={getImageAltText(productRec.currentSku)}
                            ariaHidden={true}
                        />
                        {/*
                        It will be added with OMCON-1689 once there is final alignment for the ui which will display when the  'View Details' link is opened.
                        */}
                        {/*<Link
                            fontSize='sm'
                            color='blue'
                            display='block'
                            css={{ textAlign: 'center' }}
                            onClick={() => {
                                // eslint-disable-next-line no-console
                                console.log('TODO');
                            }}
                        >
                            {getText('viewDetails')}
                        </Link>*/}
                    </Flex>

                    <Flex flexDirection='column'>
                        <Text
                            is='p'
                            fontSize='sm'
                            fontWeight='bold'
                        >
                            {productRec.brandName}
                        </Text>
                        <Text
                            is='p'
                            fontSize='sm'
                        >
                            {productRec.displayName}
                        </Text>
                        {showSize && (
                            <Text
                                is='p'
                                color='gray'
                                fontSize='xs'
                            >
                                {getText('size')} {productRec.currentSku.size}
                            </Text>
                        )}
                        {hasVariation && (
                            <Text
                                is='p'
                                color='gray'
                                fontSize='xs'
                            >
                                {productRec.currentSku.variationTypeDisplayName && `${productRec.currentSku.variationTypeDisplayName}: `}
                                {productRec.currentSku.variationValue}
                            </Text>
                        )}

                        <Flex
                            gap={2}
                            alignItems='center'
                        >
                            <StarRating
                                size={12}
                                rating={parseInt(productRec.rating)}
                            />
                            <Text is='p'>{productRec.reviews} </Text>
                        </Flex>

                        <Flex
                            gap={1}
                            alignItems='center'
                            css={styles.price}
                        >
                            {isPartialSaleData ? (
                                <>
                                    {productRec.currentSku.valuePrice && (
                                        <>
                                            {' '}
                                            <span
                                                css={styles.priceValue}
                                                children={productRec.currentSku.valuePrice}
                                            />
                                        </>
                                    )}
                                    <span
                                        css={styles.partialListPrice}
                                        children={productRec.currentSku.listPrice}
                                    />
                                    <span
                                        css={styles.partialListPriceText}
                                        children={getText('regPrice')}
                                    />
                                    {productRec.currentSku.salePrice && (
                                        <p>
                                            <span
                                                css={styles.priceSale}
                                                children={productRec.currentSku.salePrice}
                                            />{' '}
                                            <span
                                                css={[styles.partialListPriceText, styles.priceSale]}
                                                children={getText('selectSaleItems')}
                                            />
                                        </p>
                                    )}
                                </>
                            ) : (
                                <>
                                    {productRec.currentSku.salePrice && (
                                        <>
                                            <span
                                                css={styles.priceSale}
                                                children={productRec.currentSku.salePrice}
                                            />{' '}
                                        </>
                                    )}
                                    <span
                                        css={productRec.currentSku.salePrice && styles.priceList}
                                        children={productRec.currentSku.listPrice}
                                    />
                                    {productRec.currentSku.valuePrice && (
                                        <>
                                            {' '}
                                            <span
                                                css={styles.priceValue}
                                                children={productRec.currentSku.valuePrice}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </Flex>
                        {!productRec.currentSku.isReturnable && (
                            <Markdown
                                marginTop='0.5em'
                                color={colors.red}
                                fontSize={fontSizes.sm}
                                content={getText('finalSale')}
                            />
                        )}
                    </Flex>
                    {showFooter && (
                        <Grid
                            marginX={-3}
                            paddingX={3}
                            marginTop={3}
                            borderColor='midGray'
                            borderTopWidth={1}
                            gridColumn='span 2'
                        >
                            {showAvailableOptionsButton ? (
                                <Link
                                    fontSize='sm'
                                    marginTop={3}
                                    display='flex'
                                    justifyContent='space-between'
                                    arrowDirection='down'
                                    hoverSelector='none'
                                >
                                    {getText('viewOptions')}
                                </Link>
                            ) : isLoading ? (
                                <SwatchesSkeleton
                                    optionsCount={availableOptionsCount}
                                    shape='circle'
                                />
                            ) : (
                                <Swatches
                                    isSmallView={false}
                                    isSkuReady={true}
                                    isCustomSet={!!productRec?.productPage?.currentSku?.configurableOptions}
                                    currentProduct={productRec?.productPage}
                                    hideSizeAndDescription={true}
                                    isItemSubModal={true}
                                    onSwatchSelect={updateCurrentSku}
                                />
                            )}
                        </Grid>
                    )}
                </Grid>
            </Box>
        );
    }
}

const styles = {
    price: {
        display: 'block',
        marginTop: '.375em',
        fontSize: fontSizes.base,
        [mediaQueries.sm]: {
            fontSize: fontSizes.md
        },
        fontWeight: 'bold'
    },
    priceList: {
        fontWeight: 'var(--font-weight-normal)',
        textDecoration: 'line-through'
    },
    priceSale: {
        color: colors.red
    },
    priceValue: {
        fontWeight: 'var(--font-weight-normal)',
        fontSize: '.75em'
    },
    isSelected: {
        boxShadow: '0 0 0 2px black',
        borderColor: 'black'
    },
    partialListPrice: {
        fontWeight: 'var(--font-weight-normal)'
    },
    partialListPriceText: {
        fontSize: fontSizes.sm,
        fontWeight: 'var(--font-weight-normal)'
    }
};

export default wrapComponent(ItemSubstitutionRecommendation, 'ItemSubstitutionRecommendation', true);
