import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Box, Grid, Button, Divider, Flex, Text, Link
} from 'components/ui';
import InfoButton from 'components/InfoButton/InfoButton';
import ProductImage from 'components/Product/ProductImage/ProductImage';

import { colors } from 'style/config';

import localeUtils from 'utils/LanguageLocale';
import mediaUtils from 'utils/Media';
import isFunction from 'utils/functions/isFunction';

const { getLocaleResourceFile } = localeUtils;
const { Media } = mediaUtils;

function CheckoutButton({ message, block, onClick, dataAt }) {
    return (
        <Button
            onClick={onClick}
            variant='special'
            hasMinWidth={true}
            block={block}
            paddingX={'20px'}
            maxWidth={[null, '311px', null]}
            data-at={Sephora.debug.dataAt(dataAt)}
        >
            {message}
        </Button>
    );
}

function PreBasketCartLayout({
    title, carts, subtotal, subtotalMessage, promoMessage, goToBasket, infoOnClick, errors, dataAt
}) {
    const getText = getLocaleResourceFile('components/RwdBasket/RwdPreBasket/PreBasketCartLayout/locales', 'PreBasketCartLayout');

    const renderCheckoutButton = (breakpoint, block) => (
        <Media {...breakpoint}>
            <CheckoutButton
                message={getText('checkout')}
                block={block}
                onClick={goToBasket}
                breakpoint={breakpoint}
                dataAt={dataAt.checkoutButton}
            />
            <Box
                paddingTop={2}
                fontSize={['sm', 'base']}
                color={colors.red}
            >
                {errors.isAvailable && errors.messages[0]}
            </Box>
        </Media>
    );

    return (
        <Grid
            columns={[null, null, '1fr auto 330px']}
            gap={[null, 4]}
            borderRadius={2}
            minHeight='200px'
            padding={4}
            lineHeight='tight'
            boxShadow='light'
            marginBottom={2}
        >
            <div>
                <Flex
                    is='h2'
                    alignItems={['baseline', 'center']}
                    justifyContent={['space-between', null]}
                    fontSize={['md', 'lg']}
                    fontWeight='bold'
                    marginBottom={3}
                    gap={[3, null]}
                >
                    <Box
                        is='span'
                        display='inline-flex'
                        alignItems={['baseline', 'center']}
                        flex={[1, 'none']}
                        gap={'6px'}
                    >
                        <Text data-at={Sephora.debug.dataAt(dataAt.title)}>{title}</Text>
                        {isFunction(infoOnClick) && (
                            <InfoButton
                                size={16}
                                onClick={infoOnClick}
                                data-at={Sephora.debug.dataAt(dataAt?.infoIcon)}
                                padding={0}
                                margin={0}
                            />
                        )}
                    </Box>
                    <Media lessThan='md'>
                        <span
                            data-at={Sephora.debug.dataAt(dataAt.subtotal)}
                            children={subtotal}
                        />
                    </Media>
                </Flex>
                {renderCheckoutButton({ lessThan: 'md' }, true)}
                <Divider
                    marginLeft={-4}
                    marginRight={[-4, 0]}
                    marginY={3}
                />
                {carts.map(({ items, header, totalQuantity, cartDataAt }, cartIndex) => {
                    return (
                        <React.Fragment key={cartIndex}>
                            {cartIndex > 0 && <Divider marginY={3} />}
                            {header}
                            <Flex
                                gap={[null, 4]}
                                marginTop={[4, 5]}
                            >
                                {items.slice(0, 5).map((item, index) => (
                                    <ProductImage
                                        key={item.sku.skuId || index.toString()}
                                        id={item.sku.skuId}
                                        size={[48, 97]}
                                        skuImages={item.sku.skuImages}
                                        disableLazyLoad={true}
                                        onClick={goToBasket}
                                        data-at={Sephora.debug.dataAt(cartDataAt.productImg)}
                                    />
                                ))}
                                {totalQuantity > 5 && (
                                    <Link
                                        display='inline-flex'
                                        flexDirection='column'
                                        flexShrink={0}
                                        justifyContent='center'
                                        marginLeft={[4, 6]}
                                        fontSize={['xs', 'base']}
                                        width={['50px', '62px']}
                                        color={colors.gray}
                                        onClick={goToBasket}
                                        data-at={Sephora.debug.dataAt(cartDataAt?.seeAll)}
                                    >
                                        <Text children={`${getText('seeAll')} `} />
                                        <Text children={getText('xItems', [totalQuantity])} />
                                    </Link>
                                )}
                            </Flex>
                        </React.Fragment>
                    );
                })}
            </div>
            <Box
                display={['none', 'block']}
                backgroundColor='lightGray'
                width='1px'
            />
            <Flex flexDirection='column'>
                <Grid
                    display={['none', 'none', 'grid']}
                    columns='1fr auto'
                    fontWeight='bold'
                    fontSize={['md', 'lg']}
                >
                    {subtotalMessage}
                    <span
                        data-at={Sephora.debug.dataAt(dataAt.subtotal)}
                        children={subtotal}
                    />
                </Grid>
                <Divider
                    marginRight={-4}
                    marginY={3}
                />
                {renderCheckoutButton({ greaterThan: 'sm' })}
                <Text
                    is='p'
                    color='gray'
                    fontSize='sm'
                    marginTop='auto'
                    data-at={Sephora.debug.dataAt(dataAt.infoMessage)}
                >
                    {promoMessage}
                </Text>
            </Flex>
        </Grid>
    );
}

export default wrapFunctionalComponent(PreBasketCartLayout, 'PreBasketCartLayout');
