/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import {
    Container, Grid, Divider, Button
} from 'components/ui';
import Swatches from 'components/AddReview/SelectShade/Swatches/Swatches';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import DisplayName from 'components/ProductPage/DisplayName/DisplayName';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import AddReviewTitle from 'components/AddReview/AddReviewTitle/AddReviewTitle';

import bccUtils from 'utils/BCC';
import LanguageLocale from 'utils/LanguageLocale';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import skuUtils from 'utils/Sku';

const { IMAGE_SIZES } = bccUtils;
const { getLocaleResourceFile } = LanguageLocale;

class SelectShade extends BaseClass {
    constructor(props) {
        super(props);

        this.state = this.props;
    }

    componentWillReceiveProps(updatedProps) {
        this.setState(updatedProps);
    }

    goToNext = () => {
        this.props.onNext();
    };

    render() {
        const { product } = this.state;
        const productDetails = product.productDetails;
        const activeSku = product.hoveredSku || product.currentSku;

        const getText = getLocaleResourceFile('components/AddReview/SelectShade/locales', 'SelectShade');

        return (
            <Container hasLegacyWidth={true}>
                <AddReviewTitle children={getText('selectAShade')} />
                <Grid
                    gap={[4, 5, 7]}
                    columns={[null, 'auto 1fr']}
                    textAlign={['center', 'left']}
                >
                    <ProductImage
                        marginX='auto'
                        id={activeSku.skuId}
                        skuImages={activeSku.skuImages}
                        altText={supplementAltTextWithProduct(product.currentSku, product)}
                        size={[IMAGE_SIZES[162], IMAGE_SIZES[300]]}
                        disableLazyLoad={true}
                    />
                    <div>
                        <DisplayName
                            is='h2'
                            marginBottom={[2, 5]}
                            product={{
                                brand: productDetails.brand,
                                displayName: productDetails.displayName
                            }}
                        />
                        <ProductVariation
                            hasMinHeight={true}
                            {...skuUtils.getProductVariations({
                                product,
                                sku: activeSku
                            })}
                        />
                        <Swatches {...product} />
                        <Divider
                            display={['none', 'block']}
                            marginY={5}
                        />
                        <Button
                            variant='primary'
                            onClick={this.goToNext}
                            marginTop={[4, 0]}
                            width={['100%', '14.5em']}
                        >
                            {getText('next')}
                        </Button>
                    </div>
                </Grid>
            </Container>
        );
    }
}

export default wrapComponent(SelectShade, 'SelectShade');
