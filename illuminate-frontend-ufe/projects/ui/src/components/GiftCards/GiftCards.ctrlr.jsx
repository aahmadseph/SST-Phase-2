/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { space } from 'style/config';

import { Box, Text, Button } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorMsg from 'components/ErrorMsg';
import ReCaptchaText from 'components/ReCaptchaText/ReCaptchaText';
import ReCaptcha from 'components/ReCaptcha/ReCaptcha';
import ErrorConstants from 'utils/ErrorConstants';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import formatGiftCardNumber from 'utils/formatGiftCardNumber';
import removeSpaces from 'utils/removeSpaces';
import withSuspenseLoadHoc from 'utils/framework/hocs/withSuspenseLoadHoc';
import GiftCardsBindings from 'analytics/bindingMethods/components/giftCards/giftCardsBindings';
import anaConsts from 'analytics/constants';
const { MY_ACCOUNT } = anaConsts.PAGE_NAMES;
const { USER_PROFILE } = anaConsts.PAGE_TYPES;
const { GIFT_CARD } = anaConsts.EVENT_NAMES;
const { NOT_AVAILABLE } = anaConsts;
import { handleGiftCardNumberKeyDown, validateGiftCard, validateGiftCardPin } from 'utils/validateGiftCardInputs';

const GiftCardBalanceModal = withSuspenseLoadHoc(
    React.lazy(() => import(/* webpackChunkName: "postload" */ 'components/GlobalModals/GiftCardBalanceModal/GiftCardBalanceModal'))
);
import mediaUtils from 'utils/Media';

const { isMobileView } = mediaUtils;

import store from 'store/Store';
import utilityApi from 'services/api/utility';
import ErrorsUtils from 'utils/Errors';
import ErrorsActions from 'actions/ErrorsActions';
import { Flex, Image } from '../ui';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const FIELD_LENGTHS = FormValidator.FIELD_LENGTHS;

class GiftCards extends BaseClass {
    constructor() {
        super();
        this.state = {
            showGiftCardBalanceModal: false,
            balanceDetails: null
        };
        this.reCaptcha = null;
    }

    validateForm = () => {
        ErrorsUtils.clearErrors();
        let firstErrorFocused;

        store.watchAction(ErrorsActions.TYPES.ADD_ERROR, action => {
            if (!firstErrorFocused) {
                firstErrorFocused = true;
                ErrorsUtils.focusError(action.error);
            }
        });

        // Clear errors previous and gift card balance
        this.setState({
            error: null,
            gcBalance: null
        });
        const fieldsForValidation = [this.gcCardNumberInput, this.gcPinNumberInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);
        ErrorsUtils.validate();

        let totalErrors = store.getState().errors;
        totalErrors = Object.assign({}, totalErrors[ErrorConstants.ERROR_LEVEL.FIELD], totalErrors[ErrorConstants.ERROR_LEVEL.FORM]);

        const hasErrors = Object.keys(totalErrors).length;

        return hasErrors;
    };

    checkBalance = token => {
        if (!this.validateForm()) {
            const giftCardInfo = {
                gcNumber: removeSpaces(this.gcCardNumberInput.getValue()),
                gcPin: this.gcPinNumberInput.getValue()
            };

            if (token) {
                giftCardInfo.captchaToken = token;
            }

            utilityApi
                .getGiftCardBalance(giftCardInfo)
                .then(response => {
                    this.setState({ balanceDetails: response, gcBalance: response.giftCardBalance });

                    if (response.giftCardBalance) {
                        this.setState({ showGiftCardBalanceModal: true });
                        const isGiftcardAddToWalletEnabled = this.props.isGiftcardAddToWalletEnabled;

                        if (isGiftcardAddToWalletEnabled) {
                            GiftCardsBindings.triggerAsyncPageLoadAnalytics({
                                pageName: `${USER_PROFILE}:${MY_ACCOUNT}:${NOT_AVAILABLE}:*payments-gift-cards`,
                                linkData: `${GIFT_CARD.CHECK_BALANCE}`
                            });
                        }
                    }
                })
                .catch(reponseError => {
                    this.setState({ error: reponseError.errorMessages[0] });
                    GiftCardsBindings.modalError({ error: reponseError.errorMessages[0] });
                });
        }
    };

    validateCaptchaAndCheckBalance = () => {
        if (this.reCaptcha && !this.validateForm()) {
            this.reCaptcha.execute();
        } else {
            this.checkBalance();
        }
    };

    onCaptchaTokenReady = token => {
        if (token) {
            this.checkBalance(token);
        }

        this.reCaptcha.reset();
    };

    onChallengerShow = () => {
        return null;
    };

    onChallengerDismiss = () => {
        return null;
    };

    handleGiftCardNumberChange = e => {
        const formattedValue = formatGiftCardNumber(e.target.value);
        this.gcCardNumberInput.setValue(formattedValue);
    };

    handleGiftCardNumberPaste = e => {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');

        // Remove all non-numeric characters and format
        const numericOnly = pastedText.replace(/\D/g, '');

        // Limit to 16 digits
        const limitedDigits = numericOnly.substring(0, 16);

        // Format and update state
        const formattedValue = formatGiftCardNumber(limitedDigits);

        this.gcCardNumberInput.setValue(formattedValue);
    };

    showGiftCardBalanceModal = () => {
        this.setState({ showGiftCardBalanceModal: true });
    };

    renderBalanceModal = () => {
        const { showGiftCardBalanceModal, balanceDetails } = this.state;
        const getText = getLocaleResourceFile('components/GiftCards/locales', 'GiftCards');
        const localization = {
            checkYourBalance: getText('checkYourBalance'),
            and: getText('and'),
            addToWallet: getText('addToWallet'),
            appleWalletDisclaimer: getText('appleWalletDisclaimer'),
            googleWalletDisclaimer: getText('googleWalletDisclaimer'),
            addTo: getText('addTo'),
            appleWallet: getText('appleWallet'),
            googleWallet: getText('googleWallet'),
            done: getText('done'),
            giftCardBalanceModalTitle: getText('giftCardBalanceModalTitle'),
            cardNumber: getText('cardNumber'),
            pin: getText('pin'),
            balance: getText('balance')
        };

        return (
            <GiftCardBalanceModal
                isOpen={showGiftCardBalanceModal}
                onClose={() => {
                    this.setState({ showGiftCardBalanceModal: false, balanceDetails: null, gcBalance: null });
                    this.gcCardNumberInput.setValue('');
                    this.gcPinNumberInput.setValue('');
                }}
                cardNumberInput={this.gcCardNumberInput && this.gcCardNumberInput.getValue()}
                pinInput={this.gcPinNumberInput && this.gcPinNumberInput.getValue()}
                localization={localization}
                giftCardBalance={balanceDetails ? balanceDetails.giftCardBalance : '$0.00'}
                encryptedGiftCard={balanceDetails ? balanceDetails.encryptedGiftCard : ''}
            />
        );
    };

    render() {
        const getText = getLocaleResourceFile('components/GiftCards/locales', 'GiftCards');

        const { hasTitle = true } = this.props;
        const isCaptchaEnabled = Sephora.configurationSettings.captchaGiftCardBalanceEnabled;
        const isGiftcardAddToWalletEnabled = this.props.isGiftcardAddToWalletEnabled;

        return (
            <React.Fragment>
                <Flex
                    flexDirection='row'
                    justifyContent='space-between'
                    gap={4}
                    marginBottom={4}
                    styles={styles.container}
                >
                    <div>
                        {hasTitle && (
                            <Text
                                is='h2'
                                fontSize='base'
                                fontWeight='bold'
                                children={
                                    isMobileView && isGiftcardAddToWalletEnabled
                                        ? `${getText('checkYourBalance')} ${getText('and')} ${getText('addToWallet')}`
                                        : `${getText('checkYourBalance')}`
                                }
                                lineHeight='tight'
                                marginBottom={2}
                            />
                        )}
                        <Text
                            is='p'
                            fontSize='sm'
                            fontWeight='normal'
                            lineHeight='tight'
                            children={getText('toCheckCurrentBalance')}
                        />
                    </div>

                    <Image
                        src='/img/ufe/gift-card-with-hand.svg'
                        width={75}
                        height={44}
                        style={styles.image}
                    />
                </Flex>

                {!isGiftcardAddToWalletEnabled && this.state.gcBalance && (
                    <Text
                        is='p'
                        fontWeight='bold'
                        marginBottom={4}
                        role='alert'
                        data-at={Sephora.debug.dataAt('balance_msg')}
                    >
                        {getText('balance')} = {this.state.gcBalance}
                    </Text>
                )}

                {isGiftcardAddToWalletEnabled && this.state.showGiftCardBalanceModal && this.renderBalanceModal()}

                {this.state.error && (
                    <ErrorMsg
                        marginBottom={4}
                        children={this.state.error}
                    />
                )}
                <Box
                    is='form'
                    noValidate
                    autoComplete='off'
                    onSubmit={e => {
                        e.preventDefault();
                        this.validateCaptchaAndCheckBalance();
                    }}
                    maxWidth={Sephora.isDesktop() && 343}
                >
                    <TextInput
                        name='gcCardNumber'
                        label={getText('cardNumber')}
                        autoOff={true}
                        required={true}
                        type='tel'
                        maxLength={FIELD_LENGTHS.giftCardNumber}
                        value={(this.gcCardNumberInput && formatGiftCardNumber(this.gcCardNumberInput.getValue())) || ''}
                        onChange={this.handleGiftCardNumberChange}
                        ref={comp => (this.gcCardNumberInput = comp)}
                        onKeyDown={handleGiftCardNumberKeyDown}
                        onPaste={this.handleGiftCardNumberPaste}
                        validateError={giftCardNumber => validateGiftCard(giftCardNumber, true)}
                    />
                    <TextInput
                        name='gcPinNumber'
                        label={getText('pin')}
                        autoOff={true}
                        required={true}
                        type='tel'
                        maxLength={FIELD_LENGTHS.giftCardPin}
                        value={(this.gcPinNumberInput && this.gcPinNumberInput.getValue()) || ''}
                        ref={comp => (this.gcPinNumberInput = comp)}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        validateError={giftCardPin => validateGiftCardPin(giftCardPin, true)}
                    />
                    <Button
                        data-at={Sephora.debug.dataAt('check_gc')}
                        variant='secondary'
                        children={getText('checkBalance')}
                        type='submit'
                    />
                    {isCaptchaEnabled && (
                        <ReCaptcha
                            ref={c => {
                                if (c !== null) {
                                    this.reCaptcha = c;
                                }
                            }}
                            onChange={this.onCaptchaTokenReady}
                            onChallengerShow={this.onChallengerShow}
                            onChallengerDismiss={this.onChallengerDismiss}
                        />
                    )}
                    {isCaptchaEnabled && <ReCaptchaText marginTop={6} />}
                </Box>
            </React.Fragment>
        );
    }
}

const styles = {
    container: {
        paddingTop: space[4],
        paddingBottom: space[4]
    },
    image: {
        flexShrink: 0
    }
};

export default wrapComponent(GiftCards, 'GiftCards');
