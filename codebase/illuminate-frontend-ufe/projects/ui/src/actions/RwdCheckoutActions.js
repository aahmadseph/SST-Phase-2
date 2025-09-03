import store from 'store/Store';
import { PAYMENT_CARD_NUMBER_CHANGED, GIFT_CARD_APPLIED, TOGGLE_CVC_INFO_MODAL } from 'constants/actionTypes/order';
import OrderActions from 'actions/OrderActions';

const paymentNumberUpdated = (detectCardTypes, paymentGroupType) => () => {
    return store.watchAction(PAYMENT_CARD_NUMBER_CHANGED, data => {
        const cardTypes = detectCardTypes(data.cardNumber, paymentGroupType);
        store.dispatch(OrderActions.paymentCardsDetected(cardTypes));
    });
};

function giftCardApplied(parentComp) {
    return () =>
        store.watchAction(GIFT_CARD_APPLIED, () => {
            parentComp.updateOrderDebounce();
        });
}

const toggleCVCInfoModal = parentComp => () => {
    return store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
        parentComp.setState({ isOpen: data.isOpen });
    });
};

const CreditCardListToggleCVC = parentComp => () => {
    return store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
        const actionInfoButton = parentComp.refs.securityCodeInput?.getInfoActionButtonRef();

        if (actionInfoButton && data.isOpen === false) {
            actionInfoButton.focus();
        }
    });
};

export default { paymentNumberUpdated, giftCardApplied, toggleCVCInfoModal, CreditCardListToggleCVC };
