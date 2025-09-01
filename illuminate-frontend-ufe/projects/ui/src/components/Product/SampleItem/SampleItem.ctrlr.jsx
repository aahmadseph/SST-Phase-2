import React from 'react';
import store from 'Store';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Flex, Text } from 'components/ui';
import ProductDisplayName from 'components/Product/ProductDisplayName/ProductDisplayName';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductQuicklook from 'components/Product/ProductQuicklook/ProductQuicklook';
import AddToBasketButton from 'components/AddToBasketButton';
import basketUtils from 'utils/Basket';
import Tooltip from 'components/Tooltip/Tooltip';
import urlUtils from 'utils/Url';
import anaConsts from 'analytics/constants';
import { getImageAltText } from 'utils/Accessibility';
import languageLocale from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import orderUtils from 'utils/Order';
import skuHelpers from 'utils/skuHelpers';

const ADD_BUTTON_TYPE = basketUtils.ADD_TO_BASKET_TYPES;

const getText = languageLocale.getLocaleResourceFile('components/Product/SampleItem/locales', 'SampleItem');

class SampleItem extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            hover: false,
            isInBasket: false,
            isSamplesMax: false
        };
    }

    /* eslint-disable-next-line complexity */
    render() {
        const {
            type, isShowAddFullSize, containerTitle, rootContainerName, analyticsContext, isReplacementOrder, isRwdBasketPage
        } = this.props;

        const isLink = this.props.targetUrl && this.props.isLink;

        const Comp = isLink ? 'a' : 'div';

        const currentSku = Object.assign({}, this.props);
        const product = currentSku.primaryProduct || currentSku.fullSizeProduct || {};

        const getDataAtString = () => {
            if (this.state.isInBasket) {
                return 'remove_btn';
            } else {
                return 'add_to_basket_btn';
            }
        };

        const getButtonText = () => {
            if (isShowAddFullSize) {
                return getText('addFullSize');
            } else if (this.state.isInBasket) {
                return getText('remove');
            } else if (this.props.isSamplesPage) {
                return getText('addToBasket');
            } else {
                return getText('add');
            }
        };

        const onHoverOn = !Sephora.isTouch ? this.hoverOn : null;
        const onHoverOff = !Sephora.isTouch ? this.hoverOff : null;

        const brandName = isShowAddFullSize ? currentSku.variationValue : null;
        const productName = isShowAddFullSize ? currentSku.productName : currentSku.variationValue;

        const altText = getImageAltText(currentSku, type);

        return (
            <Flex
                is={Comp}
                flexDirection='column'
                width='100%'
                textAlign={isRwdBasketPage ? 'left' : 'center'}
                onMouseEnter={onHoverOn}
                alignItems={isRwdBasketPage ? 'flex-start' : null}
                justifyContent='space-between'
                onFocus={onHoverOn}
                onMouseLeave={onHoverOff}
                onBlur={onHoverOff}
                aria-label={brandName ? `${brandName} ${productName}` : productName}
                href={
                    isLink
                        ? urlUtils.addInternalTracking(currentSku.targetUrl, [currentSku.rootContainerName, currentSku.productId, 'product'])
                        : null
                }
                data-at={Sephora.debug.dataAt('sample_item')}
            >
                <div>
                    <Box
                        marginX='auto'
                        marginBottom={3}
                        position='relative'
                        maxWidth={currentSku.imageSize}
                    >
                        {Sephora.isDesktop() && this.props.isToolTipEnabled ? (
                            <Tooltip
                                isFixed={true}
                                content={currentSku.variationValue}
                            >
                                <div>
                                    <ProductImage
                                        id={currentSku.skuId}
                                        size={isRwdBasketPage ? [164, 160] : currentSku.imageSize}
                                        skuImages={currentSku.skuImages}
                                        altText={altText}
                                    />
                                </div>
                            </Tooltip>
                        ) : (
                            <ProductImage
                                id={currentSku.skuId}
                                size={isRwdBasketPage ? [164, 160] : currentSku.imageSize}
                                skuImages={currentSku.skuImages}
                                altText={altText}
                            />
                        )}
                        <ProductQuicklook
                            isShown={this.state.hover}
                            sku={currentSku}
                            rootContainerName={currentSku.rootContainerName}
                            productStringContainerName={anaConsts.COMPONENT_TITLE.SKUGRID}
                            showQuickLookOnMobile={true}
                            dataAt={Sephora.debug.dataAt('sample_ql_btn')}
                            buttonText={getText('viewLarger')}
                        />
                    </Box>
                    {(Sephora.isMobile() || isShowAddFullSize || this.props.showProductName || this.props.isPastPurchaseItem) && (
                        <Box paddingTop={this.props.isPastPurchaseItem ? 3 : null}>
                            <ProductDisplayName
                                numberOfLines={isShowAddFullSize ? 3 : null}
                                productName={productName}
                                brandName={brandName}
                                isHovered={this.state.hover && isLink}
                                isBold={this.props.isBoldProductName}
                                isRwdBasketPage={isRwdBasketPage}
                            />
                        </Box>
                    )}
                </div>
                <div>
                    {(Sephora.isMobile() || isShowAddFullSize || this.props.showProductName || this.props.isPastPurchaseItem) && isRwdBasketPage && (
                        <Text
                            is='p'
                            marginTop={2}
                            marginBottom={4}
                            fontSize={'md'}
                            fontWeight={'bold'}
                            lineHeight='tight'
                            children={getText('free')}
                        />
                    )}
                    {this.props.isPastPurchaseItem && (
                        <Box
                            fontSize='sm'
                            fontWeight='bold'
                            marginTop={1}
                            lineHeight='tight'
                        >
                            {currentSku.listPrice}
                        </Box>
                    )}
                    {/* for past purchase carousel, samples without full size sku don't display a button */}
                    {(!this.props.isPastPurchaseItem || isShowAddFullSize) && (
                        <Box paddingBottom={1}>
                            <AddToBasketButton
                                size={this.props.buttonSize}
                                analyticsContext={analyticsContext}
                                samplePanel={this.props.samplePanel}
                                productName={productName}
                                productId={product.productId}
                                product={{
                                    ...product,
                                    displayName: productName
                                }}
                                sku={isShowAddFullSize ? currentSku.fullSizeSku : currentSku}
                                variant={this.state.isInBasket && !isRwdBasketPage ? ADD_BUTTON_TYPE.LINK : ADD_BUTTON_TYPE.SECONDARY}
                                disabled={!isShowAddFullSize && !this.state.isInBasket && this.state.isSamplesMax}
                                onlyUseTextProp={getButtonText()}
                                rootContainerName={rootContainerName}
                                containerTitle={containerTitle}
                                isAddFullSize={isShowAddFullSize}
                                data-at={Sephora.debug.dataAt(getDataAtString())}
                                isReplacementOrder={isReplacementOrder}
                                isRwdBasketPage={isRwdBasketPage}
                                isAddButton={true}
                            />
                        </Box>
                    )}
                </div>
            </Flex>
        );
    }

    componentDidMount() {
        if (this.props.isReplacementOrder) {
            store.setAndWatch('order.orderDetails', this, () => {
                this.setState({
                    isInBasket: orderUtils.isItemInOrder(this.props.skuId),
                    isSamplesMax: this.isSamplesMaxInOrder()
                });
            });
        } else {
            store.setAndWatch('basket', this, () => {
                this.setState({
                    isInBasket: skuHelpers.isInBasket(this.props.skuId),
                    isSamplesMax: this.isSamplesMax()
                });
            });
        }
    }

    componentDidUpdate(prevProps) {
        // Only update if the relevant props have changed
        if (this.props.numberOfSamplesInBasket !== prevProps.numberOfSamplesInBasket) {
            this.setState({
                isSamplesMax: this.isSamplesMax()
            });
        }
    }

    hoverOn = () => {
        this.setState({ hover: true });
    };

    hoverOff = () => {
        this.setState({ hover: false });
    };

    isSamplesMax = () => {
        // numberOfSamplesInBasket is typeof number
        const samples = basketUtils.getBasketSamples();
        const filteredSamples = skuUtils.getFilteredSamples(samples);
        const samplesInBasket = this.props.numberOfSamplesInBasket || filteredSamples.length;

        return samplesInBasket >= Number(this.props.maxSampleQty);
    };

    isSamplesMaxInOrder = () => {
        return orderUtils.getItemsByType(skuUtils.skuTypes.SAMPLE).length >= this.props.maxSampleQty;
    };
}

export default wrapComponent(SampleItem, 'SampleItem', true);
