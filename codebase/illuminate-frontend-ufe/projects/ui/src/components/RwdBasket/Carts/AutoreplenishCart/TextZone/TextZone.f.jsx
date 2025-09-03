import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import stringUtils from 'utils/String';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { getLocaleResourceFile } = localeUtils;

function TextZone({ isSignedIn, totalAnnualReplenishmentDiscount, firstName, hasAcceleratedPromotionItems }) {
    const getText = resourceWrapper(getLocaleResourceFile('components/RwdBasket/Carts/AutoreplenishCart/TextZone/locales', 'TextZone'));
    const boldRedText = `*{color:red}${totalAnnualReplenishmentDiscount}{color}*`;

    return (
        <>
            {isSignedIn
                ? getText(
                    hasAcceleratedPromotionItems ? 'signedInFirstYearSavingsMessage' : 'signedInSavingsMessage',
                    true,
                    stringUtils.capitalize(firstName),
                    boldRedText
                )
                : getText(hasAcceleratedPromotionItems ? 'guestFirstYearSavingsMessage' : 'guestSavingsMessage', true, boldRedText)}
        </>
    );
}

export default wrapFunctionalComponent(TextZone, 'TextZone');
