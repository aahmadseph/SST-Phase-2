/* eslint-disable complexity */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Link, Text, Divider, Icon
} from 'components/ui';
import { forms } from 'style/config';
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
import basketUtils from 'utils/Basket';
import agentAwareUtils from 'utils/AgentAware';
import IconCross from 'components/LegacyIcon/IconCross';
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
import VenmoRadio from 'components/Checkout/Sections/Payment/Section/VenmoRadio';
import VenmoPaymentMethod from 'components/Venmo/VenmoPaymentMethod';
import store from 'store/Store';
import ApplePay from 'services/ApplePay';
import utilityApi from 'services/api/utility';
import EditDataActions from 'actions/EditDataActions';
import PayPal from 'utils/PayPal';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import orderUtils from 'utils/Order';
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
import VenmoActions from 'actions/VenmoActions';
import Location from 'utils/Location';
import Actions from 'actions/Actions';
import checkoutBindings from 'analytics/bindings/pages/checkout/checkoutBindings';
import deepExtend from 'utils/deepExtend';
import pazeUtils from 'utils/Paze';
import deepEqual from 'deep-equal';

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

const maxCreditCards = Sephora.configurationSettings.maxCreditCards;

class PaymentSectionExistingUser extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            creditCardsToDisplay: 3,
            openCVCModal: false,
            isPayWithPayPal: this.props.isPayPalSelected,
            shouldShowPaze: false,
            openCreditCardForm: false
        };
    }

    componentDidMount() {
        const { isBopis } = this.props;

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
                PayPal.preparePaypalCheckout(isBopis);
            });
        }

        store.setAndWatch('order.orderDetails', this, order => {
            ApplePay.getApplePaymentType(order.orderDetails).then(applePayType => {
                this.setState({ isApplePayEnabled: applePayType !== ApplePay.TYPES.HIDDEN });
            });
        });

        store.setAndWatch('order.isApplePayFlow', this, null, true);

        store.setAndWatch('klarna.error', this, data => {
            data.error && data.error.errorMessage && this.setState({ isPayWithPayPal: this.props.isPayPalSelected });
        });

        const isSephoraCardEdit = Storage.session.getItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD);

        if (isSephoraCardEdit) {
            const { creditCardOptions = [] } = this.props;
            const sephoraCreditCard = creditCardOptions.find(payment => orderUtils.isSephoraCardType(payment));

            if (sephoraCreditCard) {
                this.setNewCreditCard(sephoraCreditCard);
                Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, false);
            }
        }

        this.setPazeVisible();
    }

    componentWillReceiveProps(updatedProps) {
        const creditCardPaymentGroup = updatedProps.creditCardPaymentGroup;

        if ((!creditCardPaymentGroup && this.state.selectedCreditCardId) || updatedProps.paymentName) {
            //needed for if a user adds a giftCard that covers entire order.
            //this way there is no selected credit card if no credit card is needed
            this.newCreditCard = {};
            this.setState({
                selectedCreditCardId: null,
                securityCode: ''
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

            if (this.state.openCreditCardForm && !deepEqual(this.props, updatedProps)) {
                this.closeCreditCardForm();
            }
        }
    }

    handleShowMoreOnClick = Debounce.preventDoubleClick(() => {
        let newDisplayNum = this.state.creditCardsToDisplay + 3;

        if (newDisplayNum > this.props.creditCardOptions.length) {
            newDisplayNum = this.props.creditCardOptions.length;
        }

        this.setState({ creditCardsToDisplay: newDisplayNum }, () => {
            const refObj = this.refs.creditCardsList ? this.refs.creditCardsList.refs : {};
            const refKeys = Object.keys(refObj);
            const element = ReactDOM.findDOMNode(refObj[refKeys[refKeys.length - 1]]);
            element &&
                element.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                });
        });
    });

    handleShowLessOnClick = Debounce.preventDoubleClick(() => {
        //after user clicks show less link,
        //return user to display of paypal, apple pay(if avail) and 3 CC
        this.setState({ creditCardsToDisplay: 3 }, () => {
            const refObj = this.refs.creditCardsList ? this.refs.creditCardsList.refs : {};
            const refKeys = Object.keys(refObj);
            const element = ReactDOM.findDOMNode(this.refs.paypal || refObj[refKeys[0]]);
            element &&
                element.scrollIntoView({
                    block: 'start',
                    behavior: 'smooth'
                });
        });
    });

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
        store.dispatch(OrderActions.swapPaypalToCredit());

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
        store.dispatch(UtilActions.merge('order', 'isApplePayFlow', selectedPayment === PAYMENT_FLAGS.isPayWithApplePay));
        store.dispatch(KlarnaActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithKlarna));
        store.dispatch(AfterpayActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithAfterpay));
        store.dispatch(PazeActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithPaze));
        store.dispatch(VenmoActions.toggleSelect(selectedPayment === PAYMENT_FLAGS.isPayWithVenmo));
        store.dispatch(AfterpayActions.resetError());
        store.dispatch(PazeActions.resetError());
        store.dispatch(VenmoActions.resetError());
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
        store.dispatch(PazeActions.toggleSelect(false));
        store.dispatch(VenmoActions.toggleSelect(false));
        store.dispatch(AfterpayActions.resetError());

        this.setState({
            selectedCreditCardId: creditCardData.creditCardId,
            isPayWithPayPal: false,
            isPayWithApplePay: false,
            securityCode: ''
        });
    };

    whatShipAddressAsBilling = shippingAddress => {
        // This function is needed for scenarios when user has selected
        // FEDEX shipping address i.e.: addressType === 'HAL'
        // we need to tell the state here to take the credit card form info
        // the user entered.

        return (shippingAddress || false) && shippingAddress?.addressType !== OrderUtils.SHIPPING_METHOD_TYPES.HAL;
    };

    showAddCreditCardForm = e => {
        e.preventDefault();
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');

        if (this.props.creditCardOptions && this.props.creditCardOptions.length === maxCreditCards) {
            //variable declaration here for clarity
            const title = getText('removeAddress');
            const message = getText('maxCreditCardsMessage', [maxCreditCards]);
            const confirmButtonText = getText('continueButton');

            store.dispatch(
                Actions.showInfoModal({
                    isOpen: true,
                    title: title,
                    message: message,
                    confirmButtonText: confirmButtonText
                })
            );
        } else {
            store.dispatch(KlarnaActions.toggleSelect(false));
            store.dispatch(AfterpayActions.toggleSelect(false));
            store.dispatch(AfterpayActions.resetError());
            this.setState(
                {
                    openCreditCardForm: true,
                    isUseShipAddressAsBilling: this.whatShipAddressAsBilling(this.props.shippingAddress)
                },
                () => {
                    //Analytics
                    const pageDetailPrefix = this.props.isPhysicalGiftCardOnly ? 'gift card ' : '';
                    checkoutBindings.processAsyncPageLoad(pageDetailPrefix + 'payment-add credit card');
                }
            );
        }
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

    renderPazePaymentMethod = () => {
        const defaultPayment = this.props.defaultPayment;
        const isPazeEnabledForThisOrder = this.props.isPazeEnabledForThisOrder;

        return (
            <PazeRadio
                defaultPayment={defaultPayment}
                disabled={!isPazeEnabledForThisOrder}
                onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.PAZE)}
            >
                <PazePaymentMethod />
            </PazeRadio>
        );
    };

    renderVenmoPaymentMethod = () => {
        const defaultPayment = this.props.defaultPayment;
        const isVenmoEnabledForThisOrder = this.props.isVenmoEnabledForThisOrder;

        return (
            localeUtils.isUS() && (
                <VenmoRadio
                    defaultPayment={defaultPayment}
                    disabled={!isVenmoEnabledForThisOrder}
                    onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.VENMO)}
                >
                    <VenmoPaymentMethod />
                </VenmoRadio>
            )
        );
    };

    // Set Paze visibility based on configuration flags and user eligibility
    setPazeVisible = async () => {
        const shouldShowPaze = pazeUtils.isPazeVisible();

        // If Paze is set to be dynamic, we only show it to users that are eligible
        if (Sephora.configurationSettings.isPazeDynamic && shouldShowPaze) {
            const canCheckoutPaze = Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);
            this.setState({
                shouldShowPaze: canCheckoutPaze
            });
        } else {
            this.setState({
                shouldShowPaze: shouldShowPaze
            });
        }
    };

    handleShowMoreOrLessOnClick = () => {
        const { creditCardOptions } = this.props;
        const { creditCardsToDisplay } = this.state;
        creditCardsToDisplay < creditCardOptions.length ? this.handleShowMoreOnClick() : this.handleShowLessOnClick();
    };

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
            creditCardPaymentGroup,
            isPayPalEnabled,
            isKlarnaEnabledForThisOrder,
            isAfterpayEnabledForThisOrder,
            isAfterpayEnabledForThisProfile,
            paymentName,
            hasAutoReplenishItemInBasket,
            orderDetails
        } = this.props;

        const {
            selectedCreditCardId,
            creditCardsToDisplay,
            editCreditCard,
            isUseShipAddressAsBilling,
            isPayWithPayPal,
            errorMessage,
            isApplePayFlow,
            isApplePayEnabled,
            isPayWithApplePay,
            openCreditCardForm,
            billingCountries,
            securityCode,
            securityCodeInvalid
        } = this.state;

        const isMobile = Sephora.isMobile();
        const { isKlarnaPaymentEnabled, afterpayEnabled: isAfterpayPaymentEnabled, isVenmoEnabled } = Sephora.configurationSettings;

        const newCreditCard = {
            firstName: userUtils.getProfileFirstName(),
            lastName: userUtils.getProfileLastName(),
            address: {
                country: userUtils.getShippingCountry().countryCode
            }
        };

        const isKlarnaSelected = paymentName === 'payWithKlarna';
        const isAfterpaySelected = paymentName === 'payWithAfterpay';
        const isPazeSelected = paymentName === 'payWithPaze';
        const isVenmoSelected = paymentName === 'payWithVenmo';
        const displayedCreditCards = creditCardOptions.slice(0, creditCardsToDisplay);
        const numberOfSavedCreditCards = creditCardUtils.numberOfSavedCards(creditCardOptions);
        const giftCardIsApplied = !!orderDetails?.priceInfo?.giftCardAmount;
        const giftcardAmount = Number(basketUtils.removeCurrency(orderDetails?.priceInfo?.giftCardAmount));
        const orderTotal = Number(basketUtils.removeCurrency(orderDetails?.priceInfo?.orderTotal));
        const creditCardRequiredMessage =
            orderDetails?.paymentGroups?.paymentMessages?.[0] && orderDetails?.paymentGroups?.paymentMessages?.[0].messages?.[0];
        const hasSDUInBasket = OrderUtils.hasSDUInBasket(orderDetails);
        const shouldDisplayAutoReplenMessage = creditCardRequiredMessage && hasAutoReplenishItemInBasket && !openCreditCardForm;
        const shouldDisplaySDUMessage = creditCardRequiredMessage && hasSDUInBasket && !openCreditCardForm;
        const shouldDisplaySDUMessageRed = shouldDisplaySDUMessage && giftCardIsApplied && giftcardAmount >= orderTotal;
        const shouldDisplayAlternatePaymentMethods = !openCreditCardForm && !isZeroCheckout;
        const shouldDisplayAddOrDeleteCreditCardButton = !isZeroCheckout || hasSDUInBasket || hasAutoReplenishItemInBasket;
        const isPayPalPayLaterEligible = orderDetails?.items?.isPayPalPayLaterEligible;

        return (
            <div>
                <div>
                    {errorMessage && <ErrorMsg children={errorMessage} />}
                    {(shouldDisplaySDUMessage || shouldDisplayAutoReplenMessage) && (
                        <ErrorMsg
                            backgroundColor='nearWhite'
                            color={shouldDisplaySDUMessageRed || shouldDisplayAutoReplenMessage ? 'red' : 'black'}
                            padding={3}
                            borderRadius={2}
                            display='flex'
                        >
                            {(shouldDisplaySDUMessageRed || shouldDisplayAutoReplenMessage) && (
                                <Icon
                                    name='alert'
                                    size='1.25em'
                                    marginRight='.5em'
                                />
                            )}
                            <span>{creditCardRequiredMessage}</span>
                        </ErrorMsg>
                    )}
                    <fieldset>
                        {shouldDisplayAlternatePaymentMethods && (
                            <div>
                                {(isPayPalEnabled || hasAutoReplenishItemInBasket) && (
                                    <PaypalRadio
                                        ref={'paypal'}
                                        isZeroCheckout={isZeroCheckout}
                                        isPayWithPayPal={isPayWithPayPal}
                                        paypalOption={paypalOption}
                                        handlePayWithPayPalOnClick={this.handlePayWithPayPalOnClick}
                                        hasAutoReplenishItemInBasket={hasAutoReplenishItemInBasket}
                                        isPayPalPayLaterEligible={isPayPalPayLaterEligible}
                                        fieldsetName='paymentMethodGroup'
                                    />
                                )}
                                {isVenmoEnabled && this.renderVenmoPaymentMethod()}
                                {isKlarnaPaymentEnabled && (
                                    <KlarnaRadio
                                        defaultPayment={defaultPayment}
                                        disabled={!isKlarnaEnabledForThisOrder}
                                        fieldsetName='paymentMethodGroup'
                                        onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.KLARNA)}
                                    >
                                        <KlarnaPaymentMethod />
                                    </KlarnaRadio>
                                )}
                                {isAfterpayPaymentEnabled && isAfterpayEnabledForThisProfile && (
                                    <AfterpayRadio
                                        defaultPayment={defaultPayment}
                                        disabled={!isAfterpayEnabledForThisOrder}
                                        fieldsetName='paymentMethodGroup'
                                        onClick={this.handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY)}
                                    >
                                        <AfterpayPaymentMethod />
                                    </AfterpayRadio>
                                )}
                                {isApplePayEnabled && (
                                    <div>
                                        <Radio
                                            paddingY={3}
                                            dotOffset={0}
                                            alignItems='center'
                                            name='payWithApplePay'
                                            checked={isPayWithApplePay}
                                            disabled={isMobile && hasAutoReplenishItemInBasket}
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
                                {this.state.shouldShowPaze && this.renderPazePaymentMethod()}
                            </div>
                        )}
                    </fieldset>
                    <div>
                        {openCreditCardForm ? (
                            <Box
                                id='creditcard_form'
                                marginTop={4}
                            >
                                <CheckoutCreditCardForm
                                    editStore={FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.CREDIT_CARD)}
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
                                    creditCardOptions={creditCardOptions}
                                    setNewCreditCard={this.setNewCreditCard}
                                    showEditCreditCardForm={this.showEditCreditCardForm}
                                    updateSecurityCode={this.updateSecurityCode}
                                    isBopis={isBopis}
                                    isZeroCheckout={isZeroCheckout}
                                    shouldDisplayAddOrDeleteCreditCardButton={shouldDisplayAddOrDeleteCreditCardButton}
                                />

                                {shouldDisplayAddOrDeleteCreditCardButton && (
                                    <React.Fragment>
                                        <Link
                                            hoverSelector='strong'
                                            display='flex'
                                            alignItems='center'
                                            aria-controls='creditcard_form'
                                            padding={4}
                                            marginX={-4}
                                            data-at={Sephora.debug.dataAt('add_new_credit_card')}
                                            onClick={this.showAddCreditCardForm}
                                            className={agentAwareUtils.applyHideAgentAwareClassToTiers(['1', '2'])}
                                        >
                                            <IconCross fontSize={forms.RADIO_SIZE} />
                                            <Box
                                                aria-hidden
                                                fontSize={CARD_IMG_SIZE}
                                                marginLeft={forms.RADIO_MARGIN + 'px'}
                                                marginRight={4}
                                            >
                                                <PaymentLogo />
                                            </Box>
                                            <div>
                                                <strong>{getText('addNewCreditCard')}</strong>
                                                {localeUtils.isCanada() && (
                                                    <Text
                                                        display='block'
                                                        fontSize='sm'
                                                        color='gray'
                                                    >
                                                        {getText('debitCardDisclaimer')}
                                                    </Text>
                                                )}
                                            </div>
                                        </Link>
                                    </React.Fragment>
                                )}
                                {creditCardOptions.length > 3 && (
                                    <>
                                        <Divider marginY={4} />
                                        <Link
                                            color='blue'
                                            paddingY={2}
                                            marginY={-2}
                                            data-at={Sephora.debug.dataAt('show_more_cards')}
                                            marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN + 'px'}
                                            onClick={this.handleShowMoreOrLessOnClick}
                                        >
                                            {creditCardsToDisplay < creditCardOptions.length ? getText('showMoreCards') : getText('showLessCards')}
                                        </Link>
                                    </>
                                )}
                                <PaymentSectionFooter
                                    creditCardOptions={creditCardOptions}
                                    isBopis={isBopis}
                                    isSddOrder={isSddOrder}
                                    isApplePayFlow={isApplePayFlow}
                                    isKlarnaFlow={isKlarnaSelected}
                                    isAfterpayFlow={isAfterpaySelected}
                                    isVenmoSelected={isVenmoSelected}
                                    isPazeFlow={isPazeSelected}
                                    isPayWithPayPal={isPayWithPayPal}
                                    selectedCreditCardId={selectedCreditCardId}
                                    securityCode={securityCode}
                                    newCreditCard={this.newCreditCard}
                                    parentToValidate={this}
                                    hasSDUInBasket={hasSDUInBasket}
                                    showEditCreditCardForm={this.showEditCreditCardForm}
                                    {...this.props}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <CVCInfoModal />
            </div>
        );
    }
}

export default wrapComponent(PaymentSectionExistingUser, 'PaymentSectionExistingUser');
