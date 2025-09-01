/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Flex, Divider } from 'components/ui';
import CheckoutCreditCardForm from 'components/RwdCheckout/Sections/Payment/CheckoutCreditCardForm';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/RwdCheckout/Sections/Payment/Display';
import CVCInfoModal from 'components/RwdCheckout/Sections/Payment/Section/CVCInfoModal';
import PaymentSectionFooter from 'components/RwdCheckout/Sections/Payment/Section/PaymentSectionFooter';
import CreditCardsList from 'components/RwdCheckout/Sections/Payment/Section/CreditCardsList';
import PaypalRadio from 'components/RwdCheckout/Sections/Payment/Section/PaypalRadio';
import PaymentLogo from 'components/RwdCheckout/PaymentLogo/PaymentLogo';
import OrderUtils from 'utils/Order';
import FormsUtils from 'utils/Forms';
import CheckoutUtils from 'utils/Checkout';
import userUtils from 'utils/User';
import creditCardUtils from 'utils/CreditCard';
import ErrorMsg from 'components/ErrorMsg';
import KlarnaRadio from 'components/RwdCheckout/Sections/Payment/Section/KlarnaRadio';
import KlarnaPaymentMethod from 'components/Klarna/KlarnaPaymentMethod';
import AfterpayRadio from 'components/RwdCheckout/Sections/Payment/Section/AfterpayRadio';
import AfterpayPaymentMethod from 'components/Afterpay/AfterpayPaymentMethod';
import PazeRadio from 'components/RwdCheckout/Sections/Payment/Section/PazeRadio';
import PazePaymentMethod from 'components/Paze/PazePaymentMethod';
import VenmoRadio from 'components/RwdCheckout/Sections/Payment/Section/VenmoRadio';
import VenmoPaymentMethod from 'components/Venmo/VenmoPaymentMethod';
import Venmo from 'utils/Venmo';
import store from 'store/Store';
import ApplePay from 'services/ApplePay';
import utilityApi from 'services/api/utility';
import PayPal from 'utils/PayPal';
import checkoutUtils from 'utils/Checkout';
import Debounce from 'utils/Debounce';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import Location from 'utils/Location';
import checkoutBindings from 'analytics/bindings/pages/checkout/checkoutBindings';
import deepExtend from 'utils/deepExtend';
import pazeUtils from 'utils/Paze';
import mediaUtils from 'utils/Media';
import localeUtils from 'utils/LanguageLocale';

const { Media } = mediaUtils;

const CARD_IMG_SIZE = 32;

const PAYMENT_FLAGS = {
    isPayWithPayPal: 'isPayWithPayPal',
    isPayWithApplePay: 'isPayWithApplePay',
    isPayWithKlarna: OrderUtils.PAYMENT_GROUP_TYPE.KLARNA,
    isPayWithAfterpay: OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY,
    isPayWithPaze: OrderUtils.PAYMENT_GROUP_TYPE.PAZE,
    isPayWithVenmo: OrderUtils.PAYMENT_GROUP_TYPE.VENMO,
    isNewUserPayWithCreditCard: 'isNewUserPayWithCreditCard'
};

class PaymentSectionNewUser extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isNewUserPayWithCreditCard: this.isNewUserPayWithCreditCard({ props }),
            creditCardsToDisplay: 3,
            openCVCModal: false,
            isPayWithPayPal: this.props.isPayPalSelected,
            isPayWithVenmo: this.props.isVenmoSelected
        };
    }

    componentDidMount() {
        if (this.props.creditCardPaymentGroup) {
            this.setNewCreditCard(this.props.creditCardPaymentGroup);
        }

        const editSectionName = FormsUtils.FORMS.CHECKOUT.BILLING_COUNTRIES_LIST;

        if (store.getState().editData[editSectionName]) {
            this.setState({ billingCountries: store.getState().editData[editSectionName] });
        } else {
            utilityApi.getCountryList().then(billingCountries => {
                this.setState({ billingCountries: billingCountries });
                this.props.updateEditDataAction(billingCountries, editSectionName);
            });
        }

        if (Sephora.configurationSettings.isVenmoEnabled) {
            Venmo.prepareVenmoCheckout();
        }

        if (this.props.isPayPalEnabled && this.props.priceInfo) {
            PayPal.preparePaypalCheckout();
        }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isApplePayFlow !== prevState.isApplePayFlow) {
            return { isApplePayFlow: nextProps.isApplePayFlow };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        ApplePay.getApplePaymentType(this.props.orderDetails).then(applePayType => {
            const isApplePayEnabled = applePayType !== ApplePay.TYPES.HIDDEN;

            if (this.state.isApplePayEnabled !== isApplePayEnabled) {
                this.setState({ isApplePayEnabled });
            }
        });

        if (
            (prevProps.klarnaError !== this.props.klarnaError && this.props.klarnaError.error && this.props.klarnaError.error.errorMessage) ||
            prevProps.paymentName !== this.props.paymentName
        ) {
            this.setState({
                isNewUserPayWithCreditCard: this.isNewUserPayWithCreditCard({ props: this.props }),
                isPayWithPayPal: this.props.isPayPalSelected
            });
        }

        const { creditCardPaymentGroup } = this.props;
        const noCreditCardPayment = creditCardPaymentGroup !== prevProps.creditCardPaymentGroup && !creditCardPaymentGroup;
        const noPayment = this.props.paymentName !== prevProps.paymentName && this.props.paymentName;

        if (noCreditCardPayment || noPayment) {
            //needed for if a user adds a giftCard that covers entire order.
            //this way there is no selected credit card if no credit card is needed
            this.newCreditCard = {};
            this.setState({
                selectedCreditCardId: null,
                securityCode: ''
            });
        }

        const creditCardPayment = creditCardPaymentGroup !== prevProps.creditCardPaymentGroup && creditCardPaymentGroup;

        if (creditCardPayment && !this.state.isPayWithApplePay) {
            /*
            Update selected CC if:
            (A) User removes gift card and now requires a credit card for order.
                If credit card already in order, use that.
            (B) if user changes CC data of selectedCreditCardId
            */

            if (!this.state.selectedCreditCardId || this.state.selectedCreditCardId === creditCardPaymentGroup.creditCardId) {
                this.setNewCreditCard(creditCardPaymentGroup, this.props.defaultPayment);
            }
        }
    }

    isNewUserPayWithCreditCard = ({ props }) => {
        const excludedPayments = ['payWithKlarna', 'payWithAfterpay', 'payWithPaze', 'payWithVenmo'];

        const isVenmoExpressFlow = Venmo.isVenmoExpressFlow();

        return !this.props.isPayPalSelected && !isVenmoExpressFlow && !excludedPayments.includes(props.paymentName);
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

        // Analytics - ILLUPH-98437
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, { data: eventData });
    };

    handlePayWithPayPalOnClick = Debounce.preventDoubleClick(isEdit => {
        //if there is no paypal account or the user clicks the edit link
        //show paypal popup and allow user to either add or update paypal account
        if (OrderUtils.containsRestrictedItem()) {
            this.showError(this.props.paypalRestrictedItemError);

            return;
        }

        const isGUestOrder = checkoutUtils.isGuestOrder();

        if (!this.props.paypalOption || isEdit) {
            PayPal.showPayPal(payload => {
                this.props.withInterstice(payload).then(() => {
                    const { commonOrderToggleActions, sectionSaveOrderAction } = this.props;

                    commonOrderToggleActions();
                    sectionSaveOrderAction(Location.getLocation().pathname, this);

                    if (isGUestOrder) {
                        this.switchPaymentState(PAYMENT_FLAGS.isPayWithPayPal);
                    }
                });
            });
        } else {
            this.switchPaymentState(PAYMENT_FLAGS.isPayWithPayPal);

            if (isGUestOrder) {
                checkoutUtils.disablePlaceOrderButtonBasedOnCheckoutCompleteness();
            }
        }

        this.processPaymentClickEvent('checkout:payment:paypal');
    });

    handlePayWithApplePayClick = Debounce.preventDoubleClick(() => {
        this.switchPaymentState(PAYMENT_FLAGS.isPayWithApplePay);

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

    handleNewUserPayWithCreditCardOnClick = () => {
        this.switchPaymentState(PAYMENT_FLAGS.isNewUserPayWithCreditCard);
    };

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

    updateSecurityCode = securityCode => {
        this.setState({ securityCode: securityCode });
    };

    setNewCreditCard = (creditCardData, defaultPayment) => {
        const { setNewCardActions, commonOrderToggleActions } = this.props;

        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';
        this.newCreditCard = {
            creditCard: creditCardUtils.cleanCreditCardData(creditCardData),
            isMarkAsDefault: creditCardIsDefaultPayment && creditCardData.isDefault
        };

        commonOrderToggleActions();
        setNewCardActions();

        this.setState({
            selectedCreditCardId: creditCardData.creditCardId,
            isPayWithPayPal: false,
            isPayWithApplePay: false,
            securityCode: ''
        });
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

        this.setState(
            {
                openCreditCardForm: true,
                editCreditCard: creditCardInfo,
                isUseShipAddressAsBilling: creditCardUtils.isShipAddressBillingAddress(this.props.shippingAddress, creditCardInfo.address)
            },
            () => {
                //Analytics
                const pageDetailPrefix = this.props.isPhysicalGiftCardOnly ? 'gift card ' : '';
                checkoutBindings.processAsyncPageLoad(pageDetailPrefix + 'payment-edit credit card');
            }
        );
    };
    closeCreditCardForm = () => {
        this.setState({
            openCreditCardForm: false,
            editCreditCard: null
        });
    };

    showError = message => {
        this.setState({ errorMessage: message });
    };

    renderVenmoPaymentMethod = () => {
        const { isGiftCardShow, defaultPayment, isVenmoEnabledForThisOrder } = this.props;

        return (
            localeUtils.isUS() && (
                <VenmoRadio
                    defaultPayment={defaultPayment}
                    disabled={!isVenmoEnabledForThisOrder}
                    onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.VENMO)}
                >
                    <VenmoPaymentMethod isGiftCardShow={isGiftCardShow} />
                </VenmoRadio>
            )
        );
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isZeroCheckout,
            shippingAddress,
            creditCardOptions = [],
            defaultPayment,
            paypalOption,
            isBopis,
            isSddOrder,
            isGiftCardShow,
            creditCardPaymentGroup,
            isPayPalEnabled,
            isKlarnaEnabledForThisOrder,
            isAfterpayEnabledForThisOrder,
            isPazeEnabledForThisOrder,
            isAfterpayEnabledForThisProfile,
            paymentName,
            payWithCreditOrDebitCard,
            visaOrMastercard,
            isCanada
        } = this.props;

        const {
            selectedCreditCardId,
            creditCardsToDisplay,
            editCreditCard,
            isUseShipAddressAsBilling,
            isNewUserPayWithCreditCard,
            isPayWithPayPal,
            errorMessage,
            isApplePayFlow,
            isApplePayEnabled,
            isPayWithApplePay,
            openCreditCardForm,
            billingCountries,
            securityCode,
            securityCodeInvalid,
            hasAutoReplenishItemInBasket
        } = this.state;

        const isGuestOrder = CheckoutUtils.isGuestOrder();

        const newCreditCard = {
            firstName: shippingAddress ? shippingAddress.firstName : '',
            lastName: shippingAddress ? shippingAddress.lastName : '',
            address: { country: userUtils.getShippingCountry().countryCode }
        };

        const displayedCreditCards = creditCardOptions.slice(0, creditCardsToDisplay);
        const numberOfSavedCreditCards = creditCardUtils.numberOfSavedCards(creditCardOptions);
        const { isKlarnaPaymentEnabled, afterpayEnabled: isAfterpayPaymentEnabled, isVenmoEnabled } = Sephora.configurationSettings;
        const paymentGroupType = isCanada ? OrderUtils.PAYMENT_GROUP_TYPE.DEBIT_CARD : OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD;
        const paymentType = isCanada ? OrderUtils.PAYMENT_TYPE.DEBIT_CARD : OrderUtils.PAYMENT_TYPE.CREDIT_CARD;
        const shouldDisplayAlternatePaymentMethods = !openCreditCardForm && !isZeroCheckout;

        const isKlarnaSelected = paymentName === 'payWithKlarna';
        const isAfterpaySelected = paymentName === 'payWithAfterpay';
        const isPazeSelected = paymentName === 'payWithPaze';
        const isVenmoSelected = paymentName === 'payWithVenmo';

        const paymentLogos = (
            <Box
                marginLeft={[null, 4]}
                fontSize={CARD_IMG_SIZE}
            >
                <PaymentLogo
                    paymentGroupType={paymentGroupType}
                    paymentType={paymentType}
                    isMultiCardMode={true}
                />
            </Box>
        );

        return (
            <div>
                <div>
                    {errorMessage && <ErrorMsg children={errorMessage} />}
                    {shouldDisplayAlternatePaymentMethods && (
                        <div>
                            {isPayPalEnabled && (
                                <PaypalRadio
                                    ref={'paypal'}
                                    isZeroCheckout={isZeroCheckout}
                                    isPayWithPayPal={isPayWithPayPal}
                                    paypalOption={paypalOption}
                                    handlePayWithPayPalOnClick={this.handlePayWithPayPalOnClick}
                                />
                            )}
                            {isVenmoEnabled && this.renderVenmoPaymentMethod()}
                            {isKlarnaPaymentEnabled && (
                                <KlarnaRadio
                                    defaultPayment={defaultPayment}
                                    disabled={!isKlarnaEnabledForThisOrder}
                                    onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.KLARNA)}
                                >
                                    <KlarnaPaymentMethod />
                                </KlarnaRadio>
                            )}
                            {isAfterpayPaymentEnabled && isAfterpayEnabledForThisProfile && (
                                <AfterpayRadio
                                    defaultPayment={defaultPayment}
                                    disabled={!isAfterpayEnabledForThisOrder}
                                    onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY)}
                                >
                                    <AfterpayPaymentMethod />
                                </AfterpayRadio>
                            )}
                            {pazeUtils.isPazeVisible() && (
                                <PazeRadio
                                    defaultPayment={defaultPayment}
                                    disabled={!isPazeEnabledForThisOrder}
                                    onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.PAZE)}
                                >
                                    <PazePaymentMethod />
                                </PazeRadio>
                            )}
                            {isApplePayEnabled && isGuestOrder && (
                                <div>
                                    <Radio
                                        paddingY={3}
                                        dotOffset={0}
                                        alignItems='center'
                                        name='payWithApplePay'
                                        checked={isPayWithApplePay}
                                        onClick={this.handlePayWithApplePayClick}
                                    >
                                        <PaymentDisplay
                                            isBopis={isBopis}
                                            isSddOrder={isSddOrder}
                                            isApplePay={true}
                                            hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                                        />
                                    </Radio>
                                    <Divider marginY={[null, 3]} />
                                </div>
                            )}
                        </div>
                    )}
                    {displayedCreditCards.length === 0 ? (
                        <div>
                            <Radio
                                paddingY={3}
                                alignItems='center'
                                name='payWithCreditCard'
                                checked={isNewUserPayWithCreditCard}
                                onClick={this.handleNewUserPayWithCreditCardOnClick}
                            >
                                <Flex alignItems='center'>
                                    <div>
                                        <b data-at={Sephora.debug.dataAt('pay_with_credit_or_debit_label')}>{payWithCreditOrDebitCard}</b>
                                        {isCanada && (
                                            <Box
                                                color='gray'
                                                fontSize='sm'
                                                data-at={Sephora.debug.dataAt('visa_and_mastercard_only_label')}
                                            >
                                                {visaOrMastercard}
                                            </Box>
                                        )}
                                    </div>
                                    <Media greaterThan='xs'>{paymentLogos}</Media>
                                </Flex>
                            </Radio>
                            <Media lessThan='sm'>{paymentLogos}</Media>

                            {isNewUserPayWithCreditCard && (
                                <Box marginTop={4}>
                                    <CheckoutCreditCardForm
                                        editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.CREDIT_CARD, true)}
                                        creditCard={newCreditCard}
                                        defaultPayment={defaultPayment}
                                        shippingAddress={shippingAddress}
                                        isUseShippingAddressAsBilling={!!shippingAddress}
                                        isFirstCreditCard={true}
                                        isNewUserFlow={true}
                                        isDefault={true}
                                        billingCountries={billingCountries}
                                        isBopis={isBopis}
                                        isGiftCardShow={isGiftCardShow}
                                    />
                                </Box>
                            )}
                        </div>
                    ) : (
                        <div>
                            {openCreditCardForm ? (
                                <Box marginTop={4}>
                                    <CheckoutCreditCardForm
                                        editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.CREDIT_CARD, true)}
                                        creditCard={editCreditCard || newCreditCard}
                                        defaultPayment={defaultPayment}
                                        cardType={editCreditCard && OrderUtils.getThirdPartyCreditCard(editCreditCard)}
                                        shippingAddress={shippingAddress}
                                        isUseShippingAddressAsBilling={isUseShipAddressAsBilling}
                                        isDefault={editCreditCard ? editCreditCard.isDefault : false}
                                        cancelCallback={this.closeCreditCardForm}
                                        billingCountries={billingCountries}
                                        isEditMode={!!editCreditCard}
                                        isFirstCreditCard={editCreditCard ? numberOfSavedCreditCards === 1 : numberOfSavedCreditCards === 0}
                                        isBopis={isBopis}
                                    />
                                </Box>
                            ) : (
                                <div data-at={Sephora.debug.dataAt('credit_cards_area')}>
                                    <CreditCardsList
                                        defaultPayment={defaultPayment}
                                        cards={displayedCreditCards}
                                        securityCode={securityCode}
                                        securityCodeInvalid={securityCodeInvalid}
                                        selectedCreditCardId={selectedCreditCardId}
                                        creditCardPaymentGroup={creditCardPaymentGroup}
                                        setNewCreditCard={this.setNewCreditCard}
                                        showEditCreditCardForm={this.showEditCreditCardForm}
                                        updateSecurityCode={this.updateSecurityCode}
                                        creditCardOptions={this.creditCardOptions}
                                        isBopis={isBopis}
                                        isZeroCheckout={isZeroCheckout}
                                        onRef={comp => (this.creditCardsList = comp)}
                                    />
                                    <PaymentSectionFooter
                                        creditCardOptions={creditCardOptions}
                                        isBopis={isBopis}
                                        isSddOrder={isSddOrder}
                                        isApplePayFlow={isApplePayFlow}
                                        isKlarnaFlow={isKlarnaSelected}
                                        isVenmoFlow={isVenmoSelected}
                                        isPazeFlow={isPazeSelected}
                                        isPayWithPayPal={isPayWithPayPal}
                                        selectedCreditCardId={selectedCreditCardId}
                                        securityCode={securityCode}
                                        newCreditCard={this.newCreditCard}
                                        parentToValidate={this}
                                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                                        {...this.props}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {displayedCreditCards.length === 0 && (isPayWithPayPal || isPayWithApplePay || isVenmoSelected) && (
                        <PaymentSectionFooter
                            creditCardOptions={creditCardOptions}
                            isBopis={isBopis}
                            isSddOrder={isSddOrder}
                            isApplePayFlow={isApplePayFlow}
                            isKlarnaFlow={isKlarnaSelected}
                            isAfterpayFlow={isAfterpaySelected}
                            isPazeFlow={isPazeSelected}
                            isVenmoFlow={isVenmoSelected}
                            isPayWithPayPal={isPayWithPayPal}
                            selectedCreditCardId={selectedCreditCardId}
                            securityCode={securityCode}
                            newCreditCard={this.newCreditCard}
                            parentToValidate={this}
                            {...this.props}
                        />
                    )}
                </div>

                <CVCInfoModal />
            </div>
        );
    }
}

export default wrapComponent(PaymentSectionNewUser, 'PaymentSectionNewUser');
