/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box } from 'components/ui';
import Address from 'components/Addresses/Address';
import AccessPointButton from 'components/Checkout/Shared/AccessPointButton';
import ShipOptionsDisplay from 'components/Checkout/Sections/ShipOptions/Display/ShipOptionsDisplay';
import UpdateError from 'components/Checkout/Shared/UpdateError';

class ShipAddressDisplay extends BaseClass {
    render() {
        const {
            address, isZeroCheckout, shippingMethod, isComplete, isHalAvailable, setAccessPoint, hasRRC
        } = this.props;

        return address && isComplete ? (
            <div>
                <Address
                    address={address}
                    isDisplayShippingOnCheckout
                />

                {isHalAvailable && (
                    <AccessPointButton
                        variant='noTitle'
                        callback={setAccessPoint}
                    />
                )}

                {isZeroCheckout && shippingMethod.isComplete && !hasRRC && (
                    <Box marginTop={4}>
                        <ShipOptionsDisplay shippingMethod={shippingMethod} />
                    </Box>
                )}
            </div>
        ) : (
            <UpdateError />
        );
    }
}

export default wrapComponent(ShipAddressDisplay, 'ShipAddressDisplay');
