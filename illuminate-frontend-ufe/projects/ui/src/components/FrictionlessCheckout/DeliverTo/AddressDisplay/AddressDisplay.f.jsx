import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Text, Flex, Link
} from 'components/ui';
import { getLocationHoursText } from 'utils/AccessPoints';
import localeUtils from 'utils/LanguageLocale';

function HalAddress({ address, halOperatingHours, holdAtLocation }) {
    const {
        address1, city, state, postalCode, isDraft
    } = address;

    const locationHoursText = getLocationHoursText(halOperatingHours);

    return (
        <>
            {!isDraft && (
                <Text
                    is='p'
                    fontSize='sm'
                    children={holdAtLocation}
                    display='inline-block'
                />
            )}

            <Text
                is='p'
                fontSize={['base', 'base', 'md']}
                fontWeight={[!isDraft && 'bold']}
                lineHeight={1.3}
                children={address.halCompany}
            />

            {localeUtils.isCanada() ? (
                <>
                    {isDraft ? (
                        <Text
                            is='p'
                            fontSize={'base'}
                            lineHeight={'tight'}
                            children={`${address1}, ${city}, ${state} ${postalCode}`}
                        />
                    ) : (
                        <>
                            <Text
                                is='p'
                                fontSize={'base'}
                                lineHeight={1.3}
                                children={address1}
                            />
                            <Text
                                is='p'
                                fontSize={'base'}
                                lineHeight={1.3}
                                children={`${city}, ${state} ${postalCode}`}
                            />
                        </>
                    )}
                </>
            ) : (
                <Text
                    is='p'
                    fontSize={'base'}
                    children={`${address1}, ${city}, ${state} ${postalCode}`}
                />
            )}
            <Text
                is='p'
                {...(!isDraft && { marginTop: 1 })}
                fontSize='sm'
                children={locationHoursText}
            />
        </>
    );
}

function ShippingAddress({
    address, showEdit, onChangeClick, localization, changeShippingAddress
}) {
    const {
        firstName, lastName, address1, address2, city, state, postalCode
    } = address;

    return (
        <Flex justifyContent='space-between'>
            <Box>
                <Text
                    is='p'
                    fontWeight='bold'
                    fontSize={['base', 'base', 'md']}
                    children={`${firstName} ${lastName}`}
                />
                <Text
                    is='p'
                    fontSize={['base', 'base', 'md']}
                    children={address1}
                />
                <Text
                    is='p'
                    fontSize={['base', 'base', 'md']}
                    children={address2}
                />
                <Text
                    is='p'
                    fontSize={['base', 'base', 'md']}
                    children={`${city ? city + ' ' : ''}${state} ${postalCode}`}
                />
            </Box>
            {showEdit && (
                <Box>
                    <Link
                        color='link'
                        lineHeight='tight'
                        children={localization.edit}
                        onClick={() => onChangeClick(true)}
                        aria-label={changeShippingAddress}
                    />
                </Box>
            )}
        </Flex>
    );
}

function AddressDisplay({
    address,
    isHal,
    children,
    halOperatingHours,
    holdAtLocation,
    showEdit,
    onChangeClick,
    localization,
    changeShippingAddress
}) {
    return (
        <>
            <Box css={{ textTransform: 'capitalize' }}>
                {isHal ? (
                    <>
                        <HalAddress
                            address={address}
                            halOperatingHours={halOperatingHours}
                            holdAtLocation={holdAtLocation}
                        />
                        {children}
                    </>
                ) : (
                    <ShippingAddress
                        address={address}
                        showEdit={showEdit}
                        onChangeClick={onChangeClick}
                        localization={localization}
                        changeShippingAddress={changeShippingAddress}
                    />
                )}
            </Box>
            {!isHal && children}
        </>
    );
}

export default wrapFunctionalComponent(AddressDisplay, 'AddressDisplay');
