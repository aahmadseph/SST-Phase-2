import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import SkuItemLayout from 'components/RwdBasket/Carts/CartLayout/SkuItem/SkuItemLayout';
import ChangeMethodVariantBox from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodVariantBox';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdBasket/Carts/StandardCart/locales', 'StandardCart');

function GwpSkuItem({ item, changeMethodLabel, callbacks: { onDelete } }) {
    return (
        <SkuItemLayout
            item={item}
            onDelete={onDelete}
            isOutOfStock={item.sku.isOutOfStock}
            isNotFinalSale={true}
            price={getText('freeGift')}
            changeMethodLabel={changeMethodLabel}
            rightLGUISection={<ChangeMethodVariantBox availableForOnlyOneOption />}
        />
    );
}

export default wrapFunctionalComponent(GwpSkuItem, 'GwpSkuItem');
