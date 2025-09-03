/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms } from 'style/config';
import {
    Box, Divider, Flex, Link, Text, Grid, Button
} from 'components/ui';
import CreditCard from 'components/FrictionlessCheckout/Payment/CreditCard';
import OrderUtils from 'utils/Order';
import ErrorConstants from 'utils/ErrorConstants';
import FormValidator from 'utils/FormValidator';
import TextInput from 'components/Inputs/TextInput/TextInput';
import Radio from 'components/Inputs/Radio/Radio';
import ErrorMsg from 'components/ErrorMsg';
import creditCardUtils from 'utils/CreditCard';
import Storage from 'utils/localStorage/Storage';
import Debounce from 'utils/Debounce';
import CheckoutUtils from 'utils/Checkout';
import userUtils from 'utils/User';
import ErrorsUtils from 'utils/Errors';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import { breakpoints } from 'style/config';
import { DebouncedResize } from 'constants/events';
import profileApi from 'services/api/profile';
import { mediaQueries } from 'style/config';
import deepEqual from 'deep-equal';
import CVCInfoModal from 'components/FrictionlessCheckout/Payment/CVCInfoModal';

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

    checkIsMobile = () => {
        this.setState({
            isMobile: window.matchMedia(breakpoints.smMax).matches
        });
    };

    componentDidMount() {
        const { cards, setNewCreditCard, selectedCreditCardId } = this.props;

        if (!selectedCreditCardId && !CheckoutUtils.isPaymentInOrderComplete()) {
            const selectedCard = cards.filter(creditCard => !!creditCard.isCardInOrder)[0] || cards.filter(creditCard => !!creditCard.isDefault)[0];

            if (selectedCard && creditCardUtils.tokenMigrationDisabledOrSucceed(selectedCard)) {
                setNewCreditCard(selectedCard);
            }
        }

        this.unsubscribe = this.props.CreditCardListToggleCVC(this);

        if (Sephora.isAgent) {
            //If it is Sephora Mirror, agent should see place order button disabled. However, certain roles should see enabled button only for card
            const disablePlaceOrderButton = cards?.length ? !Sephora.isAgentAuthorizedRole?.(['3']) : true;
            this.props.togglePlaceOrderDisabled(disablePlaceOrderButton);
        }

        this.checkIsMobile();
        this.props.onRef(this);
        window.addEventListener(DebouncedResize, this.checkIsMobile);
    }

    validateCVV = () => {
        ErrorsUtils.collectClientFieldErrors([this.refs.securityCodeInput]);
        ErrorsUtils.validate();
        this.setState({ cvvValidated: true });
    };

    componentDidUpdate(prevProps) {
        if ((!this.state.cvvValidated && this.refs && this.refs.securityCodeInput) || !deepEqual(prevProps.orderDetails, this.props.orderDetails)) {
            this.validateCVV();
        }
    }

    componentWillUnmount() {
        this.unsubscribe();
        window.removeEventListener(DebouncedResize, this.checkIsMobile);
    }

    showCVCInput = (creditCard, selectedCreditCardId) => {
        const { orderDetails } = this.props;

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
        const { removeCreditCard, areYouSureMessage, remove, cancel } = this.props.locales;

        e.preventDefault();

        //variable declaration here for clarity
        const hasCancelButton = true;
        const hasCloseButton = true;
        const callback = () => this.deleteCreditCard(creditCard);

        this.props.showInfoModal({
            isOpen: true,
            title: removeCreditCard,
            message: areYouSureMessage,
            buttonText: remove,
            callback: callback,
            showCancelButton: hasCancelButton,
            cancelText: cancel,
            showCloseButton: hasCloseButton,
            dataAtTitle: 'remove_credit_card_title',
            dataAtButton: 'remove_credit_card_btn',
            dataAtCancelButton: 'remove_credit_card_cancel_btn'
        });
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

        this.props
            .removeOrderPayment(orderId, creditCardGroupId, creditCardId)
            .then(() => {
                //update order details since we removed current paymentGroup
                this.props.getOrderDetails(orderId).then(newOrderDetails => {
                    this.props.updateOrder(newOrderDetails);
                });

                //update users available credit cards
                this.props.getCreditCards(orderId, shipCountry, true).then(paymentOptions => {
                    this.props.merge('order', 'paymentOptions', paymentOptions);
                });
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    removeCreditCard = (creditCardId, orderId) => {
        const profileId = userUtils.getProfileId();
        this.props
            .removeCreditCardFromProfile(profileId, creditCardId)
            .then(() => {
                //update users available credit cards
                this.props.getCreditCards(orderId).then(paymentOptions => {
                    this.props.merge('order', 'paymentOptions', paymentOptions);
                });
            })
            .catch(response => ErrorsUtils.collectAndValidateBackEndErrors(response, this));
    };

    showCVCInfoModal = () => {
        this.props.showCVCInfoModal(true);
    };

    handleSetNewCreditCard = creditCard => () => {
        const { setNewCreditCard, defaultPayment } = this.props;
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

    renderRemoveButton = (creditCard, remove, showEditButtonFirst) => {
        return (
            <>
                <Link
                    aria-label={remove + ' ' + creditCard.paymentDisplayInfo}
                    paddingX={2}
                    paddingY={1}
                    margin={-2}
                    color='blue'
                    data-at={Sephora.debug.dataAt('remove_button')}
                    onClick={this.handleRemoveCreditCard(creditCard)}
                >
                    {remove}
                </Link>
                {!showEditButtonFirst && (
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
                )}
            </>
        );
    };

    renderEditButton = (creditCard, edit, showEditButtonFirst) => {
        if (OrderUtils.isSephoraTempCardType(creditCard)) {
            return null;
        }

        return (
            <>
                <Link
                    aria-controls='creditcard_form'
                    aria-label={edit + ' ' + creditCard.paymentDisplayInfo}
                    paddingX={2}
                    paddingY={1}
                    margin={-2}
                    color='blue'
                    data-at={Sephora.debug.dataAt('edit_button')}
                    onClick={this.handleShowEditCreditCardForm(creditCard)}
                >
                    {edit}
                </Link>
                {showEditButtonFirst && (
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
                )}
            </>
        );
    };

    render() {
        const {
            cards,
            defaultPayment,
            securityCode,
            securityCodeInvalid,
            selectedCreditCardId,
            shouldDisplayAddOrDeleteCreditCardButton,
            locales,
            showEditButtonFirst
        } = this.props;

        const {
            expiredCreditCardMsg, remove, edit, gotIt, cvc, moreInfoCvc
        } = locales;

        const creditCardIsDefaultPayment = !defaultPayment || defaultPayment === 'creditCard';

        let showEditRemoveButtons = true;

        if (Sephora.isAgent) {
            showEditRemoveButtons = Sephora.isAgentAuthorizedRole?.(['3']);
        }

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
                                paddingTop={[2, null]}
                                children={expiredCreditCardMsg}
                            />
                        )}
                        <Box paddingTop={4}>
                            <Radio
                                paddingY={0}
                                dotOffset={0}
                                alignItems='center'
                                name='payWithCreditCard'
                                disabled={creditCard.isExpired || creditCardUtils.tokenMigrationFailed(creditCard)}
                                checked={creditCard.creditCardId === selectedCreditCardId}
                                onClick={this.handleSetNewCreditCard(creditCard)}
                                tabIndex={0}
                                css={styles.radio}
                            >
                                <CreditCard
                                    creditCard={creditCard}
                                    showDefault={creditCardIsDefaultPayment && creditCard.isDefault}
                                    isEditView={true}
                                />
                            </Radio>
                        </Box>
                        {showEditRemoveButtons && creditCardUtils.tokenMigrationDisabledOrSucceed(creditCard) && (
                            <Flex
                                marginLeft={forms.RADIO_SIZE + forms.RADIO_MARGIN + 'px'}
                                marginBottom={[1, null]}
                                marginTop={1}
                                paddingY={3}
                            >
                                {showEditButtonFirst && this.renderEditButton(creditCard, edit, showEditButtonFirst)}
                                {shouldDisplayAddOrDeleteCreditCardButton && this.renderRemoveButton(creditCard, remove, showEditButtonFirst)}
                                {!showEditButtonFirst && this.renderEditButton(creditCard, edit)}
                            </Flex>
                        )}
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
                                {showEditRemoveButtons && (
                                    <Button
                                        variant='secondary'
                                        size='xs'
                                        children={gotIt}
                                        onClick={this.handleDeleteCreditCard(creditCard)}
                                    />
                                )}
                            </Grid>
                        )}
                        {this.showCVCInput(creditCard, selectedCreditCardId) && (
                            <div
                                css={{
                                    width: '12.5em',
                                    marginLeft: forms.RADIO_SIZE + forms.RADIO_MARGIN,
                                    marginTop: !showEditRemoveButtons && '1em'
                                }}
                            >
                                <TextInput
                                    label={cvc}
                                    autoComplete='cc-csc'
                                    autoCorrect='off'
                                    infoAction={this.showCVCInfoModal}
                                    infoLabel={moreInfoCvc}
                                    name='securityCode'
                                    required={true}
                                    inputMode='numeric'
                                    pattern='\d*'
                                    onKeyDown={!this.state.isMobile && FormValidator.inputAcceptOnlyNumbers}
                                    onPaste={FormValidator.pasteAcceptOnlyNumbers}
                                    onChange={this.handleUpdateSecurityCode}
                                    maxLength={getSecurityCodeLength(creditCard)}
                                    value={securityCode}
                                    invalid={securityCodeInvalid}
                                    ref='securityCodeInput'
                                    data-at={Sephora.debug.dataAt('cvv_input')}
                                    dataAtError={Sephora.debug.dataAt('enter_security_code_error')}
                                    validateError={this.handleValidateError(creditCard)}
                                    customStyle={styles}
                                />
                            </div>
                        )}
                        {Sephora.isAgent ? <>{index !== cards.length - 1 && <Divider marginTop={!showEditRemoveButtons && '1em'} />}</> : <Divider />}
                    </Box>
                ))}
                <CVCInfoModal />
            </div>
        );
    }
}

const styles = {
    message: {
        width: '300px',
        [mediaQueries.sm]: {
            width: '100%'
        },
        [mediaQueries.md]: {
            width: '420px'
        }
    },
    radio: {
        '&:focus-visible': {
            outline: '2px solid #0066cc',
            outlineOffset: '2px'
        }
    }
};

export default wrapComponent(CreditCardsList, 'CreditCardsList');
