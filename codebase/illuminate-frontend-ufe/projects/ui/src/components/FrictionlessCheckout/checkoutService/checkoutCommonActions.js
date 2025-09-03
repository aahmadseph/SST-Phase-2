import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import OrderActions from 'actions/OrderActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import UtilActions from 'utils/redux/Actions';
import store from 'store/Store';

const commonOrderToggleActions = (mergeValue = false, KlarnaValue = false, afterPayValue = false, venmoValue = false) => {
    store.dispatch(UtilActions.merge('order', 'isApplePayFlow', mergeValue));
    store.dispatch(KlarnaActions.toggleSelect(KlarnaValue));
    store.dispatch(AfterpayActions.toggleSelect(afterPayValue));
    store.dispatch(VenmoActions.toggleSelect(venmoValue));
};

const updatePaymentActions = (pazeValue = false, appleValue = false) => {
    store.dispatch(PazeActions.toggleSelect(pazeValue));
    store.dispatch(AfterpayActions.resetError());
    store.dispatch(PazeActions.resetError());
    store.dispatch(VenmoActions.resetError());
    store.dispatch(OrderActions.orderReviewIsActive(appleValue));
};

const sectionSaveOrderAction = (value, component) => {
    store.dispatch(OrderActions.sectionSaved(value, component));
};

const swapPaypalToCreditCard = () => {
    store.dispatch(OrderActions.swapPaypalToCredit());
};

const setNewCardActions = () => {
    store.dispatch(PazeActions.toggleSelect(false));
    store.dispatch(AfterpayActions.resetError());
};

export {
    commonOrderToggleActions, updatePaymentActions, sectionSaveOrderAction, swapPaypalToCreditCard, setNewCardActions
};
