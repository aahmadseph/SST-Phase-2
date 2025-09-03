import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Grid, Button } from 'components/ui';
import selfReturnApi from 'services/api/selfReturn';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import decorators from 'utils/decorators';

import UrlUtils from 'utils/Url';
import Modal from 'components/Modal/Modal';
import PropTypes from 'prop-types';

import DeliveryIssueChoiceScreen from 'components/GlobalModals/DeliveryIssueModal/screens/DeliveryIssueChoiceScreen';
import UniversalSorryMessageScreen from 'components/GlobalModals/DeliveryIssueModal/screens/UniversalSorryMessageScreen';
import EligibleForReplacementScreen from 'components/GlobalModals/DeliveryIssueModal/screens/EligibleForReplacementScreen';
import SomethingWrongMessageScreen from 'components/GlobalModals/DeliveryIssueModal/screens/SomethingWrongMessageScreen';

import replacementOrderBindings from 'analytics/bindingMethods/pages/replacementOrder/replacementOrderBindings';
import anaConsts from 'analytics/constants';
import { DELIVERY_ISSUES_MODAL } from 'components/Checkout/constants';

const { modalLoadTracking } = replacementOrderBindings;

function DeliveryIssueModal({
    orderId,
    isOpen,
    showDeliveryIssueModal,
    deliveryIssueModalScreen,
    returnEligibility,
    selectedDeliveryIssue,
    deliveryIssues,
    loadReturnEligibilty,
    setSelectedDeliveryIssue,
    setDeliveryIssueModalScreen,
    isDeliveryIssueError,
    setDeliveryIssueError,
    orderIssue,
    continueBtn,
    cancelBtn,
    pleaseSelect,
    goToCustomerService,
    weAreHereToHelp,
    selectOne,
    requestRefund,
    pleaseContact,
    requestReplacement,
    replaceOrder,
    weProvideReplacement,
    pleaseReachOut,
    pleaseMakeSelection,
    setReturnEligibilty,
    somethingWrong,
    please,
    contactCustomerService,
    orTryLater
}) {
    function redirectToReplacementOrder(replacementOrderId) {
        UrlUtils.redirectTo(`/profile/MyAccount/replacementOrder?orderId=${replacementOrderId}`);
    }

    function redirectToCustomerService() {
        UrlUtils.redirectTo('/beauty/customer-service');
    }

    function updateIssue(issue) {
        if (issue) {
            loadReturnEligibilty(issue.code, orderId);
        }

        setDeliveryIssueError(false);
        setSelectedDeliveryIssue(issue);
    }

    function updateScreen() {
        if (returnEligibility?.apiError) {
            setDeliveryIssueModalScreen(DELIVERY_ISSUES_MODAL.somethingWrongMessageScreen);
        } else if (returnEligibility?.eligibleForNCR === false) {
            setDeliveryIssueModalScreen(DELIVERY_ISSUES_MODAL.universalSorryMessageScreen);
            //Analytics
            modalLoadTracking({
                pageDetail: anaConsts.PAGE_DETAIL.NCR_NOT_ELEGIBLE,
                description: selectedDeliveryIssue?.description,
                reportIssueCode: selectedDeliveryIssue?.code,
                orderId
            });
        } else if (!returnEligibility?.responseCode) {
            setDeliveryIssueError(true);
        } else {
            setDeliveryIssueModalScreen(DELIVERY_ISSUES_MODAL.eligibleForReplacementScreen);
            //Analytics
            modalLoadTracking({
                pageDetail: anaConsts.PAGE_DETAIL.NCR_ELEGIBLE,
                description: selectedDeliveryIssue?.description,
                reportIssueCode: selectedDeliveryIssue?.code,
                orderId
            });
        }
    }

    function dismissModal() {
        setDeliveryIssueModalScreen(null);
        updateIssue(null);
        setReturnEligibilty(null);
        setDeliveryIssueError(false);
        showDeliveryIssueModal({ isOpen: false });
    }

    function createReplaceOrder() {
        const payload = {
            returnType: 'NCR',
            returnOrderId: orderId,
            returnReason: selectedDeliveryIssue.code,
            originOfOrder: Sephora.isMobile() ? 'mobileWeb' : 'web'
        };

        decorators
            .withInterstice(
                selfReturnApi.createIRorNCR,
                0
            )(payload)
            .then(data => {
                Storage.local.setItem(LOCAL_STORAGE.NCR_ORDER, data);
                redirectToReplacementOrder(data.replacementOrderId);
                dismissModal();
            })
            .catch(_ => {
                setDeliveryIssueModalScreen(DELIVERY_ISSUES_MODAL.somethingWrongMessageScreen);
            });
    }

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={dismissModal}
            width={0}
        >
            <Modal.Header>
                <Modal.Title>{orderIssue}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!deliveryIssueModalScreen && (
                    <DeliveryIssueChoiceScreen
                        deliveryIssues={deliveryIssues}
                        updateIssue={updateIssue}
                        selectedDeliveryIssue={selectedDeliveryIssue}
                        pleaseSelect={pleaseSelect}
                        pleaseMakeSelection={pleaseMakeSelection}
                        isDeliveryIssueError={isDeliveryIssueError}
                    />
                )}
                {deliveryIssueModalScreen === DELIVERY_ISSUES_MODAL.universalSorryMessageScreen && (
                    <UniversalSorryMessageScreen
                        goToCustomerService={goToCustomerService}
                        weAreHereToHelp={weAreHereToHelp}
                        pleaseReachOut={pleaseReachOut}
                        redirectToCustomerService={redirectToCustomerService}
                    />
                )}
                {deliveryIssueModalScreen === DELIVERY_ISSUES_MODAL.eligibleForReplacementScreen && (
                    <EligibleForReplacementScreen
                        goToCustomerService={goToCustomerService}
                        weAreHereToHelp={weAreHereToHelp}
                        requestRefund={requestRefund}
                        pleaseContact={pleaseContact}
                        requestReplacement={requestReplacement}
                        replaceOrder={replaceOrder}
                        weProvideReplacement={weProvideReplacement}
                        selectOne={selectOne}
                        createReplaceOrder={createReplaceOrder}
                        redirectToCustomerService={redirectToCustomerService}
                    />
                )}
                {deliveryIssueModalScreen === DELIVERY_ISSUES_MODAL.somethingWrongMessageScreen && (
                    <SomethingWrongMessageScreen
                        somethingWrong={somethingWrong}
                        please={please}
                        contactCustomerService={contactCustomerService}
                        orTryLater={orTryLater}
                        redirectToCustomerService={redirectToCustomerService}
                        iconImage='eyeLashes'
                    />
                )}
            </Modal.Body>
            {!deliveryIssueModalScreen && (
                <Modal.Footer>
                    {Sephora.isMobile() ? (
                        <Button
                            block={true}
                            variant='primary'
                            onClick={updateScreen}
                        >
                            {continueBtn}
                        </Button>
                    ) : (
                        <Grid
                            gap={4}
                            marginTop={[-2, -2]}
                            columns={[2, 2]}
                            maxWidth={[null, 556]}
                        >
                            <Button
                                block={true}
                                variant='secondary'
                                onClick={dismissModal}
                            >
                                {cancelBtn}
                            </Button>
                            <Button
                                block={true}
                                variant='primary'
                                onClick={updateScreen}
                            >
                                {continueBtn}
                            </Button>
                        </Grid>
                    )}
                </Modal.Footer>
            )}
        </Modal>
    );
}

DeliveryIssueModal.propTypes = {
    orderId: PropTypes.string,
    returnEligibility: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    showDeliveryIssueModal: PropTypes.func.isRequired,
    deliveryIssueModalScreen: PropTypes.string,
    selectedDeliveryIssue: PropTypes.object,
    deliveryIssues: PropTypes.array.isRequired,
    loadReturnEligibilty: PropTypes.func.isRequired,
    setSelectedDeliveryIssue: PropTypes.func.isRequired,
    setDeliveryIssueModalScreen: PropTypes.func.isRequired,
    orderIssue: PropTypes.string,
    continueBtn: PropTypes.string,
    cancelBtn: PropTypes.string,
    pleaseSelect: PropTypes.string,
    goToCustomerService: PropTypes.string,
    weAreHereToHelp: PropTypes.string,
    selectOne: PropTypes.string,
    requestRefund: PropTypes.string,
    pleaseContact: PropTypes.string,
    replaceOrder: PropTypes.string,
    weProvideReplacement: PropTypes.string,
    pleaseReachOut: PropTypes.string,
    pleaseMakeSelection: PropTypes.string,
    isDeliveryIssueError: PropTypes.bool,
    setDeliveryIssueError: PropTypes.func.isRequired,
    setReturnEligibilty: PropTypes.func.isRequired,
    somethingWrong: PropTypes.string,
    please: PropTypes.string,
    contactCustomerService: PropTypes.string,
    orTryLater: PropTypes.string
};

export default wrapFunctionalComponent(DeliveryIssueModal, 'DeliveryIssueModal');
