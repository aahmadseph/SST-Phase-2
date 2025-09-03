import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import SkuItemLayout from 'components/RwdBasket/Carts/CartLayout/SkuItem/SkuItemLayout';
import ChangeMethodVariantBox from 'components/RwdBasket/Carts/CartLayout/SkuItem/ChangeMethod/ChangeMethodVariantBox';
import SDURenewalPricing from 'components/SDURenewalPricing';
import dateUtils from 'utils/Date';

const { formatDateMDY } = dateUtils;

function SDUSkuItem({
    item, getText, changeMethodLabel, isUserSDUTrialEligible, isOutOfStock, callbacks: { onDelete, handleSddSkuIsOOSChange }
}) {
    return (
        <SkuItemLayout
            item={item}
            isOutOfStock={isOutOfStock}
            changeMethodLabel={changeMethodLabel}
            abovePriceContent={
                <SDURenewalPricing
                    sduListPrice={item.sku.listPrice}
                    SDUFormattedDate={formatDateMDY(item.replenishmentPaymentDate, true)}
                    hasUserSDUTrial={isUserSDUTrialEligible}
                />
            }
            price={`${isUserSDUTrialEligible ? getText('free') : item.sku.listPrice}*`}
            onDelete={onDelete}
            handleSddSkuIsOOSChange={handleSddSkuIsOOSChange}
            rightLGUISection={<ChangeMethodVariantBox availableForOnlyOneOption />}
        />
    );
}

export default wrapFunctionalComponent(SDUSkuItem, 'SDUSkuItem');
