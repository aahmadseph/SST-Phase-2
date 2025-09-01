/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms } from 'style/config';
import {
    Box, Divider, Flex, Link, Text, Grid, Button
} from 'components/ui';
import OrderUtils from 'utils/Order';
import ErrorConstants from 'utils/ErrorConstants';
import FormValidator from 'utils/FormValidator';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Radio from 'components/Inputs/Radio/Radio';
import PaymentDisplay from 'components/Checkout/Sections/Payment/Display/PaymentDisplay';
import ErrorMsg from 'components/ErrorMsg';
import creditCardUtils from 'utils/CreditCard';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import store from 'store/Store';
import Actions from 'Actions';
import OrderActions from 'actions/OrderActions';
import Debounce from 'utils/Debounce';
import CheckoutUtils from 'utils/Checkout';
import userUtils from 'utils/User';
import profileApi from 'services/api/profile';
import checkoutApi from 'services/api/checkout';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import UtilActions from 'utils/redux/Actions';
import { TOGGLE_CVC_INFO_MODAL } from 'constants/actionTypes/order';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const getSecurityCodeLength = creditCard => {
    const isAMEXCard = creditCard.cardType === OrderUtils.CREDIT_CARD_TYPES.AMERICAN_EXPRESS.displayName;

    return isAMEXCard ? FormValidator.FIELD_LENGTHS.securityCodeAmex : FormValidator.FIELD_LENGTHS.securityCode;
};

class CreditCardsList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            cvvValidated: false
        };
    }

    componentDidMount() {
        const { cards, setNewCreditCard, selectedCreditCardId } = this.props;

        if (!selectedCreditCardId && !CheckoutUtils.isPaymentInOrderComplete()) {
            const selectedCard = cards.filter(creditCard => !!creditCard.isCardInOrder)[0] || cards.filter(creditCard => !!creditCard.isDefault)[0];

            if (selectedCard && creditCardUtils.tokenMigrationDisabledOrSucceed(selectedCard)) {
                setNewCreditCard(selectedCard);
            }
        }

        store.watchAction(TOGGLE_CVC_INFO_MODAL, data => {
            const actionInfoButton = this.refs.securityCodeInput?.getInfoActionButtonRef();

            if (actionInfoButton && data.isOpen === false) {
                actionInfoButton.focus();
            }
        });

        if (Sephora.isAgent) {
            //If it is Sephora Mirror, agent should see place order button disabled. However, certain roles should see enabled button only for card
            const disablePlaceOrderButton = cards?.length ? !Sephora.isAgentAuthorizedRole?.(['3']) : true;
            store.dispatch(OrderActions.togglePlaceOrderDisabled(disablePlaceOrderButton));
        }
    }

    componentDidUpdate() {
        if (!this.state.cvvValidated && this.refs && this.refs.securityCodeInput) {
            ErrorsUtils.collectClientFieldErrors([this.refs.securityCodeInput]);
            ErrorsUtils.validate();
            this.setState({ cvvValidated: true });
        }
    }

    showCVCInput = (creditCard, selectedCreditCardId) => {
        const { orderDetails } = store.getState().order;

        if (creditCard.creditCardId !== selectedCreditCardId) {
            return false;
        }

        if (creditCardUtils.tokenMigrationFailed(creditCard)) {
            return false;
        }

        //Isolating all agent aware logic here
        if (Sephora.isAgent) {
            //For sephora mirror CVV will be forced based on below conditions:
            // Tier 1 and 2 Agents Required to enter CVV on ALL Paid transactions
            // Tier 1 and 2 Agents NOT Required to enter CVV on all Zero Dollar Transactions
            // Tier 3 Agents Never required to enter CVV on any Paid or Zero Dollar Orders
            const forceCVC = !OrderUtils.isZeroCheckout() && !Sephora.isAgentAuthorizedRole?.(['3']);

            if (forceCVC) {
                Storage.session.setItem(LOCAL_STORAGE.EDIT_SEPHORA_CARD, false);
            }

            return forceCVC;
        }

        const ccComplete = creditCard.isCardInOrder && CheckoutUtils.isPaymentInOrderComplete() && OrderUtils.getCreditCardPaymentGroup(orderDetails);
        const isEfulfilledRewardWithCVVValidation = !OrderUtils.isShippableOrder(orderDetails) && OrderUtils.isZeroDollarOrderWithCVVValidation();
        const showCVCInput =
            !ccComplete && (!creditCard.isPreApproved || isEfulfilledRewardWithCVVValidation) && !OrderUtils.isSephoraTempCardType(creditCard);

        return showCVCInput;
    };

    deleteCreditCard = creditCard => {
        const { creditCardOptions = [] } = this.props;
        const orderId = OrderUtils.getOrderId();
        const nextDefaultCard = creditCardOptions.find(x => !creditCardUtils.tokenMigrationFailed(x) && x.creditCardId !== creditCard.creditCardId);
        const removeCallback = creditCard.isCardInOrder ? this.removeOrderPayment : this.removeCreditCard;

        if (creditCard.isDefault && nextDefaultCard) {
            profileApi.setDefaultCreditCardOnProfile(nextDefaultCard.creditCardId).then(() => {
                removeCallback(creditCard.creditCardId, orderId);
            });
        } else {
            removeCallback(creditCard.creditCardId, orderId);
        }
    };

    handleDeleteCreditCard = creditCard => () => {
        this.deleteCreditCard(creditCard);
    };

    showRemoveCreditCardModal = (creditCard, e) => {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');

        e.preventDefault();

        //variable declaration here for clarity
        const title = getText('removeCreditCard');
        const message = getText('areYouSureMessage');
        const confirmButtonText = getText('remove');
        const hasCancelButton = true;
        const hasCloseButton = true;
        const cancelButtonText = getText('cancel');
        const callback = () => this.deleteCreditCard(creditCard);

        const showInfoModalAction = Actions.showInfoModal({
            isOpen: true,
            title: title,
            message: message,
            buttonText: confirmButtonText,
            callback: callback,
            showCancelButton: hasCancelButton,
            cancelText: cancelButtonText,
            showCloseButton: hasCloseButton,
            dataAtTitle: 'remove_credit_card_title',
            dataAtButton: 'remove_credit_card_btn',
            dataAtCancelButton: 'remove_credit_card_cancel_btn'
        });
        store.dispatch(showInfoModalAction);
    };

    showRemoveCreditCardModalDebounce = Debounce.preventDoubleClick(this.showRemoveCreditCardModal);

    handleRemoveCreditCard = creditCard => e => {
        this.showRemoveCreditCardModalDebounce(creditCard, e);
    };

    removeOrderPayment = (creditCardId, orderId) => {
        //need to check that credit card being removed is a card in profile
        //if it isn't then we need to set creditCardId to null and just remove
        //the card from the order and not from the users profile
        if (!creditCardUtils.isSavedToProfile(creditCardId)) {
            // eslint-disable-next-line no-param-reassign
            creditCardId = null;
        }

        //if user removes credit card in order but creditCardPaymentGroup.paymentGroupId
        //isn't available, default the creditCardGroupId to 0...
        //this occurs if a user has a selected credit card in order, adds a gift card that
        //covers the entire order, and then removes the credit card that is still in the order
        //but not available in the api response (in order but not selected for order)
        const creditCardGroupId = this.props.creditCardPaymentGroup.paymentGroupId || 0;
        const shipCountry = userUtils.getShippingCountry().countryCode;

        decorators
            .withInterstice(checkoutApi.removeOrderPayment, INTERSTICE_DELAY_MS)(orderId, creditCardGroupId, creditCardId)
            .then(() => {
                //update order details since we removed current paymentGroup
                decorators
                    .withInterstice(
                        checkoutApi.getOrderDetails,
                        INTERSTICE_DELAY_MS
                    )(orderId)
                    .then(newOrderDetails => {
                        store.dispatch(OrderActions.updateOrder(newOrderDetails));
                    });

                //update users available credit cards
                decorators
                    .withInterstice(checkoutApi.getCreditCards, INTERSTICE_DELAY_MS)(orderId, shipCountry, true)
                    .then(paymentOptions => {
                        store.dispatch(UtilActions.merge('order', 'paymentOptions', paymentOptions));
                    });
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    removeCreditCard = (creditCardId, orderId) => {
        const profileId = userUtils.getProfileId();
        decorators
            .withInterstice(profileApi.removeCreditCardFromProfile, INTERSTICE_DELAY_MS)(profileId, creditCardId)
            .then(() => {
                //update users available credit cards
                decorators
                    .withInterstice(
                        checkoutApi.getCreditCards,
                        INTERSTICE_DELAY_MS
                    )(orderId)
                    .then(paymentOptions => {
                        store.dispatch(UtilActions.merge('order', 'paymentOptions', paymentOptions));
                    });
            })
            .catch(response => ErrorsUtils.collectAndValidateBackEndErrors(response, this));
    };

    showCVCInfoModal = () => {
        store.dispatch(OrderActions.showCVCInfoModal(true));
    };

    handleSetNewCreditCard = creditCard => () => {
        // Clear any global errors that could be in the Redux store after an unsuccessful payment attempt
        // so that we don't show it again when selecting a new credit card
        ErrorsUtils.clearErrors(ErrorConstants.ERROR_LEVEL.GLOBAL);
        const { setNewCreditCard, defaultPayment } = this.props;
        store.dispatch(OrderActions.swapPaypalToCredit());
        setNewCreditCard(creditCard, defaultPayment);
        this.setState({
            cvvValidated: false
        });
    };

    handleShowEditCreditCardForm = creditCard => () => {
        const { showEditCreditCardForm } = this.props;
        showEditCreditCardForm(creditCard);
    };

    handleValidateError = creditCard => code => {
        const { isZeroCheckout } = this.props;

        if (FormValidator.isEmpty(code)) {
            if (isZeroCheckout) {
                return ErrorConstants.ERROR_CODES.CREDIT_CARD_CVV_VALIDATION;
            }

            return ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE;
        } else if (code.length < getSecurityCodeLength(creditCard)) {
            return ErrorConstants.ERROR_CODES.CREDIT_CARD_SECURITY_CODE_LENGTH;
        }

        return null;
    };

    handleUpdateSecurityCode = e => {
        const { updateSecurityCode } = this.props;
        updateSecurityCode(FormValidator.replaceDotSeparator(e.target.value, this.refs.securityCodeInput));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/Section/locales', 'PaymentSection');
        const {
            cards, defaultPayment, securityCode, securityCodeInvalid, selectedCreditCardId, shouldDisplayAddOrDeleteCreditCardButton
        } =
            this.props;

        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();
        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';

        return (
            <div>
                {cards.map((creditCard, index) => (
                    <Box
                        data-at={Sephora.debug.dataAt('credit_card_item')}
                        key={creditCard.creditCardId}
                        ref={`creditCard${index}`}
                    >
                        {creditCardUtils.showExpiredMessage(creditCard) && (
                            <ErrorMsg
                                lineHeight='none'
                                marginBottom={1}
                                paddingTop={isMobile ? 2 : null}
                                children={getText('expiredCreditCardMsg')}
                            />
                        )}
                        <div
                            css={
                                isDesktop && {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }
                            }
                        >
                            <Radio
                                paddingY={3}
                                dotOffset={0}
                                alignItems='center'
                                name='payWithCreditCard'
                                disabled={creditCard.isExpired || creditCardUtils.tokenMigrationFailed(creditCard)}
                                checked={creditCard.creditCardId === selectedCreditCardId}
                                onClick={this.handleSetNewCreditCard(creditCard)}
                            >
                                <PaymentDisplay
                                    creditCard={creditCard}
                                    showDefault={creditCardIsDefaultPayment && creditCard.isDefault}
                                />
                            </Radio>
                            {creditCardUtils.tokenMigrationDisabledOrSucceed(creditCard) && (
                                <Flex
                                    marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN + 'px'}
                                    marginBottom={isMobile ? 3 : null}
                                >
                                    {shouldDisplayAddOrDeleteCreditCardButton && (
                                        <>
                                            <Link
                                                aria-label={getText('remove') + ' ' + creditCard.paymentDisplayInfo}
                                                padding={2}
                                                margin={-2}
                                                color='blue'
                                                data-at={Sephora.debug.dataAt('remove_button')}
                                                onClick={this.handleRemoveCreditCard(creditCard)}
                                            >
                                                {getText('remove')}
                                            </Link>
                                            <Box
                                                borderLeft={1}
                                                marginX={3}
                                                borderColor='divider'
                                                css={{
                                                    '&:last-child': {
                                                        display: 'none'
                                                    }
                                                }}
                                            />
                                        </>
                                    )}
                                    {!OrderUtils.isSephoraTempCardType(creditCard) && (
                                        <Link
                                            aria-controls='creditcard_form'
                                            aria-label={getText('edit') + ' ' + creditCard.paymentDisplayInfo}
                                            padding={2}
                                            margin={-2}
                                            color='blue'
                                            data-at={Sephora.debug.dataAt('edit_button')}
                                            onClick={this.handleShowEditCreditCardForm(creditCard)}
                                        >
                                            {getText('edit')}
                                        </Link>
                                    )}
                                </Flex>
                            )}
                        </div>
                        {creditCardUtils.tokenMigrationFailed(creditCard) && (
                            <Grid
                                columns='1fr auto'
                                fontSize='sm'
                                lineHeight='tight'
                                backgroundColor='nearWhite'
                                alignItems='center'
                                padding={3}
                                borderRadius={2}
                                marginTop={10}
                            >
                                <Text>{creditCard.message}</Text>
                                <Button
                                    variant='secondary'
                                    size='xs'
                                    children={getText('gotIt')}
                                    onClick={this.handleDeleteCreditCard(creditCard)}
                                />
                            </Grid>
                        )}
                        {this.showCVCInput(creditCard, selectedCreditCardId) && (
                            <div
                                css={{
                                    width: '12.5em',
                                    marginLeft: forms.RADIO_SIZE + forms.RADIO_MARGIN
                                }}
                            >
                                <TextInput
                                    label={getText('cvc')}
                                    autoComplete='cc-csc'
                                    autoCorrect='off'
                                    infoAction={this.showCVCInfoModal}
                                    infoLabel={getText('moreInfoCvc')}
                                    name='securityCode'
                                    required={true}
                                    inputMode='numeric'
                                    pattern='\d*'
                                    onKeyDown={isDesktop && FormValidator.inputAcceptOnlyNumbers}
                                    onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                    onChange={this.handleUpdateSecurityCode}
                                    maxLength={getSecurityCodeLength(creditCard)}
                                    value={securityCode}
                                    invalid={securityCodeInvalid}
                                    ref='securityCodeInput'
                                    data-at={Sephora.debug.dataAt('cvv_input')}
                                    dataAtError={Sephora.debug.dataAt('enter_security_code_error')}
                                    validateError={this.handleValidateError(creditCard)}
                                />
                            </div>
                        )}
                        <Divider my={!isMobile ? 3 : null} />
                    </Box>
                ))}
            </div>
        );
    }
}

export default wrapComponent(CreditCardsList, 'CreditCardsList');
