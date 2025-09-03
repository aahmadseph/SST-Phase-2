import Empty from 'constants/empty';
import basketConstants from 'constants/Basket';

const { CONTEXT } = basketConstants;

const rwdCheckoutErrorsSelector = state => {
    const { error: { errorMessages, sameDayBasketLevelMsg } = {} } = state.basket;
    const {
        topOfPageBopis, topOfPageSad, sddZone2, bopisZone2, gisZone2, biBenefitsErrors
    } =
        state.page?.rwdBasket?.rwdCheckoutErrors || Empty.Object;

    // Ensure only unique errors are included
    const uniqueTopOfPageBopis = [...new Set(topOfPageBopis)];
    const uniqueTopOfPageSad = [...new Set(topOfPageSad)];
    const uniqueSddZone2 = [...new Set(sddZone2)];
    const uniqueBopisZone2 = [...new Set(bopisZone2)];
    const uniqueGisZone2 = [...new Set(gisZone2)];
    const uniqueBiBenefitsErrors = [...new Set(biBenefitsErrors)];
    const serviceUnavailable = uniqueSddZone2?.serviceUnavailable || uniqueTopOfPageSad?.serviceUnavailable || uniqueGisZone2?.serviceUnavailable;
    const basketLevelMessages = state.page?.rwdBasket?.basket?.basketLevelMessages || Empty.Array;
    const sedClosePromoMessages = basketLevelMessages?.find(message => message?.messageContext === (CONTEXT?.SED_CLOSE_PROMO_MESSAGE ?? 'basket.promotion.sed.close')) || Empty.Object;

    return {
        serviceUnavailable,
        errorMessages,
        sameDayBasketLevelMsg,
        topOfPageBopis: uniqueTopOfPageBopis,
        topOfPageSad: uniqueTopOfPageSad,
        sddZone2: uniqueSddZone2,
        bopisZone2: uniqueBopisZone2,
        gisZone2: uniqueGisZone2,
        biBenefitsErrors: uniqueBiBenefitsErrors,
        sedClosePromoMessages
    };
};

export default rwdCheckoutErrorsSelector;
