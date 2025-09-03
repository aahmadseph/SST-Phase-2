import React from 'react';
import { Box, Text } from 'components/ui';
import { wrapFunctionalComponent } from 'utils/framework';

const phoneNumberRegex = /(\d{3})(\d{3})(\d{4})/;

const Address = props => {
    const { address, showDefault } = props;

    if (!address) {
        return null;
    }

    const phoneNumber =
        (address.country === 'US' || address.country === 'CA') && address.phone
            ? address.phone.replace(phoneNumberRegex, '($1) $2-$3')
            : address.phone;

    return (
        <Box css={{ textTransform: 'capitalize' }}>
            <Box>
                <Text
                    fontWeight={'bold'}
                    data-at={Sephora.debug.dataAt('ship_addr_user_name')}
                >
                    {address.firstName} {address.lastName}
                </Text>
                {showDefault && address.isDefault && <Text> (Default)</Text>}
            </Box>
            <div data-at={Sephora.debug.dataAt('ship_addr_line_1')}>{address.address1}</div>
            {address.address2 && <div data-at={Sephora.debug.dataAt('ship_addr_line_2')}>{address.address2}</div>}
            {address.city ? (
                <div data-at={Sephora.debug.dataAt('ship_addr_state')}>
                    {address.city}, {address.state} {address.postalCode}
                </div>
            ) : (
                <div data-at={Sephora.debug.dataAt('ship_addr_state')}>
                    {address.state} {address.postalCode}
                </div>
            )}

            <div data-at={Sephora.debug.dataAt('ship_addr_phone')}>{phoneNumber}</div>
        </Box>
    );
};

export default wrapFunctionalComponent(Address, 'Address');
