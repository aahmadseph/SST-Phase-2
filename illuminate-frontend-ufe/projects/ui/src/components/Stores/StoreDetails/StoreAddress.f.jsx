import React from 'react';
import { Link, Box } from 'components/ui';
import FramworkUtils from 'utils/framework';

const { wrapFunctionalComponent } = FramworkUtils;

function StoreAddress({ address, useTelLink, showCountry }) {
    const telLink = `tel:${address.phone.replace(/[^0-9]+/g, '')}`;

    return (
        <Box data-at={Sephora.debug.dataAt('store_location')}>
            {address.address1}
            {address.address2 && (
                <React.Fragment>
                    <br />
                    {address.address2}
                </React.Fragment>
            )}
            <br />
            {`${address.city}, ${address.state} ${address.postalCode}`}
            {showCountry && (
                <React.Fragment>
                    <br />
                    {address.country}
                </React.Fragment>
            )}
            <br />
            {!useTelLink ? (
                address.phone
            ) : (
                <Link
                    color='primary'
                    padding={1}
                    margin={-1}
                    href={telLink}
                    children={address.phone}
                />
            )}
        </Box>
    );
}

export default wrapFunctionalComponent(StoreAddress, 'StoreAddress');
