/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import skuUtils from 'utils/Sku';
import Authentication from 'Authentication';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import skuHelpers from 'utils/skuHelpers';
import { HEADER_VALUE } from 'constants/authentication';
import myListsUtils from 'utils/MyLists';

const anonymous = userUtils.isAnonymous;

class ProductLove extends BaseClass {
    state = {
        hover: false,
        isAnonymous: false
    };

    render() {
        const childProps = {
            handleOnClick: this.handleOnClick,
            mouseEnter: this.mouseEnter,
            mouseLeave: this.mouseLeave,
            isActive: skuHelpers.isSkuLoved(this.props.sku.skuId),
            hover: this.state.hover,
            sku: this.props.sku,
            skuLoveData: {
                loveSource: this.props.loveSource,
                skuId: this.props.sku.skuId,
                productId: this.props.productId,
                isOnlyFewLeft: this.props.sku.isOnlyFewLeft || false
            },
            isAnonymous: this.state.isAnonymous
        };

        if (typeof this.props.children === 'function') {
            return this.props.children(childProps);
        }

        return (
            <React.Fragment>
                {React.Children.map(this.props.children, (child, index) =>
                    React.cloneElement(child, {
                        key: index.toString(),
                        ...childProps
                    })
                )}
            </React.Fragment>
        );
    }

    componentDidMount() {
        this.setState({ isAnonymous: anonymous() });
    }

    handleLoveRequest = skuLoveData => {
        const {
            sku, loveSource, customSetsChoices, analyticsContext, currentProduct, productId, parentCategoryName, categoryName, basket
        } =
            this.props;

        const itemCount = basket?.itemCount || 0;
        const pickupBasketItemCount = basket?.pickupBasket?.itemCount || 0;
        const totalBasketCount = itemCount + pickupBasketItemCount;
        const analyticsData = {
            productName: currentProduct?.displayName || sku?.productName,
            preferredStoreId: userUtils.getPreferredStoreId(),
            preferredZipCode: userUtils.getZipCode(),
            listPrice: sku?.listPrice,
            brandName: currentProduct?.brandName || sku?.brandName,
            categoryName,
            parentCategoryName,
            currency: localeUtils.ISO_CURRENCY[userUtils.getShippingCountry().countryCode],
            quantity: 1,
            skuVariationType: sku.skuType || sku.variationType,
            skuVariationValue: sku.variationValue,
            sku: skuLoveData,
            productId,
            isNew: sku?.isNew,
            isOutOfStock: sku?.isOutOfStock,
            totalBasketCount
        };

        if (!skuHelpers.isSkuLoved(sku.skuId)) {
            const lovedCallback = () => {
                const eventData = {
                    data: {
                        sku: sku.skuId,
                        productId: currentProduct?.productId || '',
                        url: ''
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
                            'product_id': skuLoveData.productId
                        });
                });
            };

            if (customSetsChoices) {
                this.props.addLove(
                    [skuLoveData].concat(
                        customSetsChoices.map(choice => ({
                            skuId: choice.skuId,
                            loveSource: loveSource,
                            productId: skuLoveData.productId
                        }))
                    ),
                    lovedCallback
                );
            } else {
                this.props.addLove(skuLoveData, lovedCallback);
            }

            //Analytics
            const prop55andPev2 = customSetsChoices ? 'product:custom set:add all to loves list' : 'love';
            processEvent.preprocess.commonInteractions({
                context: analyticsContext,
                linkName: prop55andPev2,
                actionInfo: prop55andPev2,
                eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_27],
                specificEventName: anaConsts.EVENT_NAMES.ADD_TO_LOVES,
                ...analyticsData
            });
        } else {
            if (customSetsChoices) {
                const validLoves = this.props.shoppingListIds.filter(id => customSetsChoices.findIndex(choice => choice.skuId === id) >= 0);
                this.props.removeLove(
                    [sku.skuId].concat(validLoves),
                    () => {},
                    () => {},
                    skuLoveData.productId
                );
            } else {
                this.props.removeLove(
                    sku.skuId,
                    () => {},
                    () => {},
                    skuLoveData.productId
                );
            }

            //Analytics
            const prop55andPev2 = customSetsChoices ? 'product:custom set:remove all from loves list' : 'un-love';
            processEvent.preprocess.commonInteractions({
                context: analyticsContext,
                linkName: prop55andPev2,
                actionInfo: prop55andPev2,
                eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_28],
                specificEventName: anaConsts.EVENT_NAMES.REMOVE_FROM_LOVES,
                ...analyticsData
            });
        }
    };

    handleOnClick = (e, skuLoveData) => {
        e.preventDefault();
        e.stopPropagation();
        const isAnonymous = anonymous();
        const { imageProps } = this.props;
        let isSkuLoved;
        const { analyticsContext } = this.props;
        const analyticsData = {
            context: analyticsContext,
            nextPageContext: analyticsContext
        };
        const isSharableListEnabled = myListsUtils.isSharableListEnabled();

        Authentication.requireAuthentication(null, null, analyticsData, null, false, HEADER_VALUE.USER_CLICK)
            .then(() => {
                isSkuLoved = skuHelpers.isSkuLoved(this.state.skuId);

                // Don't handle love request if user was anonymous and “loved” an item that was
                // already loved by her, since this would mark the product as unloved.
                if (!isAnonymous || !isSkuLoved) {
                    if (!isSharableListEnabled) {
                        this.handleLoveRequest(skuLoveData);
                    } else {
                        this.props.showMyListsModal(true);
                        this.props.setSkuLoveData(skuLoveData);
                        this.props.setSkuLoveImageData(imageProps);
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

export default wrapComponent(ProductLove, 'ProductLove', true);
