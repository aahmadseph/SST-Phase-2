/* eslint-disable class-methods-use-this */
import React from 'react';
import ReactDOM from 'react-dom';

import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import TextInput from 'components/Inputs/TextInput/TextInput';

class InputDate extends BaseClass {
    state = {
        value: this.props.value ? this.props.value : ''
    };

    render() {
        return (
            <TextInput
                {...this.props}
                type={this.props.type || 'date'}
                ref={c => {
                    if (c !== null) {
                        this.inputDate = c;
                    }
                }}
            />
        );
    }

    getValue = (raw = false) => {
        // Raw if return new Date().toString() value
        if (raw === true) {
            return this.inputDate.getValue();
        } else {
            const date = new Date(this.inputDate.getValue());
            const day = date.getDate() + 1;
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return {
                birthMonth: month,
                birthDay: day,
                birthYear: year
            };
        }
    };

    setValue = value => {
        this.inputDate.setValue(value, () => this.setState({ value: value }));
    };

    empty = () => {
        this.setValue('');
    };

    focus = () => {
        const element = ReactDOM.findDOMNode(this.inputDate);
        element.focus();
    };
}

export default wrapComponent(InputDate, 'InputDate', true);
