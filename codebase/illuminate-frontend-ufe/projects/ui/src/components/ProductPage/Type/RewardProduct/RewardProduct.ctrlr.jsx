import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Fragment } from 'react';
import store from 'Store';
import {
    Text, Grid, Box, Icon
} from 'components/ui';
import Price from 'components/ProductPage/Price/Price';
import DisplayName from 'components/ProductPage/DisplayName/DisplayName';
import CallToAction from 'components/ProductPage/CallToAction';
import OnlineOnly from 'components/ProductPage/OnlineOnly/OnlineOnly';
import Info from 'components/ProductPage/Info';
import LayoutTop from 'components/ProductPage/LayoutTop/LayoutTop';
import localeUtils from 'utils/LanguageLocale';
import profileApi from 'services/api/profile';
import productActions from 'actions/ProductActions';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';

const getText = text => localeUtils.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

class RewardProduct extends BaseClass {
    state = {};

    constructor(props) {
        super(props);
        this.isSkuReady = false;
        store.setAndWatch(
            'basket',
            this,
            (newBasket, prevBasket) => {
                if (newBasket.basket.netBeautyBankPointsAvailable !== prevBasket.basket.netBeautyBankPointsAvailable) {
                    bindingMethods.setUserPropsWithCurrentData();
                }
            },
            this
        );
        store.setAndWatch('user.preferredStoreInfo', this, null, store.STATE_STRATEGIES.DIRECT_INIT);
        store.setAndWatch({ 'page.product': 'currentProduct' }, this, null, store.STATE_STRATEGIES.DIRECT_INIT);
        this.props.processSkuId(this);
    }

    componentDidMount() {
        store.setAndWatch('basket.items', this, (items, oldItems) => {
            if (items && oldItems) {
                const { currentProduct } = this.state;
                const productId = currentProduct.productId || currentProduct?.productDetails?.productId;

                profileApi.getUserSpecificProductDetails(productId).then(productData => {
                    store.dispatch(productActions.updateCurrentUserSpecificProduct(productData));
                });
            }
        });
    }

    render() {
        const { currentProduct, preferredStoreInfo } = this.state;

        const { currentSku, productDetails = {} } = currentProduct;

        const { type, biType, rewardSubType, listPrice } = currentSku;

        const aboutDescription = productDetails.longDescription || productDetails.shortDescription || currentProduct.shortDescription;
        const faqDescription = productDetails.suggestedUsage || currentProduct.suggestedUsage;

        return (
            <div className={!this.isSkuReady ? 'isDefault' : null}>
                <LayoutTop
                    sku={currentSku}
                    product={currentProduct}
                    hideBreadcrumbs={true}
                    content={{
                        top: (
                            <Fragment>
                                <DisplayName
                                    product={{
                                        brand: productDetails.brand || currentProduct.brand,
                                        displayName: productDetails.displayName || currentProduct.displayName
                                    }}
                                />
                                <Price
                                    sku={{
                                        type,
                                        biType,
                                        rewardSubType,
                                        listPrice
                                    }}
                                />
                            </Fragment>
                        ),
                        bottom: (
                            <Grid gap={[null, null, 5]}>
                                <Grid gap={2}>
                                    {preferredStoreInfo && (
                                        <Box
                                            lineHeight='tight'
                                            backgroundColor='nearWhite'
                                            borderRadius={2}
                                            padding={[3, 4]}
                                        >
                                            <Grid
                                                lineHeight='tight'
                                                columns='1fr auto'
                                                alignItems='center'
                                            >
                                                <div>
                                                    {getText(preferredStoreInfo.isRopisable ? 'reserveNotAvailable' : 'pickUpNotAvailable')}
                                                    <Text
                                                        marginTop={1}
                                                        display='block'
                                                        color='gray'
                                                        fontSize='sm'
                                                    >
                                                        {getText('pickUpNotOfferedForItem')}
                                                    </Text>
                                                </div>
                                                <Icon
                                                    css={{ alignSelf: 'flex-start' }}
                                                    color='gray'
                                                    name='store'
                                                />
                                            </Grid>
                                        </Box>
                                    )}
                                    {currentSku && currentSku.isOnlineOnly && <OnlineOnly />}
                                </Grid>
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
                        shouldTruncate={false}
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
                    />
                )}
            </div>
        );
    }
}

RewardProduct.prototype.shouldUpdateStateOn = [
    'currentProduct.currentSku.actionFlags',
    'currentProduct.currentSku.skuId',
    'currentProduct.productDetails.productId',
    'currentProduct.currentProductUserSpecificDetails'
];

export default wrapComponent(RewardProduct, 'RewardProduct', true);
