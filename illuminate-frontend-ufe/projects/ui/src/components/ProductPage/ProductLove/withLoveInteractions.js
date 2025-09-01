import { Component } from 'react';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';
import Authentication from 'Authentication';
import LoveActions from 'actions/LoveActions';
import processEvent from 'analytics/processEvent';
import React from 'react';
import skuUtils from 'utils/Sku';
import basketUtils from 'utils/Basket';
import store from 'store/Store';
import localeUtils from 'utils/LanguageLocale';
import skuHelpers from 'utils/skuHelpers';
import { HEADER_VALUE } from 'constants/authentication';
import myListsUtils from 'utils/MyLists';
import { getImageAltText } from 'utils/Accessibility';

const anonymous = userUtils.isAnonymous;

const withLoveInteractions = WrappedComponent => {
    class LoveInteractions extends Component {
        constructor(props) {
            super(props);

            this.state = {
                hover: false,
                isActive: false,
                pendingSku: {}
            };

            store.setAndWatch({ 'loves.shoppingListIds': 'loves' }, this, null, store.STATE_STRATEGIES.CLIENT_SIDE_DATA);
        }

        render() {
            const { currentProduct = {}, sku = {}, loveSource } = this.props;

            const { hover, isPending } = this.state;

            const isCustomSetsProduct =
                skuUtils.isCustomSetsSingleSkuProduct(currentProduct) || skuUtils.isCustomSetsGroupedSkuProduct(currentProduct);

            return (
                <WrappedComponent
                    skuLoveData={{
                        loveSource,
                        skuId: sku.skuId,
                        productId: currentProduct.productDetails.productId,
                        isOnlyFewLeft: sku.isOnlyFewLeft
                    }}
                    isActive={this.isActive(sku.skuId)}
                    isCustomSetsProduct={isCustomSetsProduct}
                    handleOnClick={isPending ? () => {} : this.handleOnClick}
                    mouseEnter={this.mouseEnter}
                    mouseLeave={this.mouseLeave}
                    hover={hover}
                />
            );
        }

        isActive = skuId => {
            const { pendingSku = {} } = this.state;

            if (skuId === pendingSku.skuId) {
                return pendingSku.status === 'loved';
            }

            return skuHelpers.isSkuLoved(skuId);
        };

        setPendingSku = ({ isPending = false, skuId, status } = {}) => {
            this.setState({
                isPending,
                pendingSku: {
                    skuId,
                    status
                }
            });
        };

        showMyListsModal = isOpen => {
            store.dispatch(LoveActions.showMyListsModal(isOpen));
        };

        setSkuLoveData = skuLoveData => {
            store.dispatch(LoveActions.setSkuLoveData(skuLoveData));
        };

        setSkuLoveImageData = imageProps => {
            store.dispatch(LoveActions.setSkuLoveImageData(imageProps));
        };

        handleLoveRequest = skuLoveData => {
            const {
                sku = {}, loveSource, customSetsChoices, analyticsContext, currentProduct, quantity
            } = this.props;

            const currency = localeUtils.ISO_CURRENCY[userUtils.getShippingCountry().countryCode];
            const totalBasketCount = basketUtils.getTotalBasketCount();

            const cleanupCallback = () => {
                this.setPendingSku({});
            };

            if (!skuHelpers.isSkuLoved(sku.skuId)) {
                this.setPendingSku({
                    isPending: true,
                    skuId: sku.skuId,
                    status: 'loved'
                });

                const lovedCallback = () => {
                    const eventData = {
                        data: {
                            sku: sku.skuId,
                            productId: currentProduct?.productId || '',
                            url: sku?.url || ''
                        }
                    };

                    processEvent.process(anaConsts.ADD_TO_LOVES_LIST, eventData);

                    Sephora.analytics.promises.styleHaulReady.then(() => {
                        window.analytics &&
                            // prettier-ignore
                            window.analytics.track('AddToWishlist', {
                                value: skuUtils.parsePrice(sku.listPrice) * 100,
                                currency: 'USD',
                                'product_name': sku.displayName,
                                'product_type': sku.type,
                                'product_id': sku.productId
                            });
                    });
                };

                if (customSetsChoices) {
                    store.dispatch(
                        LoveActions.addLove(
                            [skuLoveData].concat(
                                customSetsChoices.map(choice => {
                                    return {
                                        skuId: choice.skuId,
                                        loveSource: loveSource,
                                        productId: sku.productId
                                    };
                                }),
                                lovedCallback,
                                cleanupCallback
                            )
                        )
                    );
                } else {
                    store.dispatch(LoveActions.addLove(skuLoveData, lovedCallback, cleanupCallback));
                }

                //Analytics
                processEvent.preprocess.commonInteractions({
                    context: analyticsContext,
                    linkName: 'love',
                    actionInfo: 'love',
                    eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_27],
                    specificEventName: anaConsts.EVENT_NAMES.ADD_TO_LOVES,
                    sku: skuLoveData,
                    productId: currentProduct?.productDetails?.productId,
                    productName: currentProduct?.productDetails?.displayName,
                    preferredStoreId: userUtils.getPreferredStoreId(),
                    preferredZipCode: userUtils.getZipCode(),
                    listPrice: sku?.listPrice,
                    brandName: currentProduct?.productDetails.brand.displayName,
                    categoryName: currentProduct?.parentCategory?.displayName,
                    currency,
                    quantity,
                    skuVariationType: currentProduct?.currentSku?.variationType,
                    skuVariationValue: currentProduct?.currentSku?.variationValue,
                    isNew: currentProduct?.currentSku?.isNew || sku?.isNew,
                    isOutOfStock: currentProduct?.currentSku?.isOutOfStock || sku?.isOutOfStock,
                    totalBasketCount
                });
            } else {
                this.setPendingSku({
                    isPending: true,
                    skuId: sku.skuId,
                    status: 'un-loved'
                });

                if (customSetsChoices) {
                    const currentLoves = store.getState().loves.currentLoves;
                    const validLoves = [];

                    customSetsChoices.forEach(choice => {
                        currentLoves.filter(love => love.sku.skuId === choice.skuId).map(obj => validLoves.push(obj.sku.skuId));
                    });

                    store.dispatch(LoveActions.removeLove([sku.skuId].concat(validLoves), () => {}, cleanupCallback, sku.productId));
                } else {
                    store.dispatch(LoveActions.removeLove(sku.skuId, () => {}, cleanupCallback, skuLoveData.productId));
                }

                //Analytics
                processEvent.preprocess.commonInteractions({
                    context: analyticsContext,
                    linkName: 'un-love',
                    actionInfo: 'un-love',
                    eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_28],
                    specificEventName: anaConsts.EVENT_NAMES.REMOVE_FROM_LOVES,
                    sku: skuLoveData,
                    productId: currentProduct?.productDetails?.productId,
                    productName: currentProduct?.productDetails?.displayName,
                    preferredStoreId: userUtils.getPreferredStoreId(),
                    preferredZipCode: userUtils.getZipCode(),
                    listPrice: sku?.listPrice,
                    brandName: currentProduct?.productDetails.brand.displayName,
                    categoryName: currentProduct?.parentCategory?.displayName,
                    currency,
                    quantity,
                    skuVariationType: currentProduct?.currentSku?.variationType,
                    skuVariationValue: currentProduct?.currentSku?.variationValue,
                    isNew: currentProduct?.currentSku?.isNew || sku?.isNew,
                    isOutOfStock: currentProduct?.currentSku?.isOutOfStock || sku?.isOutOfStock,
                    totalBasketCount
                });
            }
        };

        handleOnClick = (e, skuLoveData) => {
            e.preventDefault();
            const isAnonymous = anonymous();
            let isSkuLoved;
            const { analyticsContext, sku = {} } = this.props;
            const analyticsData = {
                context: analyticsContext,
                nextPageContext: analyticsContext
            };
            const imageProps = {
                id: sku.skuId,
                skuImages: sku.skuImages,
                disableLazyLoad: true,
                altText: getImageAltText(sku)
            };
            const isSharableListEnabled = myListsUtils.isSharableListEnabled();
            Authentication.requireAuthentication(null, null, analyticsData, null, false, HEADER_VALUE.USER_CLICK)
                .then(() => {
                    isSkuLoved = skuHelpers.isSkuLoved(sku.skuId);

                    // Don't handle love request if user was anonymous and “loved” an item that was
                    // already loved by her, since this would mark the product as unloved.
                    if (!isAnonymous || !isSkuLoved) {
                        if (!isSharableListEnabled) {
                            this.handleLoveRequest(skuLoveData);
                        } else {
                            this.showMyListsModal(true);
                            this.setSkuLoveData(skuLoveData);
                            this.setSkuLoveImageData(imageProps);
                        }
                    }
                })
                .catch(() => {});
        };

        mouseEnter = e => {
            if (!Sephora.isTouch) {
                e.stopPropagation();
                this.setState({ hover: true });
            }
        };

        mouseLeave = e => {
            if (!Sephora.isTouch) {
                e.stopPropagation();
                this.setState({ hover: false });
            }
        };
    }

    LoveInteractions.displayName = `LoveInteractions(${WrappedComponent.displayName})`;

    return LoveInteractions;
};

export default withLoveInteractions;
