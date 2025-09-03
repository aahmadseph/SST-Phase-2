import React from 'react';
import { Box, Text } from 'components/ui';
import LanguageLocale from 'utils/LanguageLocale';
import FetchLocationHours from 'components/SharedComponents/AccessPoint/FetchLocationHours/FetchLocationHours';
import { wrapFunctionalComponent } from 'utils/framework';

const phoneNumberRegex = /(\d{3})(\d{3})(\d{4})/;

const Address = props => {
    const getText = LanguageLocale.getLocaleResourceFile('components/Addresses/locales', 'Address');
    const {
        address, isDisplayShippingOnCheckout, isEditShippingOnCheckout, hasHalAddress, isHalAddress, isOrderConfirmation
    } = props;

    if (!address) {
        return null;
    }

    const phoneNumber =
        (address.country === 'US' || address.country === 'CA') && address.phone
            ? address.phone.replace(phoneNumberRegex, '($1) $2-$3')
            : address.phone;

    return (
        <Box css={{ textTransform: 'capitalize' }}>
            <Box marginBottom={isEditShippingOnCheckout ? 1 : null}>
                {hasHalAddress || isHalAddress ? (
                    <Text>{address.halCompany}</Text>
                ) : (
                    <Text
                        fontWeight={isEditShippingOnCheckout ? 'bold' : null}
                        data-at={Sephora.debug.dataAt('ship_addr_user_name')}
                    >
                        {address.firstName} {address.lastName}
                    </Text>
                )}
                {isEditShippingOnCheckout && address.isDefault && ` (${getText('default')})`}
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
            {isDisplayShippingOnCheckout || hasHalAddress || (
                <div>
                    <div data-at={Sephora.debug.dataAt('ship_addr_country')}>{address.country}</div>

                    {!isHalAddress && <div data-at={Sephora.debug.dataAt('ship_addr_phone')}>{phoneNumber}</div>}
                </div>
            )}
            {hasHalAddress && (
                <FetchLocationHours
                    halAddress={address}
                    isOrderConfirmation={isOrderConfirmation}
                />
            )}
        </Box>
    );
};

export default wrapFunctionalComponent(Address, 'Address');
