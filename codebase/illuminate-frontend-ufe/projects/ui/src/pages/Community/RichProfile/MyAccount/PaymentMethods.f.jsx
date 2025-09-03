import React from 'react';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;

import AccountPaymentsPage from 'components/RichProfile/MyAccount/Payments/Payments';
import ufeApi from 'services/api/ufeApi';

const PaymentMethods = () => {
    return (
        <div>
            <AccountPaymentsPage requestCounter={ufeApi.getCallsCounter()} />
        </div>
    );
};

export default wrapFunctionalComponent(PaymentMethods, 'PaymentMethods');
