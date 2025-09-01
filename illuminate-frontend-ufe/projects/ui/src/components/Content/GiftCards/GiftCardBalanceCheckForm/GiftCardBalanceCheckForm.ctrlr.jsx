/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Button, Text } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import ErrorMsg from 'components/ErrorMsg';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import { mediaQueries } from 'style/config';
import FormValidator from 'utils/FormValidator';
import { handleGiftCardNumberKeyDown, validateGiftCard, validateGiftCardPin } from 'utils/validateGiftCardInputs';
import utilityApi from 'services/api/utility';
import ErrorsUtils from 'utils/Errors';
import formatGiftCardNumber from 'utils/formatGiftCardNumber';
import removeSpaces from 'utils/removeSpaces';
import withSuspenseLoadHoc from 'utils/framework/hocs/withSuspenseLoadHoc';
import GiftCardsBindings from 'analytics/bindingMethods/components/giftCards/giftCardsBindings';
import anaConsts from 'analytics/constants';
const { BUYING_GUIDES } = anaConsts.CONTEXT;
const { CONTENT_STORE } = anaConsts.PAGE_TYPES;
const { GIFT_CARD } = anaConsts.EVENT_NAMES;

const GiftCardBalanceModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GiftCardBalanceModal/GiftCardBalanceModal'))
);

const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;

class GiftCardBalanceCheckForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            giftCardNumber: '',
            pin: '',
            giftCardBalance: null,
            error: null,
            showGiftCardBalanceModal: false,
            balanceDetails: null
        };
    }

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [this.giftCardNumberInput, this.giftCardPinInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);

        return !ErrorsUtils.validate(fieldsForValidation);
    };

    onCaptchaTokenReady = token => {
        if (token) {
            this.checkBalance(token);
        }

        this.reCaptcha.reset();
    };

    handleChange = event => {
        const { name, value } = event.target;

        // Format gift card number for display, keep other fields as-is
        const formattedValue = name === 'giftCardNumber' ? formatGiftCardNumber(value) : value;

        this.setState({
            [name]: formattedValue
        });
    };

    handleGiftCardNumberPaste = e => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');

        // Remove all non-numeric characters
        const numericOnly = pastedText.replace(/\D/g, '');

        // Limit to 16 digits
        const limitedDigits = numericOnly.substring(0, 16);

        // Format and update state
        const formattedValue = formatGiftCardNumber(limitedDigits);

        this.setState({
            giftCardNumber: formattedValue
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        if (this.reCaptcha) {
            this.reCaptcha.execute();
        } else {
            this.checkBalance();
        }
    };

    showGiftCardBalanceModal = () => {
        this.setState({ showGiftCardBalanceModal: true });
    };

    renderBalanceModal = () => {
        const { showGiftCardBalanceModal, giftCardNumber, pin } = this.state;

        return (
            <GiftCardBalanceModal
                isOpen={showGiftCardBalanceModal}
                onClose={() =>
                    this.setState({
                        showGiftCardBalanceModal: false,
                        giftCardNumber: '',
                        pin: '',
                        balanceDetails: null,
                        giftCardBalance: null
                    })
                }
                cardNumberInput={giftCardNumber}
                pinInput={pin}
                localization={this.props.localization}
                giftCardBalance={this.state.balanceDetails?.giftCardBalance || '$0.00'}
                encryptedGiftCard={this.state.balanceDetails?.encryptedGiftCard || ''}
            />
        );
    };

    checkBalance = token => {
        if (!this.validateForm()) {
            this.setState({
                giftCardBalance: null,
                error: null
            });

            return;
        }

        const giftCardInfo = {
            gcNumber: removeSpaces(this.state.giftCardNumber),
            gcPin: this.state.pin
        };

        if (token) {
            giftCardInfo.captchaToken = token;
        }

        utilityApi
            .getGiftCardBalance(giftCardInfo)
            .then(data => {
                this.setState({
                    error: null,
                    balanceDetails: data,
                    giftCardBalance: data.giftCardBalance
                });

                if (data.giftCardBalance) {
                    this.setState({ showGiftCardBalanceModal: true });
                    // analytics
                    const isGiftcardAddToWalletEnabled = this.props.isGiftcardAddToWalletEnabled;

                    if (isGiftcardAddToWalletEnabled) {
                        GiftCardsBindings.triggerAsyncPageLoadAnalytics({
                            pageName: `${CONTENT_STORE}:${BUYING_GUIDES}:shopping made easy-gift cards:*`,
                            linkData: `${GIFT_CARD.LANDING_CHECK_BALANCE}`
                        });
                    }
                }
            })
            .catch(error => {
                this.setState({
                    error: error.errorMessages[0],
                    giftCardBalance: null
                });
                // analytics
                GiftCardsBindings.modalError({ error: error.errorMessages[0] });
            });
    };

    render() {
        const isCaptchaEnabled = Sephora.configurationSettings.captchaGiftCardBalanceEnabled;
        const {
            localization: { currentBalance, cardNumber, pin, checkBalance },
            isGiftcardAddToWalletEnabled
        } = this.props;

        return (
            <>
                {!isGiftcardAddToWalletEnabled && this.state.giftCardBalance && (
                    <Text
                        is='p'
                        fontWeight='bold'
                        marginBottom={4}
                        paddingX={[4, 5]}
                        role='alert'
                        data-at={Sephora.debug.dataAt('balance_msg')}
                    >
                        {`${currentBalance} = ${this.state.giftCardBalance}`}
                    </Text>
                )}
                {this.state.error && (
                    <ErrorMsg
                        marginBottom={4}
                        paddingX={[4, 5]}
                        children={this.state.error}
                    />
                )}
                <Box
                    is='form'
                    lineHeight='tight'
                    noValidate={true}
                    paddingX={[4, 5]}
                    onSubmit={this.handleSubmit}
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between'
                    }}
                >
                    <TextInput
                        marginBottom={4}
                        autoOff={true}
                        name='giftCardNumber'
                        label={cardNumber}
                        required={true}
                        type='tel'
                        value={this.state.giftCardNumber}
                        onChange={this.handleChange}
                        maxLength={FIELD_LENGTHS.giftCardNumber}
                        ref={comp => (this.giftCardNumberInput = comp)}
                        onKeyDown={handleGiftCardNumberKeyDown}
                        onPaste={this.handleGiftCardNumberPaste}
                        validateError={giftCardNumber => validateGiftCard(giftCardNumber, true)}
                        data-at={Sephora.debug.dataAt('gc_card_input')}
                        customStyle={styles}
                    />
                    <TextInput
                        marginBottom={4}
                        autoOff={true}
                        name='pin'
                        label={pin}
                        required={true}
                        type='tel'
                        value={this.state.pin}
                        onChange={this.handleChange}
                        maxLength={FIELD_LENGTHS.giftCardPin}
                        ref={comp => (this.giftCardPinInput = comp)}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        validateError={pinNumber => validateGiftCardPin(pinNumber, true)}
                        data-at={Sephora.debug.dataAt('pin_input')}
                        customStyle={styles}
                    />
                    <Button
                        variant='primary'
                        block={true}
                        type='submit'
                        width={['100%', '274px']}
                        children={checkBalance}
                    />
                    {isGiftcardAddToWalletEnabled && this.state.showGiftCardBalanceModal && this.renderBalanceModal()}
                </Box>
                {isCaptchaEnabled && (
                    <ReCaptcha
                        ref={c => {
                            if (c !== null) {
                                this.reCaptcha = c;
                            }
                        }}
                        onChange={this.onCaptchaTokenReady}
                    />
                )}
            </>
        );
    }
}

const styles = {
    root: {
        width: '100%',
        [mediaQueries.sm]: {
            width: '274px'
        }
    }
};

export default wrapComponent(GiftCardBalanceCheckForm, 'GiftCardBalanceCheckForm');
