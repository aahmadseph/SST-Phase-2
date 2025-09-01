/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Icon, Grid, Flex, Link
} from 'components/ui';
import mediaUtils from 'utils/Media';
import ItemSubstitutionRoot from 'components/ItemSubstitution/ItemSubstitutionRoot';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import OnlyFewLeft from 'components/RwdBasket/Carts/CartLayout/SkuItem/OnlyFewLeft';
import OutOfStockFlag from 'components/RwdBasket/Carts/CartLayout/SkuItem/OutOfStockFlag';
import FinalSaleMessage from 'components/RwdBasket/Carts/CartLayout/SkuItem/FinalSaleMessage';
import ButtonRow from 'components/RwdBasket/Carts/CartLayout/SkuItem/Buttons/ButtonRow';
import { colors, space, radii } from 'style/config';
import rwdBasketUtils from 'utils/RwdBasket';
import { getImageAltText } from 'utils/Accessibility';
import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import helperUtils from 'utils/Helpers';
import skuUtils from 'utils/Sku';

const { Media } = mediaUtils;
const { getTargetUrl } = rwdBasketUtils;
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');
const { formatSiteCatalystPrice } = helperUtils;

const styles = {
    salePriceText: {
        color: colors.red
    },
    originalPriceText: {
        fontWeight: 'var(--font-weight-normal)',
        textDecoration: 'line-through'
    },
    skuDeleteWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        width: space[5],
        height: space[5],
        borderRadius: radii.full,
        border: `1px solid ${colors.midGray}`,
        cursor: 'pointer'
    },
    iconBox: {
        width: space[3],
        height: space[3]
    }
};

function TitleLink({ brandName, productName, targetUrl, goToTargetUrl }) {
    const displayName = (
        <>
            <strong data-at={Sephora.debug.dataAt('bsk_sku_brand')}>{brandName}</strong>
            <br />
            <span data-at={Sephora.debug.dataAt('bsk_sku_name')}>{productName}</span>
        </>
    );

    return (
        <Text
            is='p'
            fontSize={['sm', 'base']}
            marginBottom={1}
        >
            {targetUrl ? (
                <Link
                    display='block'
                    onClick={goToTargetUrl}
                    href={targetUrl}
                >
                    {displayName}
                </Link>
            ) : (
                displayName
            )}
        </Text>
    );
}

function SkuDelete({ onChange, sku, productId, qty }) {
    const skuDeleteClickHandler = () => {
        onChange({ sku, productId, qty });
    };

    return (
        <Flex
            css={styles.skuDeleteWrapper}
            onClick={skuDeleteClickHandler}
            data-at={Sephora.debug.dataAt('bsk_sku_remove')}
        >
            <Box css={styles.iconBox}>
                <Icon
                    name={'trash'}
                    color={'gray'}
                    size={24}
                />
            </Box>
        </Flex>
    );
}

function Price({ item, price }) {
    const hasSalePrice = item.sku.salePrice || (item.isReplenishment && (item.replenishmentItemPrice || item.sku.replenishmentAdjusterPrice));
    const salePrice = item.isReplenishment ? item.replenishmentItemPrice || item.sku.replenishmentAdjusterPrice : item.salePriceSubtotal;
    const originalPrice = price || item.listPriceSubtotal;
    const isCanada = localeUtils.isCanada();
    const defaultPrice = (
        <Flex
            css={{ fontWeight: 'var(--font-weight-bold)' }}
            fontSize={['base', 'md']}
            marginTop={3}
            gap={1}
        >
            {hasSalePrice && (
                <div
                    data-at={Sephora.debug.dataAt('bsk_sale_price')}
                    css={styles.salePriceText}
                    children={salePrice + (item.sku.acceleratedPromotion ? '*' : '')}
                />
            )}
            <div
                data-at={Sephora.debug.dataAt('bsk_sku_price')}
                css={hasSalePrice ? styles.originalPriceText : null}
                children={originalPrice}
            />
        </Flex>
    );

    const savingsDetails = hasSalePrice && isCanada && (
        <BasketSavings
            item={item}
            price={price}
        />
    );

    return savingsDetails || defaultPrice;
}

function BasketSavings({ item, price }) {
    const hasSalePrice = item.sku.salePrice || (item.isReplenishment && (item.replenishmentItemPrice || item.sku.replenishmentAdjusterPrice));

    const salePrice = item.isReplenishment ? item.replenishmentItemPrice || item.sku.replenishmentAdjusterPrice : item.salePriceSubtotal;

    const originalPrice = price || item.listPriceSubtotal;

    const calculateSavings = () => {
        if (!hasSalePrice) {
            return null;
        }

        const originalAmount = parseFloat(formatSiteCatalystPrice(originalPrice));
        const saleAmount = parseFloat(formatSiteCatalystPrice(salePrice));
        const savings = originalAmount - saleAmount;

        return savings.toFixed(2);
    };

    return (
        <Box>
            <Flex
                css={{ fontWeight: 'var(--font-weight-bold)' }}
                fontSize={['base', 'md']}
                marginTop={3}
                gap={1}
            >
                <div
                    data-at={Sephora.debug.dataAt('bsk_sale_price')}
                    css={styles.salePriceText}
                    children={salePrice + (item.sku.acceleratedPromotion ? '*' : '')}
                />
                <div
                    data-at={Sephora.debug.dataAt('bsk_sku_price')}
                    css={styles.originalPriceText}
                    children={originalPrice}
                />
            </Flex>
            <Text
                fontSize='sm'
                marginTop={1}
                fontWeight='var(--font-weight-bold)'
                data-at={Sephora.debug.dataAt('bsk_sku_savings')}
                color={colors.gray}
            >
                {getText('save')} ${calculateSavings()}
            </Text>
        </Box>
    );
}

function ErrorContainer({ error }) {
    if (!error.isAvailable) {
        return null;
    }

    const { message, ref } = error;

    return (
        <Box ref={ref}>
            <Box
                fontSize={['sm', 'base']}
                color={colors.red}
                top={'-8px'}
                bottom={2}
                position={'relative'}
            >
                {message}
            </Box>
        </Box>
    );
}

function SkuItemLayout({
    item,
    itemDeliveryMethod,
    abovePriceContent,
    belowPriceContent = [],
    price = null,
    rightLGUISection,
    isNotFinalSale,
    isOutOfStock = false,
    isDisabled,
    showQuantityPickerBasket,
    onDelete,
    ...props
}) {
    const targetUrl = getTargetUrl(item);
    const goToTargetUrl = event => Location.navigateTo(event, targetUrl);

    const renderButtonRow = breakpoint => (
        <ButtonRow
            item={item}
            {...props}
            isOutOfStock={isOutOfStock}
            itemDeliveryMethod={itemDeliveryMethod}
            breakpoint={breakpoint}
            isDisabled={isDisabled}
            showQuantityPickerBasket={showQuantityPickerBasket}
            onDelete={onDelete}
        />
    );

    if (item.sku.isOnlyFewLeft) {
        belowPriceContent.push(OnlyFewLeft);
    }

    if (isOutOfStock) {
        belowPriceContent.push(() => <OutOfStockFlag itemDeliveryMethod={itemDeliveryMethod} />);
    }

    if (!isNotFinalSale && !item.sku.isReturnable) {
        belowPriceContent.push(FinalSaleMessage);
    }

    return (
        <Grid
            columns={[null, '1fr auto']}
            gap={0}
            marginLeft={[3, 5]}
            marginRight={[2, 4]}
            borderBottom={`1px solid ${colors.lightGray}`}
            paddingY={4}
            data-at={Sephora.debug.dataAt('product_refinement')}
        >
            <Flex
                flexDirection={'column'}
                gap={0}
                marginRight={[null, null, null, 4]}
            >
                <ErrorContainer error={item.error} />
                <Grid
                    gap={[`${space[4]}px`, 4]}
                    columns='auto 1fr'
                    lineHeight='tight'
                >
                    <Box
                        onClick={goToTargetUrl}
                        href={targetUrl}
                        margin={[2, 1]}
                        data-at={Sephora.debug.dataAt('product_image_link')}
                    >
                        <Box
                            is='div'
                            display={'inline'}
                            position={'relative'}
                        >
                            {(isOutOfStock || item.error.isAvailable) && (
                                <Box
                                    position={'relative'}
                                    zIndex={1}
                                    style={{ padding: '10px' }}
                                >
                                    <Icon
                                        name={'alert'}
                                        color={'red'}
                                        style={{ position: 'absolute', top: '50%', transform: 'translate(-75%, -50%)' }}
                                    />
                                </Box>
                            )}
                            <ProductImage
                                id={item.sku.skuId}
                                size={[74, 190]}
                                skuImages={item.sku.skuImages}
                                isPageRenderImg={item.enablePageRenderTracking}
                                disableLazyLoad={false}
                                altText={getImageAltText(item.sku)}
                            />
                        </Box>
                    </Box>
                    <Box
                        fontSize='sm'
                        height={'100%'}
                        paddingRight={[4, 4, 4, 0]}
                    >
                        <Flex
                            flexDirection={'column'}
                            justifyContent={'space-between'}
                            height={'100%'}
                        >
                            <Box>
                                {showQuantityPickerBasket ? (
                                    <Grid
                                        columns={'auto auto'}
                                        gap={'6px'}
                                        justifyContent='space-between'
                                    >
                                        <TitleLink
                                            brandName={item.sku.brandName}
                                            productName={item.sku.productName}
                                            targetUrl={targetUrl}
                                            goToTargetUrl={goToTargetUrl}
                                        />
                                        {(item.sku.type.toLowerCase() !== skuUtils.skuTypes.GWP.toLowerCase() || Sephora.isAgent) && (
                                            <SkuDelete
                                                sku={item.sku}
                                                qty={item.qty}
                                                productId={item.sku.productId}
                                                onChange={onDelete}
                                            />
                                        )}
                                    </Grid>
                                ) : (
                                    <TitleLink
                                        brandName={item.sku.brandName}
                                        productName={item.sku.productName}
                                        targetUrl={targetUrl}
                                        goToTargetUrl={goToTargetUrl}
                                    />
                                )}
                                {abovePriceContent || (
                                    <Box
                                        data-at={Sephora.debug.dataAt('sku_size')}
                                        color={colors.gray}
                                    >
                                        {getText('item', [item.sku.skuId])}
                                    </Box>
                                )}
                                <Price
                                    item={item}
                                    price={price}
                                />
                                {belowPriceContent.map((Component, index) => {
                                    return (
                                        <Component
                                            key={`${item.sku.skuId}-${index}`}
                                            item={item}
                                            {...props}
                                        />
                                    );
                                })}
                            </Box>
                            {renderButtonRow({
                                greaterThan: 'sm'
                            })}
                        </Flex>
                    </Box>
                </Grid>
                {renderButtonRow({
                    lessThan: 'md'
                })}
                <ItemSubstitutionRoot item={item} />
            </Flex>

            <Media greaterThan={'xs'}>
                <Box
                    borderLeft={`1px solid ${colors.lightGray}`}
                    paddingLeft={4}
                    minHeight={'100%'}
                    width={'300px'}
                >
                    {rightLGUISection}
                </Box>
            </Media>
        </Grid>
    );
}

export default wrapFunctionalComponent(SkuItemLayout, 'SkuItemLayout');
