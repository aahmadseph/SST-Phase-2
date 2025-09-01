import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import ShippingDeliveryBasicSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/ShippingDeliveryBasicSkuItem';

function SDDSkuItem({
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
    sameDayIsAvailable,
    showQuantityPickerBasket
}) {
    return (
        <ShippingDeliveryBasicSkuItem
            item={item}
            changeMethodLabel={changeMethodLabel}
            callbacks={callbacks}
            itemDeliveryMethod={itemDeliveryMethod}
            preferredStoreInfo={preferredStoreInfo}
            preferredZipCode={preferredZipCode}
            userId={userId}
            hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
            isSignedInBIUser={isSignedInBIUser}
            isOutOfStock={isOutOfStock}
            sameDayIsAvailable={sameDayIsAvailable}
            showQuantityPickerBasket={showQuantityPickerBasket}
        />
    );
}

export default wrapFunctionalComponent(SDDSkuItem, 'SDDSkuItem');
