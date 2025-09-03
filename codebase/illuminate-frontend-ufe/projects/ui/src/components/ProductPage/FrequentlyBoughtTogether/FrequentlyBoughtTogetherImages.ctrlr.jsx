// /* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import languageLocale from 'utils/LanguageLocale';
import {
    Flex, Box, Icon, Text
} from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import Price from 'components/Product/Price/Price';
import bccUtils from 'utils/BCC';
import { getImageAltText } from 'utils/Accessibility';
import hrelpersUtils from 'utils/Helpers';

const { getLocaleResourceFile } = languageLocale;
const { IMAGE_SIZES } = bccUtils;
const { calculateTotalPrice } = hrelpersUtils;
const getText = getLocaleResourceFile('components/ProductPage/FrequentlyBoughtTogether/locales', 'FrequentlyBoughtTogether');

class FrequentlyBoughtTogetherImages extends BaseClass {
    render() {
        return (
            <Box marginTop={1}>
                <Flex
                    backgroundColor='nearWhite'
                    padding={3}
                    marginTop={-3}
                    borderRadius={4}
                    width={344}
                    alignItems='center'
                    justifyContent='center'
                >
                    <Flex>
                        {this.props.sku.map((item, index) => (
                            <Flex key={item.skuId}>
                                {index ? (
                                    <Icon
                                        name='plus'
                                        size='12px'
                                        marginX={3}
                                        css={{
                                            marginTop: '40px'
                                        }}
                                    />
                                ) : null}
                                <Box flexDirection='column'>
                                    <Box backgroundColor='white'>
                                        <ProductImage
                                            disableLazyLoad={true}
                                            id={item.skuId}
                                            size={IMAGE_SIZES[97]}
                                            skuImages={this.props.sku.skuImages}
                                            altText={getImageAltText(item)}
                                        />
                                    </Box>
                                    <Price
                                        textAlign='center'
                                        atPrefix='atb_product'
                                        paddingTop={2}
                                        sku={item}
                                    />
                                </Box>
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
                <Flex
                    paddingTop={5}
                    marginBottom={-4}
                    alignItems='baseline'
                >
                    <span>{getText('itemsAdded')}</span>
                    <Text
                        is='h3'
                        fontWeight='bold'
                    >
                        {calculateTotalPrice(this.props.sku)}
                    </Text>
                </Flex>
            </Box>
        );
    }
}

export default wrapComponent(FrequentlyBoughtTogetherImages, 'FrequentlyBoughtTogetherImages');
