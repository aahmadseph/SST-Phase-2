import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorList from 'components/ErrorList';
import Debounce from 'utils/Debounce';
import store from 'store/Store';
import {
    Box, Link, Grid, Button
} from 'components/ui';
import ErrorsUtils from 'utils/Errors';
import GiftCardExpandButton from 'components/FrictionlessCheckout/Payment/GiftCard/GiftCardExpandButton/GiftCardExpandButton';
import FrictionlessCheckoutBindings from 'analytics/bindingMethods/pages/FrictionlessCheckout/FrictionlessCheckoutBindings';
import { handleGiftCardNumberKeyDown, validateGiftCard, validateGiftCardPin } from 'utils/validateGiftCardInputs';
import formatGiftCardNumber from 'utils/formatGiftCardNumber';
import removeSpaces from 'utils/removeSpaces';

const giftCardNumberLength = FormValidator.FIELD_LENGTHS.giftCardNumber;
const giftCardPinLength = FormValidator.FIELD_LENGTHS.giftCardPin;

class GiftCard extends BaseClass {
    state = {
        showForm: false
    };

    onClick = () => {
        FrictionlessCheckoutBindings.setGiftCardPaymentAnalytics();
        this.setState({
            showForm: true
        });
    };

    validateGiftCardForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [this.giftCardNumberInput, this.giftCardPINInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);
        ErrorsUtils.validate();
        let totalErrors = store.getState().errors;
        totalErrors = Object.assign({}, totalErrors[ErrorConstants.ERROR_LEVEL.FIELD]);
        const hasErrors = Object.keys(totalErrors).length;

        return hasErrors;
    };

    handleCancelClick = () => {
        this.setState({
            showForm: false
        });
    };

    clearForm = () => {
        this.setState({
            giftCardNumber: '',
            giftCardPin: ''
        });
    };

    giftCardApplied = () => {
        this.clearForm();
        this.setState({ showForm: false, errorMessages: [] });
    };

    addGiftCard = e => {
        e.preventDefault();

        if (!this.validateGiftCardForm()) {
            const giftCard = {
                gcNumber: removeSpaces(this.state.giftCardNumber),
                gcPin: this.state.giftCardPin
            };
            this.props.applyGiftCard(giftCard, this.giftCardApplied).catch(err => {
                ErrorsUtils.collectAndValidateBackEndErrors(err, this);
                this.setState({ errorMessages: err.errorMessages });
            });
        }
    };

    handleOnChange = e => {
        const { name, value } = e.target;

        // Format gift card number for display, keep other fields as-is
        const formattedValue = name === 'giftCardNumber' ? formatGiftCardNumber(value) : value;

        this.setState({
            [name]: formattedValue
        });
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

        this.setState({
            giftCardNumber: formattedValue
        });
    };

    addGiftCardDebounce = Debounce.preventDoubleClick(this.addGiftCard);

    renderGiftCardForm = () => {
        const { localization } = this.props;

        return (
            <>
                <Box
                    is='form'
                    noValidate
                    id='giftcard_form'
                    action=''
                    autoComplete='off'
                    marginTop={[4, 5]}
                    marginLeft={[3, 5]}
                    marginRight={3}
                    maxWidth={640}
                    onSubmit={this.addGiftCardDebounce}
                >
                    <ErrorList errorMessages={this.state.errorMessages} />
                    <Grid
                        gap={3}
                        columns={[2, '2fr 1fr 1fr']}
                    >
                        <Box gridColumn={['1 / -1', 1]}>
                            <TextInput
                                marginBottom={null}
                                autoOff={true}
                                name='giftCardNumber'
                                label={localization.giftCardNumber}
                                required={true}
                                type='tel'
                                value={this.state.giftCardNumber}
                                onChange={this.handleOnChange}
                                ref={comp => (this.giftCardNumberInput = comp)}
                                validateError={giftCardNumber => validateGiftCard(giftCardNumber, false)}
                                onKeyDown={handleGiftCardNumberKeyDown}
                                onPaste={this.handleGiftCardNumberPaste}
                                maxLength={giftCardNumberLength}
                                data-at={Sephora.debug.dataAt('gc_card_input')}
                            />
                        </Box>
                        <TextInput
                            marginBottom={null}
                            autoOff={true}
                            name='giftCardPin'
                            label={localization.pin}
                            required={true}
                            type='tel'
                            value={this.state.giftCardPin}
                            onChange={this.handleOnChange}
                            ref={comp => (this.giftCardPINInput = comp)}
                            validateError={giftCardPin => validateGiftCardPin(giftCardPin, false)}
                            onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                            onPaste={FormValidator.pasteAcceptOnlyNumbers}
                            maxLength={giftCardPinLength}
                            data-at={Sephora.debug.dataAt('pin_input')}
                        />
                        <Button
                            variant='secondary'
                            type='submit'
                            block={true}
                            ref={comp => (this.applyButton = comp)}
                            children={localization.applyBtn}
                            data-at={Sephora.debug.dataAt('gc_apply_btn')}
                        />
                    </Grid>
                </Box>
                <Link
                    marginTop={2}
                    marginLeft={[3, 5]}
                    color='blue'
                    children={localization.cancelBtn}
                    onClick={this.handleCancelClick}
                />
            </>
        );
    };

    render() {
        const { showForm } = this.state;
        const { localization, isEditMode } = this.props;

        return (
            <>
                {!showForm ? (
                    <GiftCardExpandButton
                        useGiftCard={localization.useGiftCard}
                        onClick={this.onClick}
                        isEditMode={isEditMode}
                    />
                ) : (
                    this.renderGiftCardForm()
                )}
            </>
        );
    }
}

export default wrapComponent(GiftCard, 'GiftCard', true);
