import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import SkuItemLayout from 'components/RwdBasket/Carts/CartLayout/SkuItem/SkuItemLayout';
import ChangeMethodVariantBox from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodVariantBox';
import ChangeMethodCore from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodCore';

function RewardSkuItem(props) {
    const {
        item,
        changeMethodLabel,
        itemDeliveryMethod,
        preferredStoreInfo,
        preferredZipCode,
        storeDetails,
        userId,
        callbacks,
        isOmniRewardEnabled
    } = props;

    const isRewardFulfillmentVariant = isOmniRewardEnabled;

    const commonProps = {
        item,
        isRewardFulfillmentVariant,
        itemDeliveryMethod,
        isDisabled: !isOmniRewardEnabled,
        // TODO: Some components refer to the same object as either storeDetails and preferredStoreInfo.
        // This requires a bigger refactor to make sure that the name is consistent across all files,
        // while at the same time not introducing new bugs.
        preferredStoreInfo: preferredStoreInfo ? preferredStoreInfo : storeDetails,
        preferredZipCode,
        userId,
        onChangeMethod: callbacks.onChangeMethod
    };

    const rightLGUISection = isRewardFulfillmentVariant ? (
        <ChangeMethodCore
            {...commonProps}
            deferRequests
            withIcon
        />
    ) : (
        <ChangeMethodVariantBox availableForOnlyOneOption />
    );

    return (
        <SkuItemLayout
            {...commonProps}
            onDelete={callbacks.onDelete}
            isOutOfStock={item.sku.isOutOfStock}
            isNotFinalSale={true}
            changeMethodLabel={changeMethodLabel}
            rightLGUISection={rightLGUISection}
        />
    );
}

export default wrapFunctionalComponent(RewardSkuItem, 'RewardSkuItem');
