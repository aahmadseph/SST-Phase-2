/* eslint-disable complexity */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { forms, measure } from 'style/config';
import {
    Box, Text, Divider, Image, Grid, Link
} from 'components/ui';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import ErrorMsg from 'components/ErrorMsg';
import BiBirthdayForm from 'components/BiRegisterForm/BiBirthdayForm/BiBirthdayForm';
import localeUtils from 'utils/LanguageLocale';
import resourceWrapper from 'utils/framework/resourceWrapper';
import * as legalConstants from 'constants/legal';
import ErrorsUtils from 'utils/Errors';
import ErrorConstants from 'utils/ErrorConstants';

class BiRegisterForm extends BaseClass {
    state = {
        isOpen: false,
        isJoinBIChecked:
            this.props.isRegisterModal || this.props.isJoinBIChecked || this.props.isStoreUser || this.props.isOrderConfirmation || false,
        isJoinBIDisabled: this.props.isJoinBIDisabled || false,
        birthdayDisabled: this.props.disabled,
        isCALocale: false
    };

    componentDidMount() {
        this.setState({ isCALocale: localeUtils.isCanada() });
    }

    /* eslint-disable-next-line complexity */
    validateErrorWithCode = () => {
        let isJoinBIChecked =
            this.props.isRegisterModal || (this.props.biFormTestType && this.props.biFormTestType !== 'default') ? true : this.state.isJoinBIChecked;
        const biMonthValue = this.birthdayForm && this.birthdayForm.getMonth();
        const biDayValue = this.birthdayForm && this.birthdayForm.getDay();
        const biYearValue = this.birthdayForm && this.birthdayForm.getYear();
        const biDatePartiallyFilled = biDayValue || biMonthValue || biYearValue;
        const biDateFullyFilled = biDayValue && biMonthValue && biYearValue;

        if (this.props.isBiModal) {
            isJoinBIChecked = this.state.isJoinBIChecked;
        }

        // TODO: Clean this in a story, too many else/ifs.  Not fixing this in
        // UBS-1694 since this should be an improvement
        if (!this.props.isGuestCheckout && biDatePartiallyFilled && !isJoinBIChecked) {
            return ErrorConstants.ERROR_CODES.JOIN_BI;
        } else if (this.props.isBiModal && !isJoinBIChecked) {
            return ErrorConstants.ERROR_CODES.JOIN_BI;
        } else if (this.props.isBiModal && biDatePartiallyFilled && !biDateFullyFilled) {
            return ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY;
        } else if (
            !biDateFullyFilled &&
            isJoinBIChecked &&
            !this.props.isBIAutoEnroll &&
            !this.props.isRegisterModal &&
            this.props.biFormTestType === 'default'
        ) {
            return ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY;
        } else if (this.props.isOrderConfirmation && !isJoinBIChecked) {
            return ErrorConstants.ERROR_CODES.JOIN_BI;
        } else if (this.props.isCreditCardApply && !isJoinBIChecked) {
            return ErrorConstants.ERROR_CODES.JOIN_BI;
        }

        return null;
    };

    showError = (message, value, errorCode) => {
        switch (errorCode) {
            case ErrorConstants.ERROR_CODES.JOIN_BI:
                this.birthdayForm.setErrorState(message, false, true);

                break;
            case ErrorConstants.ERROR_CODES.JOIN_BI_BIRTHDAY: {
                this.birthdayForm.setErrorState(message, true, false);

                break;
            }
            default:
        }
    };

    validateForm = doNotClearErrors => {
        if (this.birthdayForm) {
            this.birthdayForm.resetErrorState();
        }

        if (this.birthdayForm && (this.props.isRegisterModal || this.props.biFormTestType !== 'default')) {
            this.birthdayForm.validateForm(true);
        }

        if (!doNotClearErrors) {
            ErrorsUtils.clearErrors();
        }

        ErrorsUtils.collectClientFieldErrors([this]);

        return ErrorsUtils.validate();
    };

    handleJoinBIClick = e => {
        const isJoinBIChecked = e.target.checked;

        const stateObj = {
            isJoinBIChecked: isJoinBIChecked,
            biFormError: null
        };

        if (this.props.isGuestCheckout) {
            stateObj.birthdayDisabled = !isJoinBIChecked;

            if (!isJoinBIChecked) {
                this.birthdayForm.clearBirthday();
            }
        }

        this.setState(stateObj);

        if (this.props.callback) {
            this.props.callback(isJoinBIChecked);
        }
    };

    getBIFormError = () => {
        return this.birthdayForm.getBIFormError();
    };

    getBIDate = () => {
        if (this.state.isJoinBIChecked || this.props.isRegisterModal || this.props.biFormTestType !== 'default') {
            return this.birthdayForm && this.birthdayForm.getBirthday();
        } else {
            return null;
        }
    };

    setBiDate = date => {
        this.birthdayForm.setBirthday(date);
    };

    /* setErrorState gets called when there is an api birthday error of 'invalid'
     * birthday.
     */
    setErrorState = error => {
        this.birthdayForm.setErrorState(error, false, false);
    };

    render() {
        const getText = resourceWrapper(localeUtils.getLocaleResourceFile('components/BiRegisterForm/locales', 'BiRegisterForm'));
        const getLegalText = resourceWrapper(localeUtils.getLocaleResourceFile('components/ReCaptchaText/locales', 'ReCaptchaText'));

        /*
        Note: Remove biFormTestType when UTS-574 is finished A/B testing in Prod
        */
        const {
            biData,
            isOrderConfirmation,
            signUpPoints,
            isApplePaySignIn,
            isStoreUser,
            showBirthdayForAutoEnrolled,
            isCanadaCheckout,
            subscribeEmail,
            isBIAutoEnroll,
            isGuestCheckout,
            uncheckJoinErrorMsg,
            isCreditCardApply,
            isRegisterModal,
            isBiModal,
            biFormTestType = 'default'
        } = this.props;

        const isCAGuestCheckout = isGuestCheckout && this.state.isCALocale;
        const isCanada = localeUtils.isCanada();
        const hasJoinBICheckbox = !showBirthdayForAutoEnrolled && !(isStoreUser && isGuestCheckout) && !isRegisterModal;

        return (
            <>
                {!(isApplePaySignIn || isGuestCheckout) && (
                    <>
                        {!isRegisterModal && (
                            <Image
                                alt='Beauty Insider'
                                disableLazyLoad={true}
                                display='block'
                                src='/img/ufe/bi/logo-beauty-insider.svg'
                                width={201}
                                height={30}
                                marginBottom={4}
                            />
                        )}
                        {isCreditCardApply && (
                            <Text
                                is='p'
                                lineHeight='tight'
                                marginBottom={4}
                            >
                                {getText('biAccountRequiredText')}
                            </Text>
                        )}
                        {isOrderConfirmation && (
                            <>
                                <Text
                                    is='p'
                                    marginBottom={4}
                                >
                                    {getText(showBirthdayForAutoEnrolled ? 'birthdayForAutoEnrolledMessage' : 'birthdayForNotAutoEnrolledMessage')}
                                </Text>
                                {!showBirthdayForAutoEnrolled && signUpPoints > 0 && (
                                    <>
                                        <Divider marginTop={4} />
                                        <Text
                                            is='p'
                                            paddingY={2}
                                        >
                                            {getText(
                                                'signupAndEarnText',
                                                true,
                                                signUpPoints,
                                                signUpPoints > 1 ? getText('pointsText') : getText('pointText')
                                            )}
                                        </Text>
                                        <Divider marginBottom={4} />
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}

                {this.state.biFormError !== null && isApplePaySignIn && (
                    <ErrorMsg
                        marginTop={2}
                        marginBottom='0'
                        children={this.state.biFormError}
                    />
                )}
                {subscribeEmail && (isCanadaCheckout || isCAGuestCheckout) && subscribeEmail}

                <div
                    css={!isRegisterModal && !isBiModal && { maxWidth: measure[1] }}
                    data-at={Sephora.debug.dataAt('BiRegisterForm')}
                >
                    {hasJoinBICheckbox && biFormTestType === 'default' && (
                        <Checkbox
                            paddingY={null}
                            checked={this.state.isJoinBIChecked}
                            disabled={this.state.isJoinBIDisabled || isStoreUser}
                            onClick={this.handleJoinBIClick}
                            name='join_bi'
                        >
                            {isApplePaySignIn && isBIAutoEnroll ? (
                                <>
                                    {getText('joinAndAgree')}{' '}
                                    <Link
                                        color='blue'
                                        underline={true}
                                        target='_blank'
                                        href={legalConstants.TERMS_OF_USE_LINK}
                                        data-at={Sephora.debug.dataAt('terms_conditions_link')}
                                    >
                                        {getText(isOrderConfirmation ? 'termsAndConditionsLink' : 'biTermsAndConditionsLink')}
                                    </Link>
                                </>
                            ) : (
                                <b data-at={Sephora.debug.dataAt('become_bi_check_box')}>{getText('joinCheckboxLabel')}</b>
                            )}
                        </Checkbox>
                    )}

                    <Box marginLeft={hasJoinBICheckbox && biFormTestType === 'default' && `${forms.RADIO_SIZE + forms.RADIO_MARGIN}px`}>
                        {!this.state.isJoinBIChecked && isGuestCheckout && (
                            <ErrorMsg
                                marginTop={1}
                                marginBottom='0'
                                children={uncheckJoinErrorMsg}
                            />
                        )}

                        {isApplePaySignIn && isBIAutoEnroll ? (
                            <Text
                                is='p'
                                color='gray'
                                fontSize='sm'
                            >
                                {getText('byUncheckingMessage')}
                            </Text>
                        ) : (
                            <>
                                {!isRegisterModal && biFormTestType === 'default' && (
                                    <Text
                                        is='p'
                                        color='gray'
                                        fontSize='sm'
                                        marginTop={1}
                                        lineHeight='tight'
                                        marginBottom={3}
                                    >
                                        {getLegalText('byClicking')}{' '}
                                        <Link
                                            color='blue'
                                            underline={true}
                                            target='_blank'
                                            href={legalConstants.PRIVACY_POLICY_LINK}
                                            data-at={Sephora.debug.dataAt('privacy_policy_link')}
                                            children={getLegalText('privacyPolicy')}
                                        />
                                        {localeUtils.isFrench() ? ' ' : ''}
                                        {getLegalText('and')}
                                        <Link
                                            color='blue'
                                            underline={true}
                                            target='_blank'
                                            href={legalConstants.USNoticeIncentiveLink}
                                            children={getLegalText('noticeFinancialIncentive')}
                                        />
                                        , (2),
                                        {getLegalText('agreeTo')}
                                        <Link
                                            color='blue'
                                            underline={true}
                                            target='_blank'
                                            href={legalConstants.TERMS_OF_USE_LINK}
                                            data-at={Sephora.debug.dataAt('terms_conditions_link')}
                                            children={getLegalText('termsOfUse')}
                                        />
                                        {localeUtils.isFrench() ? ' ' + getText('and') : ', '}
                                        <Link
                                            color='blue'
                                            underline={true}
                                            target='_blank'
                                            href={legalConstants.BEAUTY_INSIDER_TERMS_LINK}
                                            children={getLegalText('biTerms')}
                                        />
                                        {localeUtils.isUS() ? getLegalText('receiveOffers') : '.'}
                                    </Text>
                                )}
                                <fieldset>
                                    {showBirthdayForAutoEnrolled ||
                                        (!isRegisterModal && !isBIAutoEnroll && (
                                            <Text
                                                is='legend'
                                                marginBottom={2}
                                                fontWeight='bold'
                                                lineHeight='tight'
                                            >
                                                {biFormTestType === 'default' ? getText('enterBirthdayText') : getText('testEnterBirthdayText')}
                                            </Text>
                                        ))}

                                    {isRegisterModal && (
                                        <Grid
                                            marginBottom={4}
                                            marginTop={isCanada ? 0 : 4}
                                            gap={2}
                                            columns='auto 1fr'
                                            lineHeight='tight'
                                        >
                                            <Image
                                                src='/img/ufe/icons/birthday.svg'
                                                size='1.7em'
                                            />
                                            <Text
                                                is='p'
                                                fontWeight='bold'
                                                alignSelf='center'
                                                lineHeight='2'
                                            >
                                                {getText('enterBirthdayForGiftText')}
                                            </Text>
                                        </Grid>
                                    )}
                                    {isBIAutoEnroll || (
                                        <BiBirthdayForm
                                            isRequired={this.state.isJoinBIChecked}
                                            hideAsterisk={true}
                                            hideFormError={isRegisterModal}
                                            biData={biData}
                                            disabled={this.state.birthdayDisabled}
                                            ref={comp => {
                                                if (comp !== null) {
                                                    this.birthdayForm = comp;
                                                }
                                            }}
                                        />
                                    )}
                                </fieldset>
                            </>
                        )}
                    </Box>
                </div>
            </>
        );
    }
}

export default wrapComponent(BiRegisterForm, 'BiRegisterForm', true);
