import React from 'react';
import { DC_BASKET_TYPES, MAIN_BASKET_TYPES, CART_BANNER_SECTION_TYPES } from 'constants/RwdBasket';
const { SAMEDAY_BASKET, AUTOREPLENISH_BASKET, STANDARD_BASKET } = DC_BASKET_TYPES;
const { DC_BASKET, BOPIS_BASKET } = MAIN_BASKET_TYPES;
const { SDU_ROUGE_INSENTIVE_BANNER, ADD_GIFT_MESSAGE_BANNER } = CART_BANNER_SECTION_TYPES;

import BOPISCart from 'components/RwdBasket/Carts/BOPISCart/BOPISCart';
import SDDCart from 'components/RwdBasket/Carts/SDDCart/SDDCart';
import StandardCart from 'components/RwdBasket/Carts/StandardCart/StandardCart';
import AutoreplenishCart from 'components/RwdBasket/Carts/AutoreplenishCart/AutoreplenishCart';
import SDURougeInsentiveBanner from 'components/RwdBasket/Banners/SDU/SDURougeInsentiveBanner';
import AddGiftMessageBanner from 'components/RwdBasket/Banners/GiftMessage/AddGiftMessageBanner';
import EmptyCart from 'components/RwdBasket/Carts/EmptyCart/EmptyCart';

function getCartComponentLists({
    cartInfo, user: { isSignedIn }, messageInfo, infoModalCallbacks, isOmniRewardEnabled, showQuantityPickerBasket
}) {
    const { cartLevelErrors, itemLevelErrors, dcBasketErrorsExist, topOfBasketErrors } = messageInfo[DC_BASKET];
    const shippingInfoModalCallbacks = infoModalCallbacks[DC_BASKET];

    const pickupInStoreBasket = [
        <BOPISCart
            key={'BOPISCart'}
            {...cartInfo[BOPIS_BASKET]}
            errors={messageInfo[BOPIS_BASKET].cartLevelErrors}
            itemErrorMap={messageInfo[BOPIS_BASKET].itemLevelErrors}
            infoModalCallbacks={infoModalCallbacks[BOPIS_BASKET]}
            isOmniRewardEnabled={isOmniRewardEnabled}
            showQuantityPickerBasket={showQuantityPickerBasket}
        />
    ];

    if (cartInfo.isShippingBasketEmpty) {
        return {
            [BOPIS_BASKET]: pickupInStoreBasket,
            [DC_BASKET]: [
                <EmptyCart
                    key={'EmptyCart'}
                    isSignedIn={isSignedIn}
                />
            ]
        };
    }

    // Cart order for SaD (INFL-1944) [SAMEDAY_BASKET, AUTOREPLENISH_BASKET, STANDARD_BASKET]
    const shippingAndDeliveryComponentList = [];

    if (cartInfo[SAMEDAY_BASKET].isAvailable) {
        shippingAndDeliveryComponentList.push(
            <SDDCart
                key={'SDDCart'}
                {...cartInfo[SAMEDAY_BASKET]}
                errors={cartLevelErrors[SAMEDAY_BASKET]}
                itemErrorMap={itemLevelErrors[SAMEDAY_BASKET]}
                infoModalCallbacks={shippingInfoModalCallbacks[SAMEDAY_BASKET]}
                sameDayIsAvailable={cartInfo[SAMEDAY_BASKET].isSDDAvailableAfterZipChange}
                hasErrorZone1Message={topOfBasketErrors?.isAvailable}
                isOmniRewardEnabled={isOmniRewardEnabled}
                showQuantityPickerBasket={showQuantityPickerBasket}
            />
        );
    }

    if (cartInfo[STANDARD_BASKET].isAvailable) {
        shippingAndDeliveryComponentList.push(
            <StandardCart
                key={'StandardCart'}
                {...cartInfo[STANDARD_BASKET]}
                errors={cartLevelErrors[STANDARD_BASKET]}
                itemErrorMap={itemLevelErrors[STANDARD_BASKET]}
                infoModalCallbacks={shippingInfoModalCallbacks[STANDARD_BASKET]}
                dcBasketErrorsExist={dcBasketErrorsExist}
                hasErrorZone1Message={topOfBasketErrors?.isAvailable}
                isOmniRewardEnabled={isOmniRewardEnabled}
                showQuantityPickerBasket={showQuantityPickerBasket}
            />
        );
    }

    // Pseudo-Carts order under STANDARD_BASKET cart [ADD_GIFT_MESSAGE_BANNER, SDU_ROUGE_INSENTIVE_BANNER]
    if (cartInfo.getTotalItemsShippingBaskets() > 0) {
        if (cartInfo[ADD_GIFT_MESSAGE_BANNER].isAvailable) {
            shippingAndDeliveryComponentList.push(
                <AddGiftMessageBanner
                    key={'AddGiftMessage'}
                    {...cartInfo[ADD_GIFT_MESSAGE_BANNER]}
                />
            );
        }

        if (cartInfo[SDU_ROUGE_INSENTIVE_BANNER].isAvailable) {
            shippingAndDeliveryComponentList.push(
                <SDURougeInsentiveBanner
                    key={'SDURougeInsentiveBanner'}
                    {...cartInfo[SDU_ROUGE_INSENTIVE_BANNER]}
                />
            );
        }
    }

    if (cartInfo[AUTOREPLENISH_BASKET].isAvailable) {
        shippingAndDeliveryComponentList.push(
            <AutoreplenishCart
                key={'AutoreplenishCart'}
                {...cartInfo[AUTOREPLENISH_BASKET]}
                errors={cartLevelErrors[AUTOREPLENISH_BASKET]}
                itemErrorMap={itemLevelErrors[AUTOREPLENISH_BASKET]}
                infoModalCallbacks={shippingInfoModalCallbacks[AUTOREPLENISH_BASKET]}
                hasErrorZone1Message={topOfBasketErrors?.isAvailable}
                showQuantityPickerBasket={showQuantityPickerBasket}
            />
        );
    }

    return {
        [BOPIS_BASKET]: pickupInStoreBasket,
        [DC_BASKET]: shippingAndDeliveryComponentList
    };
}

export { getCartComponentLists };
