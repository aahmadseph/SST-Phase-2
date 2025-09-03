/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import CartLayout from 'components/RwdBasket/Carts/CartLayout/CartLayout';
import AcceleratedPromotionTerms from 'components/RwdBasket/Carts/AutoreplenishCart/BelowProductPrice/AcceleratedPromotionTerms';
import DeliveryFrequency from 'components/RwdBasket/Carts/AutoreplenishCart/BelowProductPrice/DeliveryFrequency';
import TextZone from 'components/RwdBasket/Carts/AutoreplenishCart/TextZone/TextZone';
import ShippingDeliveryBasicSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/ShippingDeliveryBasicSkuItem';
import ConfirmationBox from 'components/RwdBasket/Carts/CartLayout/ConfirmationBox/ConfirmationBox';

import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';

import getCallbacks from 'components/RwdBasket/Carts/CartLayout/SkuItem/Buttons/getCallbacks';
import compConstants from 'components/constants';

const allCallbacks = getCallbacks({ isBopis: false });
const { getLocaleResourceFile } = localeUtils;

function AutoReplenishSkuItem({
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
            item={item}
            changeMethodLabel={changeMethodLabel}
            callbacks={callbacks}
            belowPriceContent={[DeliveryFrequency, AcceleratedPromotionTerms]}
            itemDeliveryMethod={itemDeliveryMethod}
            preferredStoreInfo={preferredStoreInfo}
            preferredZipCode={preferredZipCode}
            userId={userId}
            hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
            isSignedInBIUser={isSignedInBIUser}
            isOutOfStock={isOutOfStock}
            showQuantityPickerBasket={showQuantityPickerBasket}
        />
    );
}

class AutoreplenishCart extends BaseClass {
    constructor(props) {
        super(props);
    }

    skuComponentMapper = (getText, itemErrorMap) => {
        const {
            items,
            itemDeliveryMethod,
            preferredStoreInfo,
            preferredZipCode,
            userId,
            hasMetFreeShippingThreshhold,
            isSignedIn,
            isSignedInBIUser,
            showQuantityPickerBasket
        } = this.props;

        return items.map((item, index) => {
            item.error = itemErrorMap.get(item.commerceId);
            item.enablePageRenderTracking = index < compConstants.PAGE_RENDER_TRACKING_LIMIT;

            const props = {
                key: item.sku.skuId,
                item: item,
                changeMethodLabel: getText('changeMethod'),
                callbacks: {
                    ...allCallbacks,
                    onQtyUpdate: null
                },
                itemDeliveryMethod,
                preferredStoreInfo,
                preferredZipCode,
                userId,
                hasMetFreeShippingThreshhold,
                isSignedIn,
                isSignedInBIUser,
                showQuantityPickerBasket,
                isOutOfStock: item.sku.isOutOfStock
            };

            if (skuUtils.isStandardProduct(item.sku)) {
                return <AutoReplenishSkuItem {...props} />;
            }

            throw new Error(`Shipping and Delivery sku mapper received sku of type: ${item.sku.type}`);
        });
    };

    showHeadlineError = () => {
        const { items, hasErrorZone1Message } = this.props;
        const hasOOSItems = item => item.sku.isOutOfStock;

        return items.some(hasOOSItems) && !hasErrorZone1Message;
    };

    render() {
        const {
            totalQuantity,
            isSignedIn,
            totalAnnualReplenishmentDiscount,
            firstName,
            hasAcceleratedPromotionItems,
            errors,
            itemErrorMap,
            confirmationBoxInfo,
            infoModalCallbacks
        } = this.props;

        const getText = getLocaleResourceFile('components/RwdBasket/Carts/AutoreplenishCart/locales', 'AutoreplenishCart');

        return (
            <CartLayout
                title={getText('autoReplenishTitle', [totalQuantity])}
                infoModalCallbacks={infoModalCallbacks}
                iconName={this.showHeadlineError() ? 'alert' : 'autoReplenish'}
                iconColor={this.showHeadlineError() ? 'red' : null}
                confirmationBox={<ConfirmationBox {...confirmationBoxInfo} />}
                skuItemComponents={this.skuComponentMapper(getText, itemErrorMap)}
                errors={errors}
                textZone={
                    totalAnnualReplenishmentDiscount && (
                        <TextZone
                            isSignedIn={isSignedIn}
                            totalAnnualReplenishmentDiscount={totalAnnualReplenishmentDiscount}
                            firstName={firstName}
                            hasAcceleratedPromotionItems={hasAcceleratedPromotionItems}
                        />
                    )
                }
            />
        );
    }
}

export default wrapComponent(AutoreplenishCart, 'AutoreplenishCart', true);
