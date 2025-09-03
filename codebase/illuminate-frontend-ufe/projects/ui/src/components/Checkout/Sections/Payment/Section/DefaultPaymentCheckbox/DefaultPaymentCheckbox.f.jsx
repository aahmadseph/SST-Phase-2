import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Checkbox from 'components/Inputs/Checkbox/Checkbox';
import { Text } from 'components/ui';

const DefaultPaymentCheckbox = ({
    paymentName, checked, disabled, onClick, setAsDefaultPaymentLabel, setAsDefaultPaymentNoticeLabel
}) => {
    return (
        <>
            <Checkbox
                paddingY={2}
                checked={checked}
                disabled={disabled}
                onClick={() => onClick(paymentName)}
            >
                {setAsDefaultPaymentLabel}
            </Checkbox>
            <Text
                is='p'
                fontSize='sm'
                marginTop={1}
                marginBottom={3}
                children={setAsDefaultPaymentNoticeLabel}
            />
        </>
    );
};

DefaultPaymentCheckbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default wrapFunctionalComponent(DefaultPaymentCheckbox, 'DefaultPaymentCheckbox');
