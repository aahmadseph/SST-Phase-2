/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Text } from 'components/ui';
import CartLayout from 'components/RwdBasket/Carts/CartLayout/CartLayout';
import TextZone from 'components/RwdBasket/Carts/StandardCart/TextZone/TextZone';
import ShippingDeliveryBasicSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/ShippingDeliveryBasicSkuItem';
import GwpSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/GwpSkuItem';
import SkuItemLayout from 'components/RwdBasket/Carts/CartLayout/SkuItem/SkuItemLayout';
import ChangeMethodVariantBox from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodVariantBox';
import ConfirmationBox from 'components/RwdBasket/Carts/CartLayout/ConfirmationBox/ConfirmationBox';
import RewardSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/RewardSkuItem';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';

import getCallbacks from 'components/RwdBasket/Carts/CartLayout/SkuItem/Buttons/getCallbacks';
import compConstants from 'components/constants';
import BasketBindings from 'analytics/bindingMethods/pages/basket/BasketBindings';

const { getLocaleResourceFile } = localeUtils;
const allCallbacks = getCallbacks({ isBopis: false });

function StandardSkuItem({
    item,
    changeMethodLabel,
    callbacks,
    itemDeliveryMethod,
    preferredStoreInfo,
    preferredZipCode,
    userId,
    hasMetFreeShippingThreshhold,
    isSignedInBIUser,
    isOutOfStock,
    showQuantityPickerBasket
}) {
    return (
        <ShippingDeliveryBasicSkuItem
            showQuantityPickerBasket={showQuantityPickerBasket}
            item={item}
            callbacks={callbacks}
            changeMethodLabel={changeMethodLabel}
            itemDeliveryMethod={itemDeliveryMethod}
            preferredStoreInfo={preferredStoreInfo}
            preferredZipCode={preferredZipCode}
            userId={userId}
            hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
            isSignedInBIUser={isSignedInBIUser}
            isOutOfStock={isOutOfStock}
        />
    );
}

function SampleSkuItem({ item, changeMethodLabel, callbacks: { onDelete } }) {
    const getText = getLocaleResourceFile('components/RwdBasket/Carts/StandardCart/locales', 'StandardCart');
    let abovePriceContent = null;
    let priceLabel = getText('freeSample');

    if (skuUtils.isPDPSample(item.sku)) {
        abovePriceContent = (
            <>
                <Text color={colors.gray}>{getText('item', [item.sku.skuId])}</Text>
                <Text
                    display={'block'}
                    fontSize={['xs', 'sm']}
                    marginTop={'2px'}
                    lineHeight={'tight'}
                    data-at={Sephora.debug.dataAt('item_variation_type')}
                >{`${item.sku.variationTypeDisplayName}: ${item.sku.variationValue}`}</Text>
            </>
        );

        priceLabel = getText('freePDPSample');
    }

    return (
        <SkuItemLayout
            item={item}
            onDelete={onDelete}
            isOutOfStock={item.sku.isOutOfStock}
            isNotFinalSale={true}
            price={priceLabel}
            changeMethodLabel={changeMethodLabel}
            rightLGUISection={<ChangeMethodVariantBox availableForOnlyOneOption />}
            abovePriceContent={abovePriceContent}
        />
    );
}

function GiftSkuItem({ item, changeMethodLabel, callbacks: { onDelete } }) {
    const getText = getLocaleResourceFile('components/RwdBasket/Carts/StandardCart/locales', 'StandardCart');

    return (
        <SkuItemLayout
            item={item}
            onDelete={onDelete}
            isOutOfStock={item.sku.isOutOfStock}
            isNotFinalSale={true}
            changeMethodLabel={changeMethodLabel}
            abovePriceContent={
                <>
                    <Text color={colors.gray}>{getText('item', [item.sku.skuId])}</Text>
                    <Text
                        display={'block'}
                        fontSize={['xs', 'sm']}
                        marginTop={'2px'}
                        lineHeight={'tight'}
                        data-at={Sephora.debug.dataAt('item_variation_type')}
                    >{`${item.sku.variationTypeDisplayName}: ${item.sku.variationValue}`}</Text>
                </>
            }
            rightLGUISection={<ChangeMethodVariantBox availableForOnlyOneOption />}
        />
    );
}

class StandardCart extends BaseClass {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.errors.standardRewardErrors.forEach(error => {
            BasketBindings.triggerRewardErrorAnalytics(this.props.items, error);
        });
    }

    skuComponentMapper = (getText, itemErrorMap) => {
        const {
            items,
            itemDeliveryMethod,
            preferredStoreInfo,
            preferredZipCode,
            userId,
            hasMetFreeShippingThreshhold,
            isSignedInBIUser,
            isOmniRewardEnabled,
            showQuantityPickerBasket
        } = this.props;

        return items.map((item, index) => {
            item.error = itemErrorMap.get(item.commerceId);
            item.enablePageRenderTracking = index < compConstants.PAGE_RENDER_TRACKING_LIMIT;

            const props = {
                key: item.sku.skuId,
                item: item,
                changeMethodLabel: getText('getItSooner'),
                callbacks: {
                    ...allCallbacks
                },
                itemDeliveryMethod,
                preferredStoreInfo,
                preferredZipCode,
                userId,
                hasMetFreeShippingThreshhold,
                isSignedInBIUser,
                isOutOfStock: item.sku.isOutOfStock,
                isOmniRewardEnabled,
                showQuantityPickerBasket
            };

            if (skuUtils.isStandardProduct(item.sku)) {
                return <StandardSkuItem {...props} />;
            }

            if (skuUtils.isBiReward(item.sku)) {
                return <RewardSkuItem {...props} />;
            }

            if (skuUtils.isSample(item.sku)) {
                return <SampleSkuItem {...props} />;
            }

            if (skuUtils.isGwp(item.sku)) {
                return <GwpSkuItem {...props} />;
            }

            if (skuUtils.isGiftCard(item.sku)) {
                return <GiftSkuItem {...props} />;
            }

            throw new Error(`Shipping and Delivery sku mapper received sku of type: ${item.sku.type}`);
        });
    };

    showHeadlineError = () => {
        const { dcBasketErrorsExist, items, hasErrorZone1Message } = this.props;
        const hasOOSItems = item => item.sku.isOutOfStock;
        const showOutOfStockHeadline = items.some(hasOOSItems) && !hasErrorZone1Message;

        return dcBasketErrorsExist || showOutOfStockHeadline;
    };

    render() {
        const {
            totalQuantity,
            hasMetFreeShippingThreshhold,
            isSignedInBIUser,
            errors,
            itemErrorMap,
            confirmationBoxInfo,
            infoModalCallbacks,
            itemDeliveryMethod,
            showBasketGreyBackground,
            backgroundColor
        } = this.props;
        const getText = getLocaleResourceFile('components/RwdBasket/Carts/StandardCart/locales', 'StandardCart');

        return (
            <CartLayout
                {...(showBasketGreyBackground && { backgroundColor: backgroundColor })}
                title={getText('getItShippedTitle', [totalQuantity])}
                infoModalCallbacks={infoModalCallbacks}
                iconName={this.showHeadlineError() ? 'alert' : 'truck'}
                iconColor={this.showHeadlineError() ? 'red' : null}
                confirmationBox={
                    <ConfirmationBox
                        {...confirmationBoxInfo}
                        onUndoChangeMethod={allCallbacks.onUndoChangeMethod}
                        itemDeliveryMethod={itemDeliveryMethod}
                    />
                }
                skuItemComponents={this.skuComponentMapper(getText, itemErrorMap)}
                errors={errors}
                itemErrorMap={itemErrorMap}
                textZone={
                    <TextZone
                        hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
                        isSignedInBIUser={isSignedInBIUser}
                    />
                }
            />
        );
    }
}

export default wrapComponent(StandardCart, 'StandardCart', true);
