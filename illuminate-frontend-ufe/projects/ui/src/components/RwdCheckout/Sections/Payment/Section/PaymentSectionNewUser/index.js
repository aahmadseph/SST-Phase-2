import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PaymentSectionNewUser from 'components/RwdCheckout/Sections/Payment/Section/PaymentSectionNewUser/PaymentSectionNewUser';
import UtilActions from 'utils/redux/Actions';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import OrderActions from 'actions/OrderActions';
import PazeActions from 'actions/PazeActions';
import VenmoActions from 'actions/VenmoActions';
import EditDataActions from 'actions/EditDataActions';
import store from 'store/Store';
import { orderDetailsSelector } from 'selectors/order/orderDetails/orderDetailsSelector';
import priceInfoSelector from 'selectors/order/orderDetails/priceInfo/priceInfoSelector';
import klarnaSelector from 'selectors/klarna/klarnaSelector';
import Empty from 'constants/empty';
import decorators from 'utils/decorators';
import checkoutApi from 'services/api/checkout';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';

import { orderSelector } from 'selectors/order/orderSelector';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, isCanada } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/Section/locales', 'PaymentSection');

const applePayFlowSelector = createSelector(orderSelector, order => order.isApplePayFlow);
const klarnaSelectorErrorSelector = createSelector(klarnaSelector, klarna => klarna.error || Empty.object);

const withInterstice = payload => {
    return decorators.withInterstice(checkoutApi.updatePayPalCheckout, INTERSTICE_DELAY_MS)(payload, 'update');
};

const commonOrderToggleActions = (mergeValue = false, KlarnaValue = false, afterPayValue = false, venmoValue = false) => {
    store.dispatch(UtilActions.merge('order', 'isApplePayFlow', mergeValue));
    store.dispatch(KlarnaActions.toggleSelect(KlarnaValue));
    store.dispatch(AfterpayActions.toggleSelect(afterPayValue));
    store.dispatch(VenmoActions.toggleSelect(venmoValue));
};

const updatePaymentActions = (pazeValue = false, appleValue = false) => {
    store.dispatch(PazeActions.toggleSelect(pazeValue));
    store.dispatch(AfterpayActions.resetError());
    store.dispatch(OrderActions.orderReviewIsActive(appleValue));
};

const sectionSaveOrderAction = (value = false) => {
    store.dispatch(OrderActions.sectionSaved(value));
};

const setNewCardActions = () => {
    store.dispatch(AfterpayActions.resetError());
};

const updateEditDataAction = (billingCountries, editSectionName) => {
    store.dispatch(EditDataActions.updateEditData(billingCountries, editSectionName));
};

const textResources = createStructuredSelector({
    payWithCreditOrDebitCard: getTextFromResource(getText, 'payWithCreditOrDebitCard'),
    visaOrMastercard: getTextFromResource(getText, 'visaOrMastercard'),
    paypalRestrictedItemError: getTextFromResource(getText, 'paypalRestrictedItemError')
});

const functions = {
    updatePaymentActions,
    commonOrderToggleActions,
    setNewCardActions,
    sectionSaveOrderAction,
    updateEditDataAction
};

const connectedPaymentSectionNewUser = connect(
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

const withPaymentSectionNewUserProps = wrapHOC(connectedPaymentSectionNewUser);

export default withPaymentSectionNewUserProps(PaymentSectionNewUser);
