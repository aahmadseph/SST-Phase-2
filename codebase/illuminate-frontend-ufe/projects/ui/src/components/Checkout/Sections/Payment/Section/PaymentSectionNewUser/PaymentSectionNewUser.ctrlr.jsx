/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Flex, Divider } from 'components/ui';
import CheckoutCreditCardForm from 'components/Checkout/Sections/Payment/CheckoutCreditCardForm/CheckoutCreditCardForm';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/Checkout/Sections/Payment/Display/PaymentDisplay';
import CVCInfoModal from 'components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';
import PaymentSectionFooter from 'components/Checkout/Sections/Payment/Section/PaymentSectionFooter/PaymentSectionFooter';
import CreditCardsList from 'components/Checkout/Sections/Payment/Section/CreditCardsList/CreditCardsList';
import PaypalRadio from 'components/Checkout/Sections/Payment/Section/PaypalRadio/PaypalRadio';
import PaymentLogo from 'components/Checkout/PaymentLogo/PaymentLogo';
import OrderUtils from 'utils/Order';
import FormsUtils from 'utils/Forms';
import CheckoutUtils from 'utils/Checkout';
import userUtils from 'utils/User';
import creditCardUtils from 'utils/CreditCard';
import ErrorMsg from 'components/ErrorMsg';
import localeUtils from 'utils/LanguageLocale';
import KlarnaRadio from 'components/Checkout/Sections/Payment/Section/KlarnaRadio';
import KlarnaPaymentMethod from 'components/Klarna/KlarnaPaymentMethod';
import AfterpayRadio from 'components/Checkout/Sections/Payment/Section/AfterpayRadio';
import AfterpayPaymentMethod from 'components/Afterpay/AfterpayPaymentMethod';
import PazeRadio from 'components/Checkout/Sections/Payment/Section/PazeRadio';
import PazePaymentMethod from 'components/Paze/PazePaymentMethod';
import store from 'store/Store';
import ApplePay from 'services/ApplePay';
import utilityApi from 'services/api/utility';
import EditDataActions from 'actions/EditDataActions';
import PayPal from 'utils/PayPal';
import checkoutUtils from 'utils/Checkout';
import Debounce from 'utils/Debounce';
import anaConsts from 'analytics/constants';
import analyticsUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import decorators from 'utils/decorators';
import checkoutApi from 'services/api/checkout';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import UtilActions from 'utils/redux/Actions';
import KlarnaActions from 'actions/KlarnaActions';
import AfterpayActions from 'actions/AfterpayActions';
import OrderActions from 'actions/OrderActions';
import PazeActions from 'actions/PazeActions';
import Location from 'utils/Location';
import checkoutBindings from 'analytics/bindings/pages/checkout/checkoutBindings';
import deepExtend from 'utils/deepExtend';
import pazeUtils from 'utils/Paze';

const CARD_IMG_SIZE = 32;

const PAYMENT_FLAGS = {
    isPayWithPayPal: 'isPayWithPayPal',
    isPayWithApplePay: 'isPayWithApplePay',
    isPayWithKlarna: OrderUtils.PAYMENT_GROUP_TYPE.KLARNA,
    isPayWithAfterpay: OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY,
    isPayWithPaze: OrderUtils.PAYMENT_GROUP_TYPE.PAZE,
    isNewUserPayWithCreditCard: 'isNewUserPayWithCreditCard'
};

class PaymentSectionNewUser extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isNewUserPayWithCreditCard: this.isNewUserPayWithCreditCard({ props }),
            creditCardsToDisplay: 3,
            openCVCModal: false,
            isPayWithPayPal: this.props.isPayPalSelected
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
                store.dispatch(EditDataActions.updateEditData(billingCountries, editSectionName));
            });
        }

        if (this.props.isPayPalEnabled) {
            store.setAndWatch('order.orderDetails.priceInfo', this, () => {
                PayPal.preparePaypalCheckout();
            });
        }

        store.setAndWatch('order.orderDetails', this, order => {
            ApplePay.getApplePaymentType(order.orderDetails).then(applePayType => {
                this.setState({ isApplePayEnabled: applePayType !== ApplePay.TYPES.HIDDEN });
            });
        });

        store.setAndWatch('order.isApplePayFlow', this, null, true);

        store.setAndWatch('klarna.error', this, data => {
            data.error &&
                data.error.errorMessage &&
                this.setState({
                    isNewUserPayWithCreditCard: !this.props.isPayPalSelected,
                    isPayWithPayPal: this.props.isPayPalSelected
                });
        });
    }

    componentWillReceiveProps(updatedProps) {
        const creditCardPaymentGroup = updatedProps.creditCardPaymentGroup;

        if ((!creditCardPaymentGroup && this.state.selectedCreditCardId) || updatedProps.paymentName) {
            //needed for if a user adds a giftCard that covers entire order.
            //this way there is no selected credit card if no credit card is needed
            this.newCreditCard = {};
            this.setState({
                selectedCreditCardId: null,
                securityCode: '',
                isNewUserPayWithCreditCard: this.isNewUserPayWithCreditCard({ props: updatedProps })
            });
        } else if (creditCardPaymentGroup && !this.state.isPayWithApplePay) {
            /*
             Update selected CC if:
             (A) User removes gift card and now requires a credit card for order.
                If credit card already in order, use that.
             (B) if user changes CC data of selectedCreditCardId
            */
            if (!this.state.selectedCreditCardId || this.state.selectedCreditCardId === creditCardPaymentGroup.creditCardId) {
                this.setNewCreditCard(creditCardPaymentGroup, updatedProps.defaultPayment);
            }
        }

        //check if payment section is complete (if terms and conditions have been checked)
        //if not, then if paypal was updated, select paypal radio button or
        //if credit card form is open, close the form
        if (!checkoutUtils.isPaymentSectionComplete()) {
            if (updatedProps.isPayPalSelected && !this.state.isPayWithPayPal) {
                this.switchPaymentState(PAYMENT_FLAGS.isPayWithPayPal);
            }

            if (this.state.openCreditCardForm) {
                this.closeCreditCardForm();
            }
        }
    }

    isNewUserPayWithCreditCard = ({ props }) => {
        const excludedPayments = ['payWithKlarna', 'payWithAfterpay', 'payWithPaze'];

        return !this.props.isPayPalSelected && !excludedPayments.includes(props.paymentName);
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
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');

        if (OrderUtils.containsRestrictedItem()) {
            this.showError(getText('paypalRestrictedItemError'));

            return;
        }

        const isGUestOrder = checkoutUtils.isGuestOrder();

        if (!this.props.paypalOption || isEdit) {
            PayPal.showPayPal(payload => {
                decorators
                    .withInterstice(checkoutApi.updatePayPalCheckout, INTERSTICE_DELAY_MS)(payload, 'update')
                    .then(() => {
                        store.dispatch(UtilActions.merge('order', 'isApplePayFlow', false));
                        store.dispatch(KlarnaActions.toggleSelect(false));
                        store.dispatch(AfterpayActions.toggleSelect(false));
                        store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname, this));

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
        store.dispatch(UtilActions.merge('order', 'isApplePayFlow', selectedPayment === PAYMENT_FLAGS.isPayWithApplePay));
        store.dispatch(KlarnaActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithKlarna));
        store.dispatch(AfterpayActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithAfterpay));
        store.dispatch(PazeActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithPaze));
        store.dispatch(AfterpayActions.resetError());
        store.dispatch(OrderActions.orderReviewIsActive(selectedPayment === PAYMENT_FLAGS.isPayWithApplePay));
    };

    updateSecurityCode = securityCode => {
        this.setState({ securityCode: securityCode });
    };

    setNewCreditCard = (creditCardData, defaultPayment) => {
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';
        this.newCreditCard = {
            creditCard: creditCardUtils.cleanCreditCardData(creditCardData),
            isMarkAsDefault: creditCardIsDefaultPayment && creditCardData.isDefault
        };

        store.dispatch(UtilActions.merge('order', 'isApplePayFlow', false));
        store.dispatch(KlarnaActions.toggleSelect(false));
        store.dispatch(AfterpayActions.toggleSelect(false));
        store.dispatch(AfterpayActions.resetError());

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

    /* eslint-disable-next-line complexity */
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');
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
            paymentName
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

        const isMobile = Sephora.isMobile();
        const isGuestOrder = CheckoutUtils.isGuestOrder();

        const newCreditCard = {
            firstName: shippingAddress ? shippingAddress.firstName : '',
            lastName: shippingAddress ? shippingAddress.lastName : '',
            address: { country: userUtils.getShippingCountry().countryCode }
        };

        const displayedCreditCards = creditCardOptions.slice(0, creditCardsToDisplay);
        const numberOfSavedCreditCards = creditCardUtils.numberOfSavedCards(creditCardOptions);
        const { isKlarnaPaymentEnabled, afterpayEnabled: isAfterpayPaymentEnabled } = Sephora.configurationSettings;
        const paymentGroupType = localeUtils.isCanada() ? OrderUtils.PAYMENT_GROUP_TYPE.DEBIT_CARD : OrderUtils.PAYMENT_GROUP_TYPE.CREDIT_CARD;
        const paymentType = localeUtils.isCanada() ? OrderUtils.PAYMENT_TYPE.DEBIT_CARD : OrderUtils.PAYMENT_TYPE.CREDIT_CARD;
        const shouldDisplayAlternatePaymentMethods = !openCreditCardForm && !isZeroCheckout;

        const isKlarnaSelected = paymentName === 'payWithKlarna';
        const isAfterpaySelected = paymentName === 'payWithAfterpay';
        const isPazeSelected = paymentName === 'payWithPaze';

        const paymentLogos = (
            <Box
                marginLeft={!isMobile ? 4 : null}
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
                                    <Divider marginY={!isMobile ? 3 : null} />
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
                                        <b data-at={Sephora.debug.dataAt('pay_with_credit_or_debit_label')}>{getText('payWithCreditOrDebitCard')}</b>
                                        {localeUtils.isCanada() && (
                                            <Box
                                                color='gray'
                                                fontSize='sm'
                                                data-at={Sephora.debug.dataAt('visa_and_mastercard_only_label')}
                                            >
                                                {getText('visaOrMastercard')}
                                            </Box>
                                        )}
                                    </div>

                                    {isMobile || paymentLogos}
                                </Flex>
                            </Radio>
                            {isMobile && paymentLogos}

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
                                        ref={'creditCardsList'}
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
                                    />
                                    <PaymentSectionFooter
                                        creditCardOptions={creditCardOptions}
                                        isBopis={isBopis}
                                        isSddOrder={isSddOrder}
                                        isApplePayFlow={isApplePayFlow}
                                        isKlarnaFlow={isKlarnaSelected}
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

                    {displayedCreditCards.length === 0 && (isPayWithPayPal || isPayWithApplePay) && (
                        <PaymentSectionFooter
                            creditCardOptions={creditCardOptions}
                            isBopis={isBopis}
                            isSddOrder={isSddOrder}
                            isApplePayFlow={isApplePayFlow}
                            isKlarnaFlow={isKlarnaSelected}
                            isAfterpayFlow={isAfterpaySelected}
                            isPazeFlow={isPazeSelected}
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
