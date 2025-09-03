/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box, Button, Grid } from 'components/ui';
import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import ErrorConstants from 'utils/ErrorConstants';
import ErrorList from 'components/ErrorList';
import { handleGiftCardNumberKeyDown, validateGiftCard, validateGiftCardPin } from 'utils/validateGiftCardInputs';
import formatGiftCardNumber from 'utils/formatGiftCardNumber';
import removeSpaces from 'utils/removeSpaces';

import store from 'store/Store';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';

const giftCardNumberLength = FormValidator.FIELD_LENGTHS.giftCardNumber;
const giftCardPinLength = FormValidator.FIELD_LENGTHS.giftCardPin;

class GiftCardForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
            errorMessages: '',
            giftCardNumber: '',
            giftCardPinNumber: ''
        };
    }

    componentDidMount() {
        store.setAndWatch('editData.' + this.props.editSectionName, this, editData => {
            const data = editData[this.props.editSectionName] || {};
            this.setState({
                editGiftCardNumber: data.editGiftCardNumber,
                editGiftCardPinNumber: data.editGiftCardPinNumber
            });
        });
        this.giftCardNumberInput.focus();
        this.props.onRef(this);
    }

    handleChange = event => {
        const editStore = store.getState().editData[this.props.editSectionName];
        const { name, value } = event.target;

        // Format gift card number for display, keep other fields as-is
        const formattedValue = name === 'editGiftCardNumber' ? formatGiftCardNumber(value) : value;

        this.props.updateEditData(Object.assign({}, editStore, { [name]: formattedValue }), this.props.editSectionName);
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

        const editStore = store.getState().editData[this.props.editSectionName];
        this.props.updateEditData(Object.assign({}, editStore, { editGiftCardNumber: formattedValue }), this.props.editSectionName);
    };

    validateForm = () => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = [this.giftCardNumberInput, this.giftCardPINInput];
        ErrorsUtils.collectClientFieldErrors(fieldsForValidation);
        ErrorsUtils.validate();
        let totalErrors = store.getState().errors;
        totalErrors = Object.assign({}, totalErrors[ErrorConstants.ERROR_LEVEL.FIELD]);
        const hasErrors = Object.keys(totalErrors).length;

        return hasErrors;
    };

    clearForm = () => {
        this.setState({
            showError: false,
            errorMessages: '',
            giftCardNumber: '',
            giftCardPinNumber: ''
        });
    };

    addGiftCard = e => {
        e.preventDefault();

        if (!this.validateForm()) {
            const giftCard = {
                gcNumber: removeSpaces(this.state.editGiftCardNumber),
                gcPin: this.state.editGiftCardPinNumber
            };
            this.props.applyGiftCard(giftCard, this.props.editSectionName).catch(err => {
                ErrorsUtils.collectAndValidateBackEndErrors(err, this);
                this.setState({ errorMessages: err.errorMessages });
            });
        } else {
            ReactDOM.findDOMNode(this.applyButton).focus();
        }
    };

    addGiftCardDebounce = Debounce.preventDoubleClick(this.addGiftCard);

    componentWillUnmount() {
        this.props.clearEditData(this.props.editSectionName);
    }

    render() {
        const { giftCardNumberText, apply, pin } = this.props.localization;

        return (
            <Box
                is='form'
                noValidate
                id='giftcard_form'
                action=''
                autoComplete='off'
                marginTop={[4, 5]}
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
                            name='editGiftCardNumber'
                            label={giftCardNumberText}
                            required={true}
                            type='tel'
                            value={this.state.editGiftCardNumber || ''}
                            onChange={this.handleChange}
                            ref={comp => (this.giftCardNumberInput = comp)}
                            onKeyDown={handleGiftCardNumberKeyDown}
                            onPaste={this.handleGiftCardNumberPaste}
                            maxLength={giftCardNumberLength}
                            validateError={giftCardNumber => validateGiftCard(giftCardNumber, false)}
                            data-at={Sephora.debug.dataAt('gc_card_input')}
                        />
                    </Box>
                    <TextInput
                        marginBottom={null}
                        autoOff={true}
                        name='editGiftCardPinNumber'
                        label={pin}
                        required={true}
                        type='tel'
                        value={this.state.giftCardPinNumber}
                        onChange={this.handleChange}
                        ref={comp => (this.giftCardPINInput = comp)}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        maxLength={giftCardPinLength}
                        validateError={giftCardPin => validateGiftCardPin(giftCardPin, false)}
                        data-at={Sephora.debug.dataAt('pin_input')}
                    />
                    <Button
                        variant='secondary'
                        type='submit'
                        block={true}
                        ref={comp => (this.applyButton = comp)}
                        children={apply}
                        data-at={Sephora.debug.dataAt('gc_apply_btn')}
                    />
                </Grid>
            </Box>
        );
    }
}

export default wrapComponent(GiftCardForm, 'GiftCardForm');
