/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import Paypal from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Paypal';
import processEvent from 'analytics/processEvent';
import OrderUtils from 'utils/Order';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import Klarna from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Klarna/Klarna';
import Venmo from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Venmo/Venmo';
import AfterPay from 'components/FrictionlessCheckout/Payment/PaymentMethodList/AfterPay/AfterPay';
import Paze from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Paze/Paze';
import Apple from 'components/FrictionlessCheckout/Payment/PaymentMethodList/Apple';
import Debounce from 'utils/Debounce';
import checkoutUtils from 'utils/Checkout';
import ApplePay from 'services/ApplePay';
import AccordionButton from 'components/FrictionlessCheckout/LayoutCard/AccordionButton';
import { Box, Icon } from 'components/ui';
import CreditCardArea from 'components/FrictionlessCheckout/Payment/CreditCard/CreditCardArea';
import GiftCard from 'components/FrictionlessCheckout/Payment/GiftCard';
import AppliedGiftCards from 'components/FrictionlessCheckout/Payment/AppliedGiftCards';
import AddCreditCardButton from 'components/FrictionlessCheckout/Payment/CreditCard/AddCreditCardButton';
import CreditCardsList from 'components/FrictionlessCheckout/Payment/PaymentMethodList/CreditCardsList';
import creditCardUtils from 'utils/CreditCard';
import deepExtend from 'utils/deepExtend';
import checkoutBindings from 'analytics/bindings/pages/checkout/checkoutBindings';
import ErrorsUtils from 'utils/Errors';
import ErrorMsg from 'components/ErrorMsg';
import AccountCredit from 'components/FrictionlessCheckout/Payment/PaymentMethodList/AccountCredit';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import { PAYMENT_TYPES } from 'constants/RwdBasket';
import { screenReaderOnlyStyle } from 'style/config';
import { SECTION_NAMES } from 'constants/frictionlessCheckout';

const { PAYMENT_FLAGS } = OrderUtils;

class PaymentMethodList extends BaseClass {
    state = {
        openCVCModal: false,
        isPayWithPayPal: this.props.isPayPalSelected,
        shouldShowPaze: false,
        openCreditCardForm: this.props.openCreditCardForm,
        isApplePayEnabled: false,
        isApplePayFlow: false,
        isPayWithApplePay: false,
        selectedCreditCardId: null
    };

    componentDidMount() {
        const { creditCardPaymentGroup, defaultPayment, isPayPalSelected, paymentName } = this.props;

        if ((!creditCardPaymentGroup.isComplete && this.state.selectedCreditCardId) || paymentName) {
            this.newCreditCard = {};
            this.setState({
                selectedCreditCardId: null,
                securityCode: ''
            });
        } else if (creditCardPaymentGroup.isComplete && !this.state.isPayWithApplePay) {
            /*
             Update selected CC if:
             (A) User removes gift card and now requires a credit card for order.
                If credit card already in order, use that.
             (B) if user changes CC data of selectedCreditCardId
            */
            if (!this.state.selectedCreditCardId || this.state.selectedCreditCardId === creditCardPaymentGroup.creditCardId) {
                this.setNewCreditCard(creditCardPaymentGroup, defaultPayment);
            }
        }

        //check if payment section is complete (if terms and conditions have been checked)
        //if not, then if paypal was updated, select paypal radio button or
        //if credit card form is open, close the form
        if (!checkoutUtils.isPaymentSectionComplete()) {
            if (isPayPalSelected && !this.state.isPayWithPayPal) {
                this.switchPaymentState(PAYMENT_FLAGS.isPayWithPayPal);
            }
        }
    }

    componentDidUpdate(prevProps) {
        const shouldOpenForm = this.props.openCreditCardForm && !this.state.openCreditCardForm;

        if (prevProps.openCreditCardForm !== this.props.openCreditCardForm && shouldOpenForm) {
            this.setState({ openCreditCardForm: true });
        }
    }

    toggleOpenCreditCardForm = () => {
        this.setState(
            prevState => ({
                openCreditCardForm: !prevState.openCreditCardForm,
                isEditCCFlow: false
            }),
            () => {
                if (this.state?.openCreditCardForm) {
                    const pageDetailPrefix = this.props.isPhysicalGiftCardOnly ? 'gift card ' : '';
                    checkoutBindings.processAsyncPageLoad(pageDetailPrefix + 'payment-add credit card');
                }
            }
        );
    };

    handlePayWithApplePayClick = Debounce.preventDoubleClick(() => {
        this.switchPaymentState(PAYMENT_FLAGS.isPayWithApplePay);
        this.props.swapPaypalToCreditCard();

        if (checkoutUtils.isGuestOrder()) {
            ApplePay.enableGuestCheckout();
        }

        this.processPaymentClickEvent('checkout:payment:applepay');
    });

    handlePaymentClick = paymentType =>
        Debounce.preventDoubleClick(() => {
            this.switchPaymentState(paymentType);
            const paymentName = OrderUtils.getPaymentNameByType(paymentType);
            this.processPaymentClickEvent(`checkout:payment:${paymentName}`);
        });

    switchPaymentState = selectedPayment => {
        const newState = { selectedCreditCardId: null };
        Object.keys(PAYMENT_FLAGS).forEach(x => (newState[x] = selectedPayment === PAYMENT_FLAGS[x]));
        this.setState(newState, () => this.updatePayment(selectedPayment));

        processEvent.process(anaConsts.ADD_PAYMENTINFO_EVENT, {
            data: {
                paymentType: selectedPayment
            }
        });
    };

    updatePayment = selectedPayment => {
        const { updatePaymentActions, commonOrderToggleActions } = this.props;

        commonOrderToggleActions(
            selectedPayment === PAYMENT_FLAGS.isPayWithApplePay,
            selectedPayment === PAYMENT_FLAGS.isPayWithKlarna,
            selectedPayment === PAYMENT_FLAGS.isPayWithAfterpay,
            selectedPayment === PAYMENT_FLAGS.isPayWithVenmo
        );

        updatePaymentActions(selectedPayment === PAYMENT_FLAGS.isPayWithPaze, selectedPayment === PAYMENT_FLAGS.isPayWithApplePay);
    };

    setNewCreditCard = (creditCardData, defaultPayment) => {
        const {
            utilMerge, klarnaToggle, afterPayToggle, pazeToggle, venmoToggle, afterPayResetError
        } = this.props;
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';
        this.newCreditCard = {
            creditCard: creditCardUtils.cleanCreditCardData(creditCardData),
            isMarkAsDefault: creditCardIsDefaultPayment && creditCardData.isDefault
        };

        utilMerge('order', 'isApplePayFlow', false);
        klarnaToggle(false);
        afterPayToggle(false);
        pazeToggle(false);
        venmoToggle(false);
        afterPayResetError();

        this.setState({
            selectedCreditCardId: creditCardData.creditCardId,
            isPayWithPayPal: false,
            isPayWithApplePay: false,
            securityCode: ''
        });
    };

    processPaymentClickEvent = actionInfo => {
        const eventData = {
            eventStrings: [anaConsts.Event.EVENT_71],
            linkName: 'D=c55',
            actionInfo: actionInfo
        };

        const mostRecentAsyncLoadEvent = analyticsUtils.getMostRecentEvent('asyncPageLoad');

        if (mostRecentAsyncLoadEvent) {
            eventData.previousPage = mostRecentAsyncLoadEvent.eventInfo.attributes.previousPageName;
        }

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: eventData });
    };

    showEditCreditCardForm = prevCreditCardInfo => {
        const creditCardInfo = deepExtend({}, prevCreditCardInfo);

        //format exp month for edit credit card
        if (creditCardInfo.expirationMonth.length === 1) {
            creditCardInfo.expirationMonth = creditCardUtils.formatExpMonth(creditCardInfo.expirationMonth);
        }

        //format exp year for edit credit card
        if (creditCardInfo.expirationYear.length === 4) {
            creditCardInfo.expirationYear = creditCardUtils.formatExpYear(creditCardInfo.expirationYear);
        }

        creditCardInfo.expirationDate = `${creditCardInfo.expirationMonth}/${creditCardInfo.expirationYear}`;

        this.setState(
            {
                openCreditCardForm: true,
                editCreditCard: creditCardInfo,
                isEditCCFlow: true,
                isUseShipAddressAsBilling: creditCardUtils.isShipAddressBillingAddress(this.props.shippingAddress, creditCardInfo.address)
            },
            () => {
                //Analytics
                const pageDetailPrefix = this.props.isPhysicalGiftCardOnly ? 'gift card ' : '';
                checkoutBindings.processAsyncPageLoad(pageDetailPrefix + 'payment-edit credit card');
            }
        );
    };

    updateSecurityCode = securityCode => {
        this.setState({ securityCode: securityCode });
    };

    saveAndContinue = e => {
        e.preventDefault();
        ErrorsUtils.clearErrors();
        const componentsToValidate = [];

        if (this.creditCardsList?.refs?.securityCodeInput) {
            componentsToValidate.push(this.creditCardsList.refs.securityCodeInput);
        }

        ErrorsUtils.collectClientFieldErrors(componentsToValidate);

        if (!ErrorsUtils.validate()) {
            // Handle the case when PayPal is selected
            if (this.state.isPayWithPayPal) {
                this.props.setEditChangeLink(false);
            }

            // Set security code on credit card if present
            if (this.state.securityCode) {
                this.newCreditCard.creditCard.securityCode = this.state.securityCode;
            }

            // Handle the case when a credit card is selected
            if (this.state.selectedCreditCardId) {
                if (this.newCreditCard) {
                    // delete property as it is not required for updateCreditCardOnOrder API
                    delete this.newCreditCard.creditCard?.isCVVValidationRequired;
                }

                this.props.newCreditCardWithInterstice(this.props.defaultPayment, this.props.paymentOptions.creditCards, true)(
                    this.newCreditCard,
                    'select',
                    this,
                    this.props.saveBtnSuccessCallback
                );
            } else if (!this.state.isPayWithPayPal) {
                // Handle the case when no credit card or PayPal is selected
                // This happens when a gift card covers the entire order amount
                // Close the edit mode, accepting the gift card as the only payment method

                if (this.props.sectionErrors?.Payment) {
                    FrictionlessCheckoutBindings.setSectionLevelErrorAnalytics(SECTION_NAMES.PAYMENT, this.props.sectionErrors?.Payment);
                    this.props.setCheckoutSectionErrors(this.props.sectionErrors);
                } else if (this.props.saveBtnSuccessCallback) {
                    this.props.setEditChangeLink(false);
                    this.props.saveBtnSuccessCallback();
                }
            }
        }
    };

    saveAndContinueDebounce = Debounce.preventDoubleClick(this.saveAndContinue);

    renderGiftCard = () => {
        const {
            showGiftCard,
            alternateMethodSelected,
            isGuestCheckout,
            alternatePaymentName,
            zeroDollarHigherRedeemPointsCVV,
            hasGiftCardInOrder,
            isPhysicalGiftCardOnly
        } = this.props;

        const shouldRenderGiftCard = (showGiftCard || (isGuestCheckout && !isPhysicalGiftCardOnly)) && !alternateMethodSelected;
        const isVenmoSelected = alternatePaymentName === PAYMENT_TYPES.PAY_VENMO;

        if ((shouldRenderGiftCard || isVenmoSelected) && !zeroDollarHigherRedeemPointsCVV && hasGiftCardInOrder) {
            return (
                <Box marginTop={5}>
                    <GiftCard isEditMode />
                </Box>
            );
        }

        return null;
    };

    render() {
        const {
            paymentOptions,
            isKlarnaEnabledForThisOrder,
            isVenmoEnabledForThisOrder,
            isAfterpayEnabledForThisOrder,
            isAfterpayEnabledForThisProfile,
            isPazeEnabledForThisOrder,
            isPayPalSelected,
            shouldDisplayAddOrDeleteCreditCardButton,
            alternateMethodSelected,
            orderDetails,
            isZeroCheckout,
            isBopis,
            creditCardPaymentGroup,
            showEditButtonFirst,
            showGCAmountNotEnoughMessage,
            isCreditCardRequiredMessage,
            hasAutoReplenishItemInBasket,
            zeroDollarHigherRedeemPointsCVV,
            isApplePayFlow,
            storeCredits,
            isPaymentComplete,
            locales,
            orderHasPhysicalGiftCard
        } = this.props;

        const {
            isPayWithApplePay, isPayWithPayPal, openCreditCardForm, securityCodeInvalid, securityCode
        } = this.state;

        const storeCreditNotEnough = storeCredits?.length > 0 && !isPaymentComplete;

        return (
            <>
                {openCreditCardForm && (
                    <CreditCardArea
                        handleCloseForm={this.toggleOpenCreditCardForm}
                        callback={this.props.setEditChangeLink}
                        editCreditCard={this.state.editCreditCard}
                        isEditCCFlow={this.state.isEditCCFlow}
                        isGuestCheckout={this.props.isGuestCheckout}
                        hideCancelButton={this.props.openCreditCardForm}
                    />
                )}
                {!openCreditCardForm && (
                    <>
                        {showGCAmountNotEnoughMessage ||
                            ((storeCreditNotEnough || isCreditCardRequiredMessage?.length > 0) && (
                                <ErrorMsg
                                    mt={4}
                                    backgroundColor='nearWhite'
                                    paddingX={4}
                                    paddingY={3}
                                    color='black'
                                    borderRadius={2}
                                    display='flex'
                                    alignItems='center'
                                    fontSize='base'
                                    role='alert'
                                    aria-live='polite'
                                >
                                    <Icon
                                        name='alert'
                                        color='gray'
                                        size={16}
                                        marginRight={2}
                                        aria-hidden='true'
                                    />
                                    <span>
                                        {isCreditCardRequiredMessage?.length > 0 ? isCreditCardRequiredMessage : locales.storeCreditNotEnoughMessage}
                                    </span>
                                </ErrorMsg>
                            ))}

                        <fieldset>
                            <Box
                                is='legend'
                                css={screenReaderOnlyStyle}
                            >
                                {locales.paymentMethodSelection}
                            </Box>
                            {paymentOptions?.creditCards?.length > 0 && (
                                <CreditCardsList
                                    cards={paymentOptions?.creditCards}
                                    isZeroCheckout={isZeroCheckout}
                                    isBopis={isBopis}
                                    setNewCreditCard={this.setNewCreditCard}
                                    showEditCreditCardForm={this.showEditCreditCardForm}
                                    updateSecurityCode={this.updateSecurityCode}
                                    shouldDisplayAddOrDeleteCreditCardButton={!zeroDollarHigherRedeemPointsCVV}
                                    defaultPayment={paymentOptions?.defaultPayment}
                                    securityCode={securityCode}
                                    securityCodeInvalid={securityCodeInvalid}
                                    selectedCreditCardId={this.state.selectedCreditCardId}
                                    creditCardPaymentGroup={creditCardPaymentGroup}
                                    creditCardOptions={paymentOptions?.creditCards}
                                    showEditButtonFirst={showEditButtonFirst}
                                    onRef={comp => (this.creditCardsList = comp)}
                                />
                            )}

                            {storeCredits?.length > 0 &&
                                storeCredits.map((storeCredit, index) => (
                                    <AccountCredit
                                        key={`storeCredits_${index.toString()}`}
                                        storeCredit={storeCredit}
                                        locales={locales}
                                    />
                                ))}

                            {/* Display existing gift cards */}
                            <AppliedGiftCards />

                            {!Sephora.isAgent && !isZeroCheckout && (
                                <>
                                    <Paypal
                                        isPayPalSelected={isPayWithPayPal}
                                        switchPaymentState={this.switchPaymentState}
                                        processPaymentClickEvent={this.processPaymentClickEvent}
                                        callback={this.props.setEditChangeLink}
                                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                                        orderHasPhysicalGiftCard={orderHasPhysicalGiftCard}
                                    />
                                    <Venmo
                                        isVenmoEnabledForThisOrder={isVenmoEnabledForThisOrder}
                                        defaultPayment={paymentOptions.defaultPayment}
                                        handlePaymentClick={this.handlePaymentClick}
                                    />
                                    <Klarna
                                        isKlarnaEnabledForThisOrder={isKlarnaEnabledForThisOrder}
                                        defaultPayment={paymentOptions.defaultPayment}
                                        handlePaymentClick={this.handlePaymentClick}
                                    />
                                    <AfterPay
                                        isKlarnaEnabledForThisOrder={isKlarnaEnabledForThisOrder}
                                        defaultPayment={paymentOptions.defaultPayment}
                                        isAfterpayEnabledForThisOrder={isAfterpayEnabledForThisOrder}
                                        isAfterpayEnabledForThisProfile={isAfterpayEnabledForThisProfile}
                                        handlePaymentClick={this.handlePaymentClick}
                                    />
                                    <Paze
                                        defaultPayment={paymentOptions.defaultPayment}
                                        handlePaymentClick={this.handlePaymentClick}
                                        isPazeEnabledForThisOrder={isPazeEnabledForThisOrder}
                                    />
                                    <Apple
                                        isPayWithApplePay={isPayWithApplePay}
                                        handlePayWithApplePayClick={this.handlePayWithApplePayClick}
                                        orderDetails={orderDetails}
                                    />
                                </>
                            )}
                        </fieldset>
                        {/*  <CreditCardArea isZeroCheckout={isZeroCheckout} /> */}
                        {shouldDisplayAddOrDeleteCreditCardButton && <AddCreditCardButton onClick={this.toggleOpenCreditCardForm} />}

                        {/* Always show gift card for guest users */}
                        {this.renderGiftCard()}

                        {(isPayPalSelected || !alternateMethodSelected) && (
                            <Box marginBottom={[1, 2]}>
                                {!isApplePayFlow && (
                                    <AccordionButton
                                        onClick={this.saveAndContinueDebounce}
                                        marginTop={[4, 5]}
                                    />
                                )}
                            </Box>
                        )}
                    </>
                )}
            </>
        );
    }
}

export default wrapComponent(PaymentMethodList, 'PaymentMethodList', true);
