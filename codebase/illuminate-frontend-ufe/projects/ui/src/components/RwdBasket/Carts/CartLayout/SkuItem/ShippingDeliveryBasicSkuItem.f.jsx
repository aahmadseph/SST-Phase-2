import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Link } from 'components/ui';
import BasicSkuItem from 'components/RwdBasket/Carts/CartLayout/SkuItem/BasicSkuItem';
import InfoButton from 'components/InfoButton/InfoButton';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import localeUtils from 'utils/LanguageLocale';

const { openShippingRestrictionsInfoModal } = RwdBasketActions;
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/Carts/CartLayout/locales', 'CartLayout');

function ShippingRestrictions() {
    const title = getText('shippingRestrictions');

    return (
        <Link
            onClick={() =>
                openShippingRestrictionsInfoModal({
                    title,
                    message: getText('shippingRestrictionModalText'),
                    buttonText: getText('gotIt')
                })
            }
            data-at={Sephora.debug.dataAt('shipping_restrictions_btn')}
            color='gray'
            fontSize={['sm', 'base']}
            marginTop={3}
        >
            {title}
            <InfoButton
                marginLeft={-1}
                size={13}
            />
        </Link>
    );
}

function ShippingDeliveryBasicSkuItem({
    item,
    changeMethodLabel,
    callbacks,
    belowPriceContent = [],
    itemDeliveryMethod,
    preferredStoreInfo,
    preferredZipCode,
    userId,
    hasMetFreeShippingThreshhold,
    isSignedInBIUser,
    isOutOfStock,
    showQuantityPickerBasket
}) {
    if (item.sku.isHazmat) {
        belowPriceContent.push(ShippingRestrictions);
    }

    return (
        <BasicSkuItem
            item={item}
            changeMethodLabel={changeMethodLabel}
            callbacks={callbacks}
            belowPriceContent={belowPriceContent}
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

export default wrapFunctionalComponent(ShippingDeliveryBasicSkuItem, 'ShippingDeliveryBasicSkuItem');
