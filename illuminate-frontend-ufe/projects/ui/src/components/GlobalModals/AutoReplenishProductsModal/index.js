/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { createSelector, createStructuredSelector } from 'reselect';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import AutoReplenishProductsModal from 'components/GlobalModals/AutoReplenishProductsModal/AutoReplenishProductsModal';
import Actions from 'Actions';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/GlobalModals/AutoReplenishProductsModal/locales', 'AutoReplenishProductsModal');

const localization = createStructuredSelector({
    deliverEvery: getTextFromResource(getText, 'deliverEvery'),
    deliveryFrequency: getTextFromResource(getText, 'deliveryFrequency'),
    itemsInOrder: getTextFromResource(getText, 'itemsInOrder'),
    done: getTextFromResource(getText, 'done'),
    qty: getTextFromResource(getText, 'qty')
});

const fields = createSelector(itemsByBasketSelector, localization, (itemsByBasket, locales) => {
    const standardBasket = itemsByBasket.find(item => item.basketType === 'ShipToHome') || {};
    const autoReplenishItems = standardBasket.items.filter(item => item.isReplenishment);

    return {
        autoReplenishItems,
        locales
    };
});

const functions = {
    showAutoReplenishProductsModal: Actions.showAutoReplenishProductsModal
};

const withAutoReplenishProductsModalProps = wrapHOC(connect(fields, functions));

export default withAutoReplenishProductsModalProps(AutoReplenishProductsModal);
