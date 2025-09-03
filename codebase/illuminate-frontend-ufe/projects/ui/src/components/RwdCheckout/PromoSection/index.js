import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PromoSection from 'components/RwdCheckout/PromoSection/PromoSection';

import promoErrorSelector from 'selectors/promo/promoError/promoErrorSelector';
import promotionSelector from 'selectors/order/orderDetails/promotion/promotionSelector';
import basketSelector from 'selectors/basket/basketSelector';
import { orderSelector } from 'selectors/order/orderSelector';

import addToBasketActions from 'actions/AddToBasketActions';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/PromoSection/locales', 'PromoSection');

const localization = createStructuredSelector({
    ccPromoLabel: getTextFromResource(getText, 'ccPromoLabel'),
    promoLabel: getTextFromResource(getText, 'promoLabel'),
    youCanAddPromos: getTextFromResource(getText, 'youCanAddPromos'),
    viewPromoCodesText: getTextFromResource(getText, 'viewPromoCodesText'),
    appliedText: getTextFromResource(getText, 'appliedText'),
    gotIt: getTextFromResource(getText, 'gotIt'),
    removeText: getTextFromResource(getText, 'removeText'),
    applyText: getTextFromResource(getText, 'applyText')
});

const fields = createStructuredSelector({
    localization,
    error: promoErrorSelector,
    promotion: promotionSelector,
    basket: basketSelector,
    order: orderSelector
});

const functions = {
    refreshBasket: addToBasketActions.refreshBasket,
    showBccModal: Actions.showBccModal,
    showContentModal: Actions.showContentModal
};

const withPromoSectionProps = wrapHOC(connect(fields, functions));

export default withPromoSectionProps(PromoSection);
