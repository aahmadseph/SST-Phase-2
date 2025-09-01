import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import DeliveryIssueModalSelector from 'selectors/order/orderDetails/deliveryIssueModalSelector';
import headerSelector from 'selectors/order/orderDetails/header/headerSelector';

import LanguageLocaleUtils from 'utils/LanguageLocale';

import OrderActions from 'actions/OrderActions';
import Actions from 'Actions';

const { wrapHOC } = FrameworkUtils;
const { deliveryIssueModalSelector } = DeliveryIssueModalSelector;
const {
    loadReturnEligibilty, setSelectedDeliveryIssue, setDeliveryIssueModalScreen, setDeliveryIssueError, setReturnEligibilty
} = OrderActions;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const { showDeliveryIssueModal } = Actions;
const getText = getLocaleResourceFile('components/GlobalModals/DeliveryIssueModal/locales', 'DeliveryIssueModal');

const fields = createSelector(
    deliveryIssueModalSelector,
    headerSelector,
    createStructuredSelector({
        orderIssue: getTextFromResource(getText, 'orderIssue'),
        continueBtn: getTextFromResource(getText, 'continue'),
        cancelBtn: getTextFromResource(getText, 'cancel'),
        pleaseSelect: getTextFromResource(getText, 'pleaseSelect'),
        goToCustomerService: getTextFromResource(getText, 'goToCustomerService'),
        weAreHereToHelp: getTextFromResource(getText, 'weAreHereToHelp'),
        selectOne: getTextFromResource(getText, 'selectOne'),
        requestRefund: getTextFromResource(getText, 'requestRefund'),
        pleaseContact: getTextFromResource(getText, 'pleaseContact'),
        requestReplacement: getTextFromResource(getText, 'requestReplacement'),
        replaceOrder: getTextFromResource(getText, 'replaceOrder'),
        weProvideReplacement: getTextFromResource(getText, 'weProvideReplacement'),
        pleaseReachOut: getTextFromResource(getText, 'pleaseReachOut'),
        pleaseMakeSelection: getTextFromResource(getText, 'pleaseMakeSelection'),
        somethingWrong: getTextFromResource(getText, 'somethingWrong'),
        please: getTextFromResource(getText, 'please'),
        contactCustomerService: getTextFromResource(getText, 'contactCustomerService'),
        orTryLater: getTextFromResource(getText, 'orTryLater')
    }),
    (deliveryIssueModal, header, textResources) => ({
        ...textResources,
        orderId: header.orderId,
        deliveryIssues: deliveryIssueModal.deliveryIssues,
        selectedDeliveryIssue: deliveryIssueModal.selectedDeliveryIssue,
        deliveryIssueModalScreen: deliveryIssueModal.deliveryIssueModalScreen,
        returnEligibility: deliveryIssueModal.returnEligibility,
        isDeliveryIssueError: deliveryIssueModal.isDeliveryIssueError
    })
);
const functions = {
    loadReturnEligibilty,
    setSelectedDeliveryIssue,
    setDeliveryIssueModalScreen,
    showDeliveryIssueModal,
    setDeliveryIssueError,
    setReturnEligibilty
};

const withDeliveryIssueModalProps = wrapHOC(connect(fields, functions));

export {
    withDeliveryIssueModalProps, fields, functions
};
