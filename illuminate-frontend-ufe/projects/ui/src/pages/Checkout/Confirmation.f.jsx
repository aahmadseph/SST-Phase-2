import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import OrderConfirmation from 'components/OrderConfirmation';

const Confirmation = props => {
    return (
        <div>
            <OrderConfirmation {...props} />
        </div>
    );
};

export default wrapFunctionalComponent(Confirmation, 'Confirmation');
