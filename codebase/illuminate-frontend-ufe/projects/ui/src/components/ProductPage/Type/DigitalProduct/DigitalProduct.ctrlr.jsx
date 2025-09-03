/* eslint-disable class-methods-use-this */
import React from 'react';
import { Fragment } from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import store from 'Store';
import { Grid, Divider } from 'components/ui';
import DisplayName from 'components/ProductPage/DisplayName/DisplayName';
import Price from 'components/ProductPage/Price/Price';
import Info from 'components/ProductPage/Info';
import OnlineOnly from 'components/ProductPage/OnlineOnly/OnlineOnly';
import CallToAction from 'components/ProductPage/CallToAction';
import LayoutTop from 'components/ProductPage/LayoutTop/LayoutTop';
import mediaUtils from 'utils/Media';
import localeUtils from 'utils/LanguageLocale';

const { Media } = mediaUtils;

const getText = text => localeUtils.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

class DigitalProduct extends BaseClass {
    constructor(props) {
        super(props);

        this.isSkuReady = false;
        store.setAndWatch({ 'page.product': 'currentProduct' }, this, null, store.STATE_STRATEGIES.DIRECT_INIT);
    }

    componentDidMount() {
        this.props.processSkuId(this);
    }

    render() {
        const { currentProduct } = this.state;
        const { currentSku, productDetails = {} } = currentProduct;
        const { type, listPrice, salePrice, valuePrice } = currentSku;
        const aboutDescription = productDetails.longDescription || productDetails.shortDescription || currentProduct.shortDescription;
        const faqDescription = productDetails.suggestedUsage || currentProduct.suggestedUsage;

        return (
            <div>
                <LayoutTop
                    sku={currentSku}
                    product={currentProduct}
                    content={{
                        top: (
                            <Fragment>
                                <DisplayName
                                    sku={currentSku}
                                    product={{
                                        brand: productDetails || currentProduct,
                                        displayName: this.props.subtitle
                                    }}
                                />
                                <Price
                                    sku={{
                                        type,
                                        listPrice,
                                        salePrice,
                                        valuePrice
                                    }}
                                />
                            </Fragment>
                        ),
                        bottom: (
                            <Grid gap={[null, null, 5]}>
                                {currentSku && currentSku.isOnlineOnly ? (
                                    <OnlineOnly />
                                ) : (
                                    <Media greaterThan='sm'>
                                        <Divider />
                                    </Media>
                                )}
                                {this.isSkuReady && (
                                    <CallToAction
                                        sku={currentSku}
                                        product={currentProduct}
                                    />
                                )}
                            </Grid>
                        )
                    }}
                />
                {this.isSkuReady && aboutDescription && (
                    <Info
                        title={getText('aboutTheProduct')}
                        currentSku={currentSku}
                        description={aboutDescription}
                        dataAt='about_the_product_title'
                    />
                )}
                {this.isSkuReady && faqDescription && (
                    <Info
                        title={getText('faq')}
                        description={faqDescription}
                        dataAt='faq_title'
                    />
                )}
            </div>
        );
    }
}

export default wrapComponent(DigitalProduct, 'DigitalProduct', true);
