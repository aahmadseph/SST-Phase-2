import localeUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import resourceWrapper from 'utils/framework/resourceWrapper';

const getBiFreeShippingText = (isBasketorPrebasket, isPpage, fromChooseOptionsModal) => {
    const getText = resourceWrapper(localeUtils.getLocaleResourceFile('utils/locales', 'Basket'));
    const showBasketPageFreeShipping = isBasketorPrebasket && !userUtils.isAnonymous();

    if (fromChooseOptionsModal) {
        return getText('biFreeShip', true);
    }

    if (isPpage) {
        return getText('biFreeShipShort', true);
    }

    if (showBasketPageFreeShipping) {
        return getText('freeShip', null, `{color:red}${getText('freeShipVar')}{color}`);
    }

    return getText('biFreeShip', !isBasketorPrebasket);
};

export { getBiFreeShippingText };
