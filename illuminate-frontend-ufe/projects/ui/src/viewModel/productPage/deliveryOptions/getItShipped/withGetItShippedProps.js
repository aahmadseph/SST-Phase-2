import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import basketSelector from 'selectors/basket/basketSelector';
import PreferredZipCodeSelector from 'selectors/user/preferredZipCodeSelector';
import Actions from 'Actions';
import skuUtils from 'utils/Sku';
import { shipToHomeSelector } from 'selectors/page/product/fulfillmentOptions/deliveryOptions/shipToHome/shipToHomeSelector';
import { showEddOnProductPageSelector } from 'viewModel/selectors/testTarget/showEddOnProductPageSelector';
import { globalModalsSelector } from 'selectors/page/headerFooterTemplate/data/globalModals/globalModalsSelector';
import { globalModals } from 'utils/globalModals';

import LanguageLocaleUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';

const { wrapHOC } = FrameworkUtils;
const { SHIPPING_AND_HANDLING_INFO } = globalModals;
const { preferredZipCodeSelector } = PreferredZipCodeSelector;
const { getLocaleResourceFile, getTextFromResource, isFRCanada } = LanguageLocaleUtils;
const getText = resourceWrapper(getLocaleResourceFile('components/ProductPage/DeliveryOptions/locales', 'DeliveryOptions'));

const fields = createSelector(
    preferredZipCodeSelector,
    basketSelector,
    shipToHomeSelector,
    globalModalsSelector,
    (_state, ownProps) => ownProps.currentProduct,
    createStructuredSelector({
        shippingAndReturnsText: getTextFromResource(getText, 'shippingAndReturns'),
        signInText: getTextFromResource(getText, 'signIn'),
        createAccountText: getTextFromResource(getText, 'createAccount'),
        freeStandardShippingText: getTextFromResource(getText, 'freeStandardShipping'),
        toText: getTextFromResource(getText, 'to'),
        getItShippedShipMessage: getTextFromResource(getText, 'getItShippedShipMessage'),
        yourLocationText: getTextFromResource(getText, 'yourLocation')
    }),
    showEddOnProductPageSelector,
    (preferredZipCode, basket, shipToHome, globalModalsData, product, textResources, showEddOnProductPage) => {
        const { currentSku = {} } = product;
        const shouldDisplayEdd = showEddOnProductPage && !currentSku.isOutOfStock;
        const isStoreOnly = skuUtils.isStoreOnly(currentSku);
        const locationText = preferredZipCode;
        const getItShippedDeliveryMessage =
            shouldDisplayEdd && shipToHome?.shipToHomeMessage?.length ? shipToHome?.shipToHomeMessage.split(!isFRCanada() ? ' to' : ' au')[0] : '';

        return {
            basket,
            shipToHome,
            isStoreOnly,
            locationText,
            textResources,
            getItShippedDeliveryMessage,
            shouldDisplayEdd,
            shippingAndHandlingModal: globalModalsData[SHIPPING_AND_HANDLING_INFO]
        };
    }
);

const functions = {
    showSignInModal: Actions.showSignInModal,
    showRegisterModal: Actions.showRegisterModal,
    showShippingDeliveryLocationModal: Actions.showShippingDeliveryLocationModal
};

const withGetItShippedProps = wrapHOC(connect(fields, functions));

export {
    fields, withGetItShippedProps
};
