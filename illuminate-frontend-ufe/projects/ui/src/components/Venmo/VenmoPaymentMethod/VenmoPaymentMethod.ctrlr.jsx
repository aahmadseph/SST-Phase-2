/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import DefaultPaymentCheckbox from 'components/RwdCheckout/Sections/Payment/Section/DefaultPaymentCheckbox';
import { Box } from 'components/ui';
import Venmo from 'utils/Venmo';

class VenmoPaymentMethod extends BaseClass {
    componentDidMount() {
        Venmo.initializeVenmoCheckout();
    }

    render() {
        const { isAnonymous, marginLeft = [0, 6] } = this.props;

        return (
            <>
                <Box
                    width={'100%'}
                    marginLeft={marginLeft}
                >
                    {!isAnonymous && <DefaultPaymentCheckbox paymentName={'venmo'} />}
                </Box>
            </>
        );
    }
}

export default wrapComponent(VenmoPaymentMethod, 'VenmoPaymentMethod', true);
