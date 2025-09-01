import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import BiFreeShipping from 'components/RwdBasket/Messages/BiFreeShipping/BiFreeShipping';
import { colors } from 'style/config';

function TextZone({ hasMetFreeShippingThreshhold, isSignedInBIUser }) {
    return (
        <BiFreeShipping
            hasMetFreeShippingThreshhold={hasMetFreeShippingThreshhold}
            isSignedInBIUser={isSignedInBIUser}
            freeShipColor={colors.red}
            isFreeShipBold
        />
    );
}

export default wrapFunctionalComponent(TextZone, 'TextZone');
