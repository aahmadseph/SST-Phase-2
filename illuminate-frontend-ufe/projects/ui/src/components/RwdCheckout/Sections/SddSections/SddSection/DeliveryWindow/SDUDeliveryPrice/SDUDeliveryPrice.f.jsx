import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Text } from 'components/ui';

const SDUDeliveryPrice = ({ sduMemberFee, sduScheduledFee }) => {
    return (
        <Text
            is='p'
            color='gray'
            fontSize='sm'
            lineHeight='tight'
        >
            {sduMemberFee}{' '}
            <Text
                is='br'
                display={['none', 'block']}
            />
            {sduScheduledFee}
        </Text>
    );
};

SDUDeliveryPrice.defaultProps = {
    sduScheduledFee: '',
    sduMemberFee: ''
};

SDUDeliveryPrice.propTypes = {
    sduScheduledFee: PropTypes.string.isRequired,
    sduMemberFee: PropTypes.string.isRequired
};

export default wrapFunctionalComponent(SDUDeliveryPrice, 'SDUDeliveryPrice');
