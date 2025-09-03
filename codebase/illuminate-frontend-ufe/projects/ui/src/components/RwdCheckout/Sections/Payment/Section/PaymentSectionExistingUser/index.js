import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PaymentSectionExistingUser from 'components/RwdCheckout/Sections/Payment/Section/PaymentSectionExistingUser/PaymentSectionExistingUser';
import UtilActions from 'utils/redux/Actions';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import OrderActions from 'actions/OrderActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import { orderSelector } from 'selectors/order/orderSelector';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import Empty from 'constants/empty';
import store from 'store/Store';
import EditDataActions from 'actions/EditDataActions';
import Actions from 'actions/Actions';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import checkoutApi from 'services/api/checkout';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const maxCreditCards = Sephora.configurationSettings.maxCreditCards;

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

const setNewCardActions = () => {
    store.dispatch(PazeActions.toggleSelect(false));
    store.dispatch(AfterpayActions.resetError());
};

const showAddCrediCardActions = () => {
    store.dispatch(KlarnaActions.toggleSelect(false));
    store.dispatch(AfterpayActions.toggleSelect(false));
    store.dispatch(AfterpayActions.resetError());
};

const updateEditDataAction = (billingCountries, editSectionName) => {
    store.dispatch(EditDataActions.updateEditData(billingCountries, editSectionName));
};

const swapPaypalToCreditCard = () => {
    store.dispatch(OrderActions.swapPaypalToCredit());
};

const actionModal = (title, message, confirmButtonText) =>
    store.dispatch(
        Actions.showInfoModal({
            isOpen: true,
            title: title,
            message: message,
            confirmButtonText: confirmButtonText
        })
    );

const textResources = createStructuredSelector({
    addNewCreditCard: getTextFromResource(getText, 'addNewCreditCard'),
    debitCardDisclaimer: getTextFromResource(getText, 'debitCardDisclaimer'),
    showMoreCards: getTextFromResource(getText, 'showMoreCards'),
    showLessCards: getTextFromResource(getText, 'showLessCards'),
    paypalRestrictedItemError: getTextFromResource(getText, 'paypalRestrictedItemError'),
    removeAddress: getTextFromResource(getText, 'removeAddress'),
    maxCreditCardsMessage: getTextFromResource(getText, 'maxCreditCardsMessage', [maxCreditCards]),
    continueButton: getTextFromResource(getText, 'continueButton')
});

const applePayFlowSelector = createSelector(orderSelector, order => order.isApplePayFlow);
const klarnaSelectorErrorSelector = createSelector(klarnaSelector, klarna => klarna.error || Empty.object);

const withInterstice = payload => {
    return decorators.withInterstice(checkoutApi.updatePayPalCheckout, INTERSTICE_DELAY_MS)(payload, 'update');
};

const functions = {
    updatePaymentActions,
    commonOrderToggleActions,
    setNewCardActions,
    showAddCrediCardActions,
    sectionSaveOrderAction,
    updateEditDataAction,
    swapPaypalToCreditCard,
    actionModal
};

const connectedPaymentSectionExistingUser = connect(
    createSelector(
        textResources,
        orderDetailsSelector,
        priceInfoSelector,
        applePayFlowSelector,
        klarnaSelectorErrorSelector,
        (texts, orderDetails, priceInfo, isApplePayFlow, klarnaError) => {
            const canada = isCanada();

            return {
                ...texts,
                isCanada: canada,
                orderDetails,
                priceInfo,
                isApplePayFlow,
                klarnaError,
                withInterstice
            };
        }
    ),
    functions
);

const withconnectedPaymentSectionExistingUserProps = wrapHOC(connectedPaymentSectionExistingUser);

export default withconnectedPaymentSectionExistingUserProps(PaymentSectionExistingUser);
