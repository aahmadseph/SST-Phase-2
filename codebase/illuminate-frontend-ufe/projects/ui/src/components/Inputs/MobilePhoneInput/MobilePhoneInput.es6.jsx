import React from 'react';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { wrapFunctionalComponent } from 'utils/framework';

import TextInput from 'components/Inputs/TextInput/TextInput';
import FormValidator from 'utils/FormValidator';
import HelperUtils from 'utils/Helpers';

class MobilePhoneInput extends BaseClass {
    state = {
        phone: this.props.initialValue,
        formattedPhone:
            this.props.initialValue && this.props.initialValue.length > 0 ? FormValidator.getFormattedPhoneNumber(this.props.initialValue) : '',
        cursorPosition: 0
    };

    updatePhoneState = e => {
        const updatedObj = {};

        updatedObj['phone'] = e.target.value.replace(HelperUtils.specialCharacterRegex, '');
        updatedObj['formattedPhone'] = FormValidator.getFormattedPhoneNumber(updatedObj['phone']) || updatedObj['phone'];
        updatedObj['cursorPosition'] = e.target.selectionStart;

        this.setState(updatedObj);
    };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.phone !== this.state.phone) {
            if (this.props.onChange) {
                this.props.onChange(this.state.phone, this.state.cursorPosition);
            }
        }
    }

    componentDidMount() {
        if (this.props.initialValue && this.props.onChange) {
            this.props.onChange(this.props.initialValue, this.state.cursorPosition);
        }
    }

    render() {
        const { forwardedRef, invalid, ...props } = this.props;

        return (
            <TextInput
                {...props}
                ref={forwardedRef}
                autoComplete='tel'
                autoCorrect='off'
                type='tel'
                value={this.state.formattedPhone}
                onPaste={FormValidator.pasteAcceptOnlyNumbers}
                onKeyDown={FormValidator.inputAcceptOnlyNumbers}
                onChange={this.updatePhoneState}
                maxLength={FormValidator.FIELD_LENGTHS.formattedPhone}
                invalid={invalid}
            />
        );
    }
}

const WrappedMobilePhoneInput = wrapComponent(MobilePhoneInput, 'MobilePhoneInput');

const MobilePhoneInputWithForwardRef = React.forwardRef((props, ref) => {
    return (
        <WrappedMobilePhoneInput
            {...props}
            forwardedRef={ref}
        />
    );
});

export default wrapFunctionalComponent(MobilePhoneInputWithForwardRef, 'MobilePhoneInputWithForwardRef');
