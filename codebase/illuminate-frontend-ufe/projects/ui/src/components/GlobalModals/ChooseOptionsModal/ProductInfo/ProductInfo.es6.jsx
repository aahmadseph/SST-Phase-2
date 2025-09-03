import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Flex, Text } from 'components/ui';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import { forms, space, mediaQueries } from 'style/config';

const getText = localeUtils.getLocaleResourceFile('components/GlobalModals/ChooseOptionsModal/locales', 'ChooseOptionsModal');

class ProductInfo extends BaseClass {
    getProductPrice() {
        const { currentSku } = this.props;

        return (
            <Box
                fontSize='md'
                lineHeight='tight'
                marginTop={[4, 0]}
                marginBottom={[null, 2]}
                data-at={Sephora.debug.dataAt('choose_options_modal_price_list')}
                minHeight={[null, forms.HEIGHT]}
            >
                {currentSku.salePrice ? (
                    <span css={{ textDecoration: 'line-through' }}>{currentSku.listPrice}</span>
                ) : (
                    <strong children={currentSku.listPrice} />
                )}
                {currentSku.salePrice && (
                    <>
                        {' '}
                        <Text
                            is='strong'
                            color='red'
                            children={currentSku.salePrice}
                        />
                    </>
                )}
                {currentSku.valuePrice && (
                    <Text
                        is='p'
                        marginTop={1}
                        fontSize='base'
                        children={currentSku.valuePrice}
                    />
                )}
                {skuUtils.isAppExclusive(currentSku) && (
                    <Text
                        is='p'
                        marginTop={1}
                        fontSize='base'
                        data-at={Sephora.debug.dataAt('choose_options_modal_app_exclusive_label')}
                        children={getText('appExclusive')}
                    />
                )}
            </Box>
        );
    }
    getProductName = () => {
        const { product, currentSku } = this.props;

        let productDetailsToUse;

        if (currentSku && (currentSku.displayName || currentSku.brand)) {
            const parentDetails = product.productDetails || product;
            productDetailsToUse = {
                brand: currentSku.brand || (parentDetails && parentDetails.brand),
                productName: currentSku.productName || (parentDetails && parentDetails.productName)
            };
        } else {
            productDetailsToUse = product.productDetails || product;
        }

        return (
            <>
                {productDetailsToUse.brand && (
                    <>
                        <Text
                            fontWeight='bold'
                            fontSize='base'
                            data-at={Sephora.debug.dataAt('choose_options_modal_brand')}
                        >
                            {productDetailsToUse.brand.displayName}
                        </Text>
                        <br />
                    </>
                )}
                <span
                    className='Link-target'
                    data-at={Sephora.debug.dataAt('choose_options_modal_name')}
                >
                    {productDetailsToUse.productName}
                </span>
            </>
        );
    };

    getProductImage = () => {
        const { product, currentSku } = this.props;

        return (
            <Box css={styles.imageWrapper}>
                <ProductImage
                    disableLazyLoad={true}
                    id={currentSku.skuId}
                    size={80}
                    skuImages={currentSku.skuImages}
                    data-at={Sephora.debug.dataAt('choose_options_modal_image')}
                    altText={supplementAltTextWithProduct(currentSku, product)}
                />
            </Box>
        );
    };

    render() {
        return (
            <>
                <Flex style={styles.productInfo}>
                    <Box>{this.getProductImage()}</Box>
                    <Box css={styles.productDetails}>
                        {this.getProductName()}
                        {this.getProductPrice()}
                    </Box>
                </Flex>
            </>
        );
    }
}

const styles = {
    productInfo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'stretch',
        gap: space[5],
        marginBottom: space[5],
        [mediaQueries.sm]: {
            gap: space[3],
            marginBottom: space[4]
        }
    },
    productDetails: {
        flex: 1,
        minWidth: 0,
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
    },
    imageWrapper: {
        width: '80px',
        flexShrink: 0
    }
};

export default wrapComponent(ProductInfo, 'ProductInfo');
