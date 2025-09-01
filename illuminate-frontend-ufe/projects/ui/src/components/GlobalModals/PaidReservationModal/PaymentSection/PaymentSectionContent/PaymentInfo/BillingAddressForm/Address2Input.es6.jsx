import BaseClass from 'components/BaseClass';
import ErrorConstants from 'utils/ErrorConstants';
import FormValidator from 'utils/FormValidator';
import { Link } from 'components/ui';
import React from 'react';
import PropTypes from 'prop-types';
import * as StyleConfig from 'style/config';
import TextInput from 'components/Inputs/TextInput/TextInput';
import { wrapComponent } from 'utils/framework';

const {
    forms: { MARGIN_BOTTOM }
} = StyleConfig;
const { FIELD_LENGTHS } = FormValidator;

class Address2Input extends BaseClass {
    state = { showInput: false };

    render() {
        const { getText, value, onChange, addressLineTwoColor } = this.props;
        const { showInput } = this.state;

        if (!showInput) {
            return (
                <Link
                    onClick={() => this.setState({ showInput: true })}
                    display='block'
                    lineHeight='tight'
                    isPrimary
                    color={addressLineTwoColor}
                    marginBottom={MARGIN_BOTTOM}
                >
                    {`${getText('add')} ${getText('address2Label')}`}
                </Link>
            );
        }

        return (
            <TextInput
                name='address2'
                autoComplete='address-line2'
                autoCorrect='off'
                onChange={onChange}
                label={getText('address2Label')}
                maxLength={FIELD_LENGTHS.address}
                value={value}
                validateError={addressString => {
                    if (!FormValidator.isValidLength(addressString, 0, FIELD_LENGTHS.address)) {
                        return ErrorConstants.ERROR_CODES.ADDRESS1_LONG;
                    }

                    return null;
                }}
            />
        );
    }
}

Address2Input.defaultProps = { value: '' };
Address2Input.propTypes = {
    getText: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    addressLineTwoColor: PropTypes.string
};

export default wrapComponent(Address2Input, 'Address2Input');
