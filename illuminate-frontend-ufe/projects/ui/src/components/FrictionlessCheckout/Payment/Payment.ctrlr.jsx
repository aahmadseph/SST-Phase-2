import React from 'react';
import BaseClass from 'components/BaseClass';
import LayoutCard from 'components/FrictionlessCheckout/LayoutCard/LayoutCard';
import { wrapComponent } from 'utils/framework';
import { Box, Text, Icon } from 'components/ui';
import PaymentsDisplay from 'components/FrictionlessCheckout/Payment/PaymentsDisplay/PaymentsDisplay';
import PaymentMethodList from 'components/FrictionlessCheckout/Payment/PaymentMethodList';
import anaConsts from 'analytics/constants';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import StringUtils from 'utils/String';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';
import OrderActions from 'actions/OrderActions';
import store from 'store/Store';
import OrderUtils from 'utils/Order';
import { PAYMENT_TYPES } from 'constants/RwdBasket';
import deepEqual from 'deep-equal';

class Payment extends BaseClass {
    state = {
        isEditMode: false,
        isHigherRedeemPoints: this.props.zeroDollarHigherRedeemPointsNotCVV || this.props.zeroDollarHigherRedeemPointsCVV
    };

    setEditChangeLink = isEditMode => {
        this.setState({ isEditMode: isEditMode });

        if (isEditMode) {
            this.props.getCreditCards(this.props.orderId);
        }

        FrictionlessCheckoutBindings.setChangeLinkAnalytics(anaConsts.PAGE_TYPES.PAYMENT);
    };

    componentDidMount() {
        const { orderDetails, tmpCardMessage, gcAmountNotEnoughMessage } = this.props;
        this.props.checkSelectedPayment({ orderDetails });

        if (tmpCardMessage) {
            this.loadTempCardMessageModal(tmpCardMessage);
        }

        if (gcAmountNotEnoughMessage) {
            this.setGiftCardAmountNotEnoughMessage();
        }

        if (Sephora.isAgent) {
            //If it is Sephora Mirror,for certain roles agent should see payment section open and cvv box opened.

            if (!OrderUtils.isZeroCheckout() && !Sephora.isAgentAuthorizedRole?.(['3'])) {
                const updatedOrderDetails = {
                    ...this.props.orderDetails
                };

                // Find and update CreditCardPaymentGroup's isComplete to false
                if (updatedOrderDetails.paymentGroups && Array.isArray(updatedOrderDetails.paymentGroups.paymentGroupsEntries)) {
                    updatedOrderDetails.paymentGroups.paymentGroupsEntries = updatedOrderDetails.paymentGroups.paymentGroupsEntries.map(entry => {
                        if (entry.paymentGroupType === 'CreditCardPaymentGroup' && entry.paymentGroup) {
                            return {
                                ...entry,
                                paymentGroup: {
                                    ...entry.paymentGroup,
                                    isComplete: false
                                }
                            };
                        }

                        return entry;
                    });
                }

                store.dispatch(OrderActions.updateOrder(updatedOrderDetails));
                this.setEditChangeLink(true);
            }
        }
    }

    setGiftCardAmountNotEnoughMessage = () => {
        this.props.setCheckoutSectionErrors({ Payment: this.props.gcAmountNotEnoughMessage });
    };

    loadTempCardMessageModal = tmpCardMessage => {
        this.props.showInfoModal({
            isOpen: true,
            title: StringUtils.capitalize(tmpCardMessage.type),
            message: tmpCardMessage.messages.join('. ')
        });
    };

    closeEditState = () => {
        this.setState({
            isEditMode: false,
            isHigherRedeemPoints: false
        });
    };

    componentDidUpdate(prevProps) {
        const {
            isPaypalSelected,
            creditCardPaymentGroup,
            alternateMethodSelected,
            isPaymentComplete,
            hasSavedAddress,
            giftCardPaymentGroups,
            isShippableOrder,
            forcePaymentSectionRender,
            orderDetails,
            isNewUserFlow
        } = this.props;

        if (
            (!alternateMethodSelected &&
                !this.state.isEditMode &&
                !isPaypalSelected &&
                !giftCardPaymentGroups.length > 0 &&
                (!creditCardPaymentGroup || !creditCardPaymentGroup.isComplete) &&
                !isPaymentComplete &&
                (!isShippableOrder || hasSavedAddress)) ||
            (!this.state.isEditMode && this.state.isHigherRedeemPoints && !forcePaymentSectionRender)
        ) {
            this.setState({ isEditMode: true });
            this.props.setActiveSection(SECTION_NAMES.PAYMENT);
            this.setAnalytics();
        }

        if (this.state.isEditMode && prevProps.isNewUserFlow && !isNewUserFlow) {
            this.setAnalytics();
        }

        if (prevProps.orderDetails !== this.props.orderDetails && this.props.tmpCardMessage && this.props.activeSection === SECTION_NAMES.PAYMENT) {
            this.loadTempCardMessageModal(this.props.tmpCardMessage);
        }

        if (!deepEqual(prevProps.orderDetails, orderDetails)) {
            this.props.checkSelectedPayment({ orderDetails });
        }

        this.validateGiftCardAmountNotEnoughMessage(prevProps);
    }

    setAnalytics = () => {
        const { zeroDollarHigherRedeemPointsNotCVV, paymentOptions, isNewUserFlow } = this.props;
        const openCreditCardForm = zeroDollarHigherRedeemPointsNotCVV && !paymentOptions?.creditCards?.length;
        const pageDetail = openCreditCardForm ? anaConsts.PAGE_NAMES.ADD_CREDIT_CARD : anaConsts.PAGE_TYPES.PAYMENT;
        !isNewUserFlow && FrictionlessCheckoutBindings.setChangeLinkAnalytics(pageDetail);
    };

    validateGiftCardAmountNotEnoughMessage = prevProps => {
        const { gcAmountNotEnoughMessage, alternateMethodSelected, orderDetails, giftCardAmountEqualsOrderTotal } = this.props;

        if (prevProps.orderDetails !== orderDetails && gcAmountNotEnoughMessage) {
            this.setGiftCardAmountNotEnoughMessage();
        }

        const shouldClearSectionErrors = prevProps.gcAmountNotEnoughMessage && alternateMethodSelected;

        if (prevProps.orderDetails !== orderDetails && shouldClearSectionErrors) {
            this.props.clearCheckoutSectionErrors();
        }

        if (
            prevProps.giftCardAmountEqualsOrderTotal !== giftCardAmountEqualsOrderTotal &&
            giftCardAmountEqualsOrderTotal &&
            this.props.alternatePaymentName === PAYMENT_TYPES.PAY_VENMO
        ) {
            this.props.commonOrderToggleActions();
        }
    };

    render() {
        const {
            sectionNumber,
            localization,
            isPaymentComplete,
            creditCardPaymentGroup,
            giftCardPaymentGroups,
            availablePaymentMethods,
            isPaypalSelected,
            payPalPaymentGroup,
            alternateMethodSelected,
            isNewUserFlow,
            storeCredits,
            hasGiftCardInOrder,
            alternatePaymentName,
            installmentValue,
            isCombinableGiftCards,
            showErrorIcon,
            shouldRenderGiftCardSection,
            isGuestCheckout,
            zeroDollarHigherRedeemPointsCVV,
            zeroDollarHigherRedeemPointsNotCVV,
            paymentOptions,
            venmoUsername,
            sectionLevelError,
            isEfullfillmentOrder,
            gcAmountNotEnoughMessage,
            orderHasPhysicalGiftCard,
            renderSubTitle,
            isPhysicalGiftCardOnly,
            isPhysicalGiftCardAndHardGoodShippingGroup
        } = this.props;

        const { isEditMode } = this.state;
        const { isAfterpayEnabledForThisOrder, isKlarnaEnabledForThisOrder, isVenmoEnabledForThisOrder, isPazeEnabledForThisOrder } =
            availablePaymentMethods;

        return (
            <LayoutCard
                sectionInfo={{
                    sectionNumber: (showErrorIcon && !isNewUserFlow && !isGuestCheckout) || sectionLevelError ? null : sectionNumber,
                    title: localization.cardTitle,
                    hasDivider: true,
                    isChangePermitted: !isEditMode,
                    onChangeClick: this.setEditChangeLink,
                    renderErrorView: (showErrorIcon && !isNewUserFlow && !isGuestCheckout) || !!sectionLevelError,
                    removeMarginTop: isEditMode,
                    sectionLevelError,
                    sectionName: SECTION_NAMES.PAYMENT,
                    ...(renderSubTitle && {
                        subTitle: localization.somePaymentCannotUsed
                    })
                }}
                marginTop={[4, 4, 5]}
                hasPaddingForChildren={false}
                isEditMode={isEditMode}
                isCollapsed={isNewUserFlow}
                ariaLabel={localization.paymentInformation}
                role='region'
                sectionIcon={
                    <Text color='gray'>
                        <Icon
                            name='lock'
                            size='1.25em'
                            marginRight='.4em'
                            aria-hidden='true'
                        />
                        {localization.secure}
                    </Text>
                }
            >
                {!isEditMode ? (
                    <PaymentsDisplay
                        isPaymentComplete={isPaymentComplete}
                        creditCardPaymentGroup={creditCardPaymentGroup}
                        isPaypalSelected={isPaypalSelected}
                        payPalPaymentGroup={payPalPaymentGroup}
                        venmoUsername={venmoUsername}
                        storeCredits={storeCredits}
                        giftCardPaymentGroups={giftCardPaymentGroups}
                        hasGiftCardInOrder={hasGiftCardInOrder || !isCombinableGiftCards}
                        localization={localization}
                        alternatePaymentName={alternatePaymentName}
                        alternateMethodSelected={alternateMethodSelected}
                        checkoutEnabled={
                            isAfterpayEnabledForThisOrder || isKlarnaEnabledForThisOrder || isVenmoEnabledForThisOrder || isPazeEnabledForThisOrder
                        }
                        installmentValue={installmentValue}
                        showError={showErrorIcon}
                        isEfullfillmentOrder={isEfullfillmentOrder}
                        shouldRenderGiftCardSection={isPhysicalGiftCardAndHardGoodShippingGroup}
                    />
                ) : (
                    <Box paddingX={[4, 4, 5]}>
                        <PaymentMethodList
                            {...availablePaymentMethods}
                            setEditChangeLink={this.setEditChangeLink}
                            alternateMethodSelected={alternateMethodSelected}
                            alternatePaymentName={alternatePaymentName}
                            showGiftCard={giftCardPaymentGroups.length < 2 && shouldRenderGiftCardSection}
                            showEditButtonFirst={showErrorIcon}
                            saveBtnSuccessCallback={this.closeEditState}
                            isGuestCheckout={isGuestCheckout}
                            zeroDollarHigherRedeemPointsCVV={zeroDollarHigherRedeemPointsCVV}
                            openCreditCardForm={zeroDollarHigherRedeemPointsNotCVV && !paymentOptions?.creditCards?.length}
                            storeCredits={storeCredits}
                            isPaymentComplete={isPaymentComplete}
                            orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                            showGCAmountNotEnoughMessage={!!gcAmountNotEnoughMessage}
                            isPhysicalGiftCardOnly={isPhysicalGiftCardOnly}
                        />
                    </Box>
                )}
            </LayoutCard>
        );
    }
}

export default wrapComponent(Payment, 'Payment', true);
