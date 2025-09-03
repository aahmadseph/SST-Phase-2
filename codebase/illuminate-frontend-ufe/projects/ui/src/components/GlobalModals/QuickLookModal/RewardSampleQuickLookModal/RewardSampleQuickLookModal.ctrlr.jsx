/* eslint-disable complexity */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import watch from 'redux-watch';
import store from 'Store';
import Actions from 'Actions';
import skuUtils from 'utils/Sku';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

import { colors, space, mediaQueries } from 'style/config';
import {
    Box, Button, Text, Link, Grid, Flex
} from 'components/ui';
import Modal from 'components/Modal/Modal';
import ProductBadges from 'components/Product/ProductBadges/ProductBadges';
import AddToBasketButton from 'components/AddToBasketButton';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import SizeAndItemNumber from 'components/Product/SizeAndItemNumber/SizeAndItemNumber';
import BasketUtils from 'utils/Basket';
import urlUtils from 'utils/Url';
import locationUtils from 'utils/Location';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import { supplementAltTextWithProduct } from 'utils/Accessibility';
import skuHelpers from 'utils/skuHelpers';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = BasketUtils;

class RewardSampleQuickLookModal extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isInBasket: false,
            isRewardDisabled: true
        };
    }

    componentDidMount() {
        const basketWatch = watch(store.getState, 'basket');
        this.setState({
            isInBasket: skuHelpers.isInBasket(this.props.currentSku.skuId)
        });

        skuUtils.isRewardDisabled(this.props.currentSku).then(isRewardDisabled => {
            this.setState({ isRewardDisabled });
        });

        store.subscribe(
            basketWatch(() => {
                this.setState({
                    isInBasket: skuHelpers.isInBasket(this.props.currentSku.skuId),
                    isRewardDisabled: this.props.isDisabled
                });
            }),
            this
        );
    }

    getLinkTrackingData = (platform, nextPageData = {}) => {
        const { pageName } = anaUtils.getLastAsyncPageLoadData({
            pageType: anaConsts.PAGE_TYPES.QUICK_LOOK
        });
        let linkData;

        if (platform) {
            linkData = 'cmnty:' + platform + ':product-tag-click-to-ppage';
        } else {
            linkData = 'quicklook_prod-image_click';
        }

        return {
            pageName,
            linkData,
            internalCampaign: nextPageData.linkData || linkData,
            ...nextPageData
        };
    };

    fireLinkTracking = (e, url = null, data = {}) => {
        const trackingData = this.getLinkTrackingData(data.platform, data.nextPageData);

        return url
            ? anaUtils.setNextPageDataAndRedirect(e, {
                trackingData,
                destination: url
            })
            : anaUtils.setNextPageData(trackingData);
    };

    getBrandName = () => {
        const { product, currentSku } = this.props;

        const isSample = skuUtils.isSample(currentSku);

        let brandName = '';
        const productDetails = product.productDetails;

        if (isSample) {
            if (productDetails.brand) {
                brandName = productDetails.brand.displayName;
            } else {
                brandName = currentSku.variationValue;
            }
        } else {
            brandName = currentSku.brandName ? currentSku.brandName : currentSku.rewardsInfo ? currentSku.rewardsInfo.brandName : brandName;
        }

        return brandName;
    };

    render() {
        const getText = getLocaleResourceFile(
            'components/GlobalModals/QuickLookModal/RewardSampleQuickLookModal/locales',
            'RewardSampleQuickLookModal'
        );
        const { isBirthdayGiftSkuValidationEnabled } = Sephora.configurationSettings;

        const isBIRBPage = locationUtils.isBIRBPage();

        const {
            isOpen, requestClose, imageSize, leftColWidth, currentSku, analyticsContext, rootContainerName, product, skuType
        } = this.props;
        const rewardModalQuantity = 1;

        const isSample = skuUtils.isSample(currentSku);

        const flags = [];

        if (currentSku.isGoingFast) {
            flags.push(getText('goingFast'));
        }

        if (currentSku.isLimitedQuantity) {
            flags.push(getText('limitedSupply'));
        }

        const productUrl = skuUtils.getViewDetailsUrl(currentSku, product);

        const view =
            currentSku.fullSizeProductUrl || currentSku.fullSizeSku
                ? //For tracking purposes, do not internationalize
                'view full size'
                : 'view details';
        const values = ['quicklook', product?.productDetails?.productId, view];
        const anaContext = analyticsContext || anaConsts.CONTEXT.QUICK_LOOK;
        const btnDataAt =
            currentSku.fullSizeProductUrl || currentSku.fullSizeSku
                ? Sephora.debug.dataAt('ql_view_full_size')
                : Sephora.debug.dataAt('ql_view_details');
        const freePriceText = (
            <span>
                {getText('free')}
                {isBirthdayGiftSkuValidationEnabled ? <sup>∫</sup> : null}
            </span>
        );

        const goToProductPage = (event, route) => {
            Location.navigateTo(event, route);
            store.dispatch(Actions.showFreeSamplesModal({ isOpen: false }));
            store.dispatch(Actions.showRewardsBazaarModal({ isOpen: false }));

            if (Sephora.isMobile()) {
                requestClose(true, isSample);
            } else {
                requestClose();
            }
        };

        const viewFullSizeClick = e => {
            this.fireLinkTracking(e, null, {
                nextPageData: { linkData: values.join(':') }
            });
            const redirectURL = urlUtils.addInternalTracking(productUrl, values);
            goToProductPage(e, redirectURL);
        };

        const mainActions = (
            <Flex gap={4}>
                {productUrl && (
                    <Button
                        variant='secondary'
                        block={true}
                        data-at={btnDataAt}
                        onClick={viewFullSizeClick}
                    >
                        {currentSku.fullSizeProductUrl || currentSku.fullSizeSku ? getText('viewFullSize') : getText('viewDetails')}
                    </Button>
                )}
                {isSample || (
                    <AddToBasketButton
                        block={true}
                        sku={currentSku}
                        platform={this.props.platform}
                        analyticsContext={anaContext}
                        containerTitle={rootContainerName}
                        variant={this.state.isInBasket ? ADD_BUTTON_TYPE.PRIMARY : ADD_BUTTON_TYPE.SPECIAL}
                        disabled={!this.state.isInBasket && this.state.isRewardDisabled}
                        data-at={this.state.isInBasket ? Sephora.debug.dataAt('ql_remove') : Sephora.debug.dataAt('ql_addToBasket')}
                        text={this.state.isInBasket ? getText('remove') : getText('addToBasket')}
                        isBIRBPageRewardModal={isBIRBPage}
                        quantity={rewardModalQuantity}
                    />
                )}
            </Flex>
        );

        const ProductNameComp = productUrl ? Link : Box;

        const productNameBlock = (
            <ProductNameComp
                display='block'
                href={productUrl}
                onClick={viewFullSizeClick}
                fontSize={['base', 'md']}
                lineHeight='tight'
                marginBottom={1}
            >
                <Box
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('ql_brand')}
                >
                    {this.getBrandName()}
                </Box>
                {isSample || <div data-at={Sephora.debug.dataAt('ql_name')}>{currentSku.productName}</div>}
            </ProductNameComp>
        );

        return (
            <Modal
                isOpen={isOpen}
                onDismiss={requestClose}
                dataAt='quick_look_modal'
                width={4}
            >
                <Modal.Header>
                    <Modal.Title>
                        <Box css={styles.smuiOnly}>{getText('productPreview')}</Box>
                        <Box css={styles.lguiOnly}>{getText('quickLook')}</Box>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body display={[null, 'flex']}>
                    <Grid
                        textAlign={['center', null]}
                        width={[null, leftColWidth]}
                    >
                        <Box css={styles.smuiOnly}>{productNameBlock}</Box>
                        <Box position='relative'>
                            <Box
                                href={productUrl}
                                marginX='auto'
                                maxWidth={imageSize}
                                onClick={viewFullSizeClick}
                            >
                                <ProductImage
                                    disableLazyLoad={true}
                                    id={currentSku.skuId}
                                    size={imageSize}
                                    skuImages={currentSku.skuImages}
                                    altText={supplementAltTextWithProduct(currentSku, product, skuType)}
                                />
                            </Box>
                            <ProductBadges
                                left={0}
                                sku={currentSku}
                            />
                        </Box>
                    </Grid>
                    <Grid
                        display='flex'
                        flexDirection='column'
                        width={[null, 'fill']}
                        flex={[null, 1]}
                    >
                        <div>
                            <Box css={styles.lguiOnly}>{productNameBlock}</Box>
                            <SizeAndItemNumber
                                fontSize='xs'
                                sku={currentSku}
                                marginTop={1}
                                marginBottom={3}
                            />
                            <ProductVariation
                                fontSize='xs'
                                product={product}
                                {...skuUtils.getProductVariations({ sku: currentSku })}
                            />
                            <Box
                                lineHeight='none'
                                letterSpacing={1}
                                fontWeight='bold'
                                fontSize='xs'
                                marginTop={3}
                                css={{ textTransform: 'uppercase' }}
                                data-at={Sephora.debug.dataAt('ql_flags')}
                            >
                                {flags.map((flag, index) => {
                                    const flagStyle =
                                        index > 0
                                            ? {
                                                borderLeftWidth: 1,
                                                borderColor: colors.midGray,
                                                marginLeft: space[2],
                                                paddingLeft: space[2]
                                            }
                                            : {};

                                    return (
                                        <Text
                                            key={index.toString()}
                                            color={flag === 'New' ? 'black' : 'red'}
                                            css={flagStyle}
                                        >
                                            {flag}
                                        </Text>
                                    );
                                })}
                            </Box>

                            {currentSku.ingredientDesc && !isSample && (
                                <Box
                                    marginTop={3}
                                    dangerouslySetInnerHTML={{
                                        __html: currentSku.ingredientDesc
                                    }}
                                />
                            )}

                            <Box
                                fontSize='md'
                                lineHeight='tight'
                                marginTop={4}
                            >
                                {currentSku.biType && (
                                    <Box fontWeight='bold'>{skuUtils.isFree(currentSku) ? freePriceText : currentSku?.biType?.toLowerCase()}</Box>
                                )}
                                {currentSku.valuePrice && <span data-at={Sephora.debug.dataAt('ql_price_list')}>{currentSku.valuePrice}</span>}
                            </Box>
                        </div>
                        <Box
                            marginTop='auto'
                            paddingTop={6}
                            css={styles.lguiOnly}
                        >
                            {mainActions}
                        </Box>
                    </Grid>
                </Modal.Body>
                <Modal.Footer css={styles.smuiOnly}>{mainActions}</Modal.Footer>
            </Modal>
        );
    }
}

const styles = {
    smuiOnly: {
        [mediaQueries.sm]: {
            display: 'none'
        }
    },
    lguiOnly: {
        display: 'none',
        [mediaQueries.sm]: {
            display: 'block'
        }
    }
};

export default wrapComponent(RewardSampleQuickLookModal, 'RewardSampleQuickLookModal');
