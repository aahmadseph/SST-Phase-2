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
import localeUtils from 'utils/LanguageLocale';

import store from 'store/Store';
import checkoutApi from 'services/api/checkout';
import OrderActions from 'actions/OrderActions';
import Debounce from 'utils/Debounce';
import ErrorsUtils from 'utils/Errors';
import EditDataActions from 'actions/EditDataActions';
import decorators from 'utils/decorators';
import formatGiftCardNumber from 'utils/formatGiftCardNumber';
import removeSpaces from 'utils/removeSpaces';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';
import { handleGiftCardNumberKeyDown, validateGiftCard, validateGiftCardPin } from 'utils/validateGiftCardInputs';

const giftCardNumberLength = FormValidator.FIELD_LENGTHS.giftCardNumber;
const giftCardPinLength = FormValidator.FIELD_LENGTHS.giftCardPin;

class GiftCardForm extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            showError: false,
            errorMessages: '',
            editGiftCardNumber: '',
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
    }

    handleChange = event => {
        const editStore = store.getState().editData[this.props.editSectionName];
        const { name, value } = event.target;

        // Format gift card number for display, keep other fields as-is
        const formattedValue = name === 'editGiftCardNumber' ? formatGiftCardNumber(value) : value;
        store.dispatch(
            EditDataActions.updateEditData(Object.assign({}, editStore, { [event.target.name]: formattedValue }), this.props.editSectionName)
        );
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

        const editStore = store.getState().editData[this.props.editSectionName];
        store.dispatch(
            EditDataActions.updateEditData(Object.assign({}, editStore, { editGiftCardNumber: formattedValue }), this.props.editSectionName)
        );
    };

    validateForm = ({ validationInput } = {}) => {
        ErrorsUtils.clearErrors();
        const fieldsForValidation = validationInput ? [validationInput] : [this.giftCardNumberInput, this.giftCardPINInput];
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
            editGiftCardNumber: '',
            editGiftCardPinNumber: ''
        });
    };

    addGiftCard = e => {
        e.preventDefault();

        if (!this.validateForm()) {
            const giftCard = {
                gcNumber: removeSpaces(this.state.editGiftCardNumber),
                gcPin: this.state.editGiftCardPinNumber
            };
            decorators
                .withInterstice(
                    checkoutApi.applyGiftCard,
                    INTERSTICE_DELAY_MS
                )(giftCard)
                .then(() => {
                    store.dispatch(EditDataActions.clearEditData(this.props.editSectionName));
                    store.dispatch(OrderActions.giftCardApplied());
                })
                .catch(err => {
                    ErrorsUtils.collectAndValidateBackEndErrors(err, this);
                    this.setState({ errorMessages: err.errorMessages });
                });
        } else {
            ReactDOM.findDOMNode(this.applyButton).focus();
        }
    };

    addGiftCardDebounce = Debounce.preventDoubleClick(this.addGiftCard);

    componentWillUnmount() {
        store.dispatch(EditDataActions.clearEditData(this.props.editSectionName));
    }

    render() {
        const getText = localeUtils.getLocaleResourceFile('components/Checkout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');

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
                            label={getText('giftCardNumber')}
                            required={true}
                            type='tel'
                            value={this.state.editGiftCardNumber}
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
                        label={getText('pin')}
                        required={true}
                        type='tel'
                        value={this.state.giftCardPinNumber}
                        onChange={this.handleChange}
                        ref={comp => (this.giftCardPINInput = comp)}
                        onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                        onPaste={FormValidator.pasteAcceptOnlyNumbers}
                        maxLength={giftCardPinLength}
                        validateError={pin => validateGiftCardPin(pin, false)}
                        data-at={Sephora.debug.dataAt('pin_input')}
                    />
                    <Button
                        variant='secondary'
                        type='submit'
                        block={true}
                        ref={comp => (this.applyButton = comp)}
                        children={getText('apply')}
                        data-at={Sephora.debug.dataAt('gc_apply_btn')}
                    />
                </Grid>
            </Box>
        );
    }
}

export default wrapComponent(GiftCardForm, 'GiftCardForm');
