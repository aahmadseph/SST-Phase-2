import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import AccountAddresses from 'components/RichProfile/MyAccount/Addresses/Addresses';
import ufeApi from 'services/api/ufeApi';

const Addresses = () => {
    return (
        <div>
            <AccountAddresses requestCounter={ufeApi.getCallsCounter()} />
        </div>
    );
};

export default wrapFunctionalComponent(Addresses, 'Addresses');
