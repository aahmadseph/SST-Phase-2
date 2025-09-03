import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';
import CheckoutItemsList from 'components/FrictionlessCheckout/CheckoutItemsList';

function ZeroCheckoutItems() {
    return (
        <Box
            borderRadius={3}
            boxShadow={'light'}
            marginTop={[4, 4, 5]}
            padding={[4, 4, 5]}
        >
            <CheckoutItemsList shouldDisplayTitle={true} />
        </Box>
    );
}

export default wrapFunctionalComponent(ZeroCheckoutItems, 'ZeroCheckoutItems');
