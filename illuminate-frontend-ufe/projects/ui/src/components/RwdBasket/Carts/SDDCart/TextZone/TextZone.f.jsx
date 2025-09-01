import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import SDDRougePromoText from 'components/RwdBasket/Carts/SDDCart/TextZone/SDDRougePromoText';
import SDUPromoBanner from 'components/RwdBasket/Carts/SDDCart/TextZone/SDUPromoBanner';

function TextZone({
    isSDDRougeTestFreeShipping,
    SDDRougeTestRemainToFreeShipping,
    SDDRougeTestThreshold,
    SDUProduct,
    isUserSDUTrialEligible,
    isUserSDUMember,
    isSDUFeatureDown,
    isSamedayUnlimitedEnabled
}) {
    const displaySDUPromoBanner =
        !SDUProduct.isSDUAddedToBasket && !isUserSDUMember && !isSDUFeatureDown && isSamedayUnlimitedEnabled && !isSDDRougeTestFreeShipping;

    return isSDDRougeTestFreeShipping ? (
        <SDDRougePromoText
            SDDRougeTestRemainToFreeShipping={SDDRougeTestRemainToFreeShipping}
            SDDRougeTestThreshold={SDDRougeTestThreshold}
            SDUProduct={SDUProduct}
            isUserSDUTrialEligible={isUserSDUTrialEligible}
        />
    ) : displaySDUPromoBanner ? (
        <SDUPromoBanner
            SDUProduct={SDUProduct}
            isUserSDUTrialEligible={isUserSDUTrialEligible}
        />
    ) : null;
}

export default wrapFunctionalComponent(TextZone, 'TextZone');
