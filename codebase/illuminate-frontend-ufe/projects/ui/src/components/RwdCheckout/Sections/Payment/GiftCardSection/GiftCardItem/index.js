import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import GiftCardItem from 'components/RwdCheckout/Sections/Payment/GiftCardSection/GiftCardItem/GiftCardItem';
import Actions from 'Actions';
import orderUtils from 'utils/Order';
import ErrorsUtils from 'utils/Errors';
import checkoutApi from 'services/api/checkout';
import OrderActions from 'actions/OrderActions';
import store from 'store/Store';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');

const updateOrder = () => {
    checkoutApi
        .getOrderDetails(orderUtils.getOrderId())
        .then(orderData => store.dispatch(OrderActions.updateOrder(orderData)))
        .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
};

const removeGiftCard = giftCard => {
    return () =>
        decorators
            .withInterstice(checkoutApi.removeGiftCard, INTERSTICE_DELAY_MS)(orderUtils.getOrderId(), giftCard.paymentGroupId)
            .then(() => {
                updateOrder();
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
};

const showInfoModal = (title, message, confirmButtonText, callback) => {
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: title,
            message: message,
            buttonText: confirmButtonText,
            callback: callback,
            showCancelButton: true
        })
    );
};

const localization = createStructuredSelector({
    giftCardEndingIn: getTextFromResource(getText, 'giftCardEndingIn'),
    hasBeenApplied: getTextFromResource(getText, 'hasBeenApplied'),
    removeLink: getTextFromResource(getText, 'removeLink'),
    removeGiftCardText: getTextFromResource(getText, 'removeGiftCard'),
    areYouSureMessage: getTextFromResource(getText, 'areYouSureMessage')
});

const withComponentProps = wrapHOC(
    connect(
        createSelector(localization, localizationResources => {
            return {
                localization: localizationResources,
                removeGiftCard,
                showInfoModal
            };
        })
    )
);

export default withComponentProps(GiftCardItem);
