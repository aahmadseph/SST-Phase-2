import React from 'react';
import SwatchImage from 'components/ProductPage/Swatches/SwatchImage';

import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Text, Image
} from 'components/ui';
import basketUtils from 'utils/Basket';
import AddToBasketButton from 'components/AddToBasketButton';
import Flag from 'components/Flag/Flag';
import localeUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = localeUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;

function SampleProduct({ sample, productId, isAddToBasketDisabled, isInBasket }) {
    const getText = getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/locales', 'ChangeMethod');
    // Exclude product level alternate images
    const alternateImages = sample.alternateImages.filter(image => !image.imageUrl?.includes('/productimages/product/'));

    return (
        <Flex
            gap={3}
            paddingY={3}
            borderTop={1}
            borderColor={'#EEEEEE'}
        >
            <Box>
                <SwatchImage
                    isOutOfStock={sample.isOutOfStock}
                    src={sample.smallImage}
                    type={'circle'}
                    hasOutline={isInBasket}
                    isActive={isInBasket}
                />
            </Box>
            <Box flex={1}>
                <Text
                    fontSize='base'
                    textAlign='left'
                    marginBottom={1}
                    is='p'
                    lineHeight='tight'
                >
                    {sample.variationValue}
                    {sample.variationDesc ? ` - ${sample.variationDesc}` : ''}
                </Text>
                {sample.isOutOfStock ? (
                    <Flag
                        children={getText('outOfStock')}
                        width='max-content'
                        backgroundColor={'#000'}
                        marginRight={1}
                    />
                ) : null}
                <Flex
                    gap={2}
                    marginTop={3}
                >
                    <Image
                        display='block'
                        src={alternateImages[0]?.image250}
                        width={'100%'}
                        maxWidth={100}
                        height={'auto'}
                        alt={alternateImages[0]?.altText}
                        css={{
                            borderRadius: 4,
                            border: '1px solid #EEEEEE'
                        }}
                    />
                    <Image
                        display='block'
                        src={alternateImages[1]?.image250}
                        width={'100%'}
                        maxWidth={100}
                        height={'auto'}
                        alt={alternateImages[1]?.altText}
                        css={{
                            borderRadius: 4,
                            border: '1px solid #EEEEEE'
                        }}
                    />
                </Flex>
            </Box>
            <Box width={80}>
                <AddToBasketButton
                    variant={ADD_BUTTON_TYPE.SECONDARY}
                    isAddButton={true}
                    isAddTwoLines={true}
                    isAddFullSize={true}
                    suppressAddToCartModal={true}
                    suppressCheckmark={true}
                    size='sm'
                    sku={sample}
                    isBIRBReward={true}
                    productId={productId}
                    productSampleModal={true}
                    disabled={isAddToBasketDisabled}
                    smallOutOfStock={true}
                    customStyle={{
                        minWidth: 80,
                        '> div': {
                            alignItems: 'center'
                        }
                    }}
                />
            </Box>
        </Flex>
    );
}

export default wrapFunctionalComponent(SampleProduct, 'SampleProduct');
