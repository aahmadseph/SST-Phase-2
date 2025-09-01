import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import { breakpoints } from 'style/config';

const { getLocaleResourceFile } = localeUtils;

function isSmallView() {
    return window.matchMedia(breakpoints.smMax).matches;
}

function BiFreeShipping({
    hasMetFreeShippingThreshhold,
    isSignedInBIUser,
    baseColor,
    freeShipColor,
    isFreeShipBold,
    potentialBeautyBankPoints,
    showBasketShippingAndPoints,
    ...customBoxStyle
}) {
    const getText = resourceWrapper(getLocaleResourceFile('components/RwdBasket/Messages/BiFreeShipping/locales', 'BiFreeShipping'));
    let coloredText = `{color:${freeShipColor}}${getText('biFreeShipVar')}{color}`;
    let altText = null;
    const isSmallUS = localeUtils.isUS() && isSmallView();

    if (isFreeShipBold) {
        coloredText = `*${coloredText}*`;
    }

    if (isSmallUS && showBasketShippingAndPoints && potentialBeautyBankPoints > 0) {
        altText = getText('biFreeShipPointsVar', true, potentialBeautyBankPoints);
    }

    // INFL-2247
    return (
        <Box
            color={baseColor}
            {...customBoxStyle}
        >
            {altText ? altText : getText(isSignedInBIUser || !hasMetFreeShippingThreshhold ? 'biFreeShip' : 'freeShipQualifies', true, coloredText)}
        </Box>
    );
}

BiFreeShipping.defaultProps = {
    isFreeShipBold: false
};

export default wrapFunctionalComponent(BiFreeShipping, 'BiFreeShipping');
